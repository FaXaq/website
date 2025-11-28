import z from "zod";

export const ColorSchema = z.object({
  "index": z.number(),
  "name": z.string(),
  "slug": z.string(),
  "cmyk_array": z.array(z.number()),
  "cmyk": z.string(),
  "rgb_array": z.array(z.number()),
  "rgb": z.string(),
  "hex": z.string(),
  "combinations": z.array(z.number()),
  "use_count": z.number()
});

export const ColorsSchema = z.object({
  colors: z.array(ColorSchema)
});

export type ColorsType = z.infer<typeof ColorsSchema>;
export type ColorType = z.infer<typeof ColorSchema>;

export interface IColorAPIResponse {
  color: ColorType,
  combinations: ICombination[]
}

export interface ICombination {
  number: number,
  colors: ColorType[]
}