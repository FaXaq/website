// content-collections.ts
import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import rehypeApplyCodeMeta from "@repo/rehype-apply-code-meta";
import remarkExtractCodeMeta from "@repo/remark-extract-code-meta";
import { z } from "zod";
var posts = defineCollection({
  name: "posts",
  directory: "content/posts",
  include: "*.mdx",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
    published: z.boolean().optional().default(false),
    content: z.string(),
    slug: z.string()
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document, {
      remarkPlugins: [remarkExtractCodeMeta],
      rehypePlugins: [rehypeApplyCodeMeta],
      cwd: `${process.cwd()}/content/posts`
    });
    console.log(mdx);
    return {
      ...document,
      mdx
    };
  }
});
var content_collections_default = defineConfig({
  collections: [posts]
});
export {
  content_collections_default as default
};
