import { Context } from "../../../context";
import { MultipartFile } from "@fastify/multipart";
import { TRPCError } from "@trpc/server";

export const getFormData = async (ctx: Context): Promise<FormData> => {
  if (!ctx.req.isMultipart()) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Request does not support multipart/form-data",
    });
  }

  // Parse parts and build FormData-like object
  const parts = ctx.req.parts();
  const formData = new FormData();

  try {
    for await (const part of parts) {
      if (part.type === "file") {
        const multipartFile = part as MultipartFile;
        const buffer = await multipartFile.toBuffer();
        const file = new File(
          [buffer],
          multipartFile.filename || "file",
          { type: multipartFile.mimetype || "application/octet-stream" }
        );
        formData.append(multipartFile.fieldname, file);
      } else {
        formData.append(part.fieldname, part.value);
      }
    }

    return formData;
  } catch (err) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Failed to parse form data",
      cause: err,
    });
  }
}