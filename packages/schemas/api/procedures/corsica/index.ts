import z from "zod"
import { AnalysisZodType } from "./analyse"
export * from "./analyse"

export const CorsicaScope = z.enum(['analyse/example', 'analyse/custom', 'merge'])

export const GenerateS3SignedUrlsInput = z.object({
  files: z.array(z.object({
    name: z.string(),
    type: z.string(),
  })),
  scope: CorsicaScope
})

export const GenerateS3SignedUrlsOutput = z.object({
  urls: z.array(
    z.object({
      filename: z.string(),
      uploadUrl: z.string()
    })
  ),
})

export const MergeGpxInput = z.object({
  newName: z.string(),
  files: z.array(z.object({
    id: z.string(),
  }))
})

export const MergeGpxOutput = z.object({
  url: z.string()
})

export const DeleteFilesInput = z.object({
  files: z.array(z.object({
    name: z.string(),
  })),
  scope: CorsicaScope
})

export const DeleteFilesOutput = z.object({
  message: z.string()
})

export const AnalyseGPXInput = z.object({
  id: z.string(),
  example: z.boolean()
})

export const AnalyseGPXOutput = AnalysisZodType;

// Type-only schema for server-side (we parse manually, but this provides the type)
export type MergeGpxInputType = z.infer<typeof MergeGpxInput>;

export const GetExamplesOutput = z.array(z.object({
  key: z.string(),
  size: z.number()
}))