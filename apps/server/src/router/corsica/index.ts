import { loggedInProcedure } from "../../procedures";
import { t } from "../../trpc";
import { GenerateS3SignedUrlsInput, GenerateS3SignedUrlsOutput, MergeGpxInput } from "@repo/schemas/api/procedures/corsica";
import { TRPCError } from "@trpc/server";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { config } from "../../config";
import { logger } from "../../logger";
import { S3_PATH_PREFIX } from "./helpers/consts";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import z from "zod";
import { Multipart } from "@fastify/multipart";

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
          const command = new PutObjectCommand({
            Bucket: config.S3_BUCKET_NAME,
            Key: `${S3_PATH_PREFIX}${file.name}`,
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

  mergeGpx: loggedInProcedure
    .use(async ({ ctx, next, input }) => {
      if (!ctx.req.isMultipart()) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Request must be multipart' });
      }

      console.log(input);
      const formData = new FormData();

      for await (const part of ctx.req.parts()) {
        console.log(part.fields)
        if (part.type === 'file') {
          const buff = await part.toBuffer()
          const file = new File([buff], part.filename, { type: part.type });
          formData.append(part.fieldname, file);
        } else {
          const field = part.fieldname;
          const value = part.value;
          formData.append(field, value);
        }
      }


      return next({
        input: {
          formData: formData
        }
      })
    })
    .mutation(async ({ ctx, input }) => {
      console.log(input);
      
      // TODO: process your 'parts' as needed
      return { };
    })
})