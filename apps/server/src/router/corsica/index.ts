import { loggedInProcedure } from "../../procedures";
import { publicProcedure, t } from "../../trpc";
import { DeleteFilesInput, DeleteFilesOutput, GenerateS3SignedUrlsInput, GenerateS3SignedUrlsOutput, GetExamplesOutput } from "@repo/schemas/api/procedures/corsica";
import { TRPCError } from "@trpc/server";
import { DeleteObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { config } from "../../config";
import { logger } from "../../logger";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { mergeGpxProcedure } from "./procedures/mergeGpx";
import { analyseGPXProcedure } from "./procedures/analyseGpx";
import { addS3PathPrefix, ANALYSE_EXAMPLES_PREFIX, generateS3Key, removeExamplesPrefix, removeS3PathPrefix } from "./utils/prefix";

export const corsicaRouter = t.router({
  generateS3SignedUrls: loggedInProcedure
    .input(GenerateS3SignedUrlsInput)
    .output(GenerateS3SignedUrlsOutput)
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

        const urlPromises = input.files.map(async (file) => {
          const key = generateS3Key(file.name, input.scope);
          const command = new PutObjectCommand({
            Bucket: config.S3_BUCKET_NAME,
            Key: key,
            ContentType: file.type,
          });
          // @ts-expect-error version mismatch between @aws-sdk/client-s3 and @aws-sdk/s3-request-presigner
          const url = await getSignedUrl(s3Client, command);
          return { filename: file.name, uploadUrl: url };
        });

        return { urls: await Promise.all(urlPromises) };
      } catch (error) {
        logger.error(error, 'Error uploading files');
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to upload files' });
      }
    }),

  deleteFiles: loggedInProcedure
    .input(DeleteFilesInput)
    .output(DeleteFilesOutput)
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

        await Promise.all(input.files.map(async (file) => {
          const key = generateS3Key(file.name, input.scope);
          const command = new DeleteObjectCommand({
            Bucket: config.S3_BUCKET_NAME,
            Key: key,
          });
          await s3Client.send(command);
        }))
      } catch (error) {
        logger.error(error, 'Error deleting files');
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to delete files' });
      }

      return { message: 'Files deleted successfully' };
    }),
  mergeGpx: mergeGpxProcedure,
  analyseGPX: analyseGPXProcedure,

  getExamples: publicProcedure
    .output(GetExamplesOutput)
    .query(async () => {
      const s3Client = new S3Client({
        region: config.S3_REGION,
        endpoint: config.S3_ENDPOINT,
        credentials: {
          accessKeyId: config.S3_ACCESS_KEY,
          secretAccessKey: config.S3_SECRET_KEY,
        },
      });

      const command = new ListObjectsV2Command({
        Bucket: config.S3_BUCKET_NAME,
        Prefix: addS3PathPrefix(ANALYSE_EXAMPLES_PREFIX),
      });

      const response = await s3Client.send(command);

      return response.Contents?.map((item) => ({
        key: removeS3PathPrefix(removeExamplesPrefix(item.Key || '')),
        size: item.Size || 0,
      })) || [];
    }),
})