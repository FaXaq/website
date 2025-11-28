import z from "zod"
import { zfd } from "zod-form-data"

export const GenerateS3SignedUrlsInput = z.object({
  files: z.array(z.object({
    name: z.string(),
    type: z.string(),
  }))
})

export const GenerateS3SignedUrlsOutput = z.object({
  urls: z.array(
    z.object({
      filename: z.string(),
      uploadUrl: z.string()
    })
  ),
})

export const MergeGpxInput = zfd.formData({
  name: zfd.text(),
  files: zfd.repeatable(zfd.file())
});
