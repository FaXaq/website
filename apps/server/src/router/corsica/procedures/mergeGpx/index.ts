import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { MergeGpxInput, MergeGpxOutput } from "@repo/schemas/api/procedures/corsica";
import { config } from "../../../../config";
import { loggedInProcedure } from "../../../../procedures";
import { generateS3Key } from "../../utils/generateS3Key";
import { TRPCError } from "@trpc/server";
import { parseGPX } from "./utils/parseActivity";
import { XMLBuilder } from "fast-xml-parser";
import { XML_ATTRIBUTE_PREFIX } from "./utils/consts";
import { logger } from "../../../../logger";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const mergeGpxProcedure = loggedInProcedure
    .input(MergeGpxInput)
    .output(MergeGpxOutput)
    .mutation(async ({ input }) => {      
      try {
        const s3Client = new S3Client({
          region: config.S3_REGION,
          endpoint: config.S3_ENDPOINT,
          credentials: {
            accessKeyId: config.S3_ACCESS_KEY,
            secretAccessKey: config.S3_SECRET_KEY,
          },
        });

        const files = await Promise.all(input.files.map(async (file) => {
          const key = generateS3Key(file.id, 'merge');
          const command = new GetObjectCommand({
            Bucket: config.S3_BUCKET_NAME,
            Key: key,
          });
          const response = await s3Client.send(command);
          if (!response.Body) {
            throw new TRPCError({ code: 'NOT_FOUND', message: 'File not found' });
          }

          // create blob from response.Body
          const blob = new Blob([await response.Body.transformToByteArray()], { type: response.ContentType });

          return new File([blob], file.id, { type: response.ContentType });
        }))

        const parsedFiles = await Promise.all(files.map(async (file) => parseGPX(file)));
        const sortedParsedFiles = parsedFiles
          .sort((a, b) => new Date(a.gpx.metadata?.time || '').getTime() - new Date(b.gpx.metadata?.time || '').getTime());
        const mergedFile = sortedParsedFiles[0];
        for (let i = 1; i < sortedParsedFiles.length; i++) {
          mergedFile.gpx.trk.trkseg.trkpt
            .push(...sortedParsedFiles[i].gpx.trk.trkseg.trkpt);
          mergedFile.gpx.trk.name += ` + ${sortedParsedFiles[i].gpx.trk.name}`;
        }

        mergedFile.gpx.__ATTRIBUTE__creator = 'https://norra.fr/projects/corsica';
        mergedFile.gpx.trk.name = input.newName;

        const builder = new XMLBuilder({
          ignoreAttributes: false,
          attributeNamePrefix: XML_ATTRIBUTE_PREFIX
        });

        const blob = new Blob([builder.build(mergedFile)], { type: 'application/octet-stream' });
        const arrayBuffer = await blob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const key = generateS3Key(`${input.newName}.gpx`, 'merge');
        const command = new PutObjectCommand({
          Bucket: config.S3_BUCKET_NAME,
          Key: key,
          Body: buffer,
          ContentType: 'application/octet-stream',
        });
        await s3Client.send(command);
        // get signed url to download merged file
        const downloadCommand = new GetObjectCommand({
          Bucket: config.S3_BUCKET_NAME,
          Key: key,
        });
        // @ts-expect-error version mismatch between @aws-sdk/client-s3 and @aws-sdk/s3-request-presigner
        const url = await getSignedUrl(s3Client, downloadCommand);
        return { url };
      } catch (error) {
        logger.error(error, 'Error merging files');
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to merge files', cause: error });
      }
    })