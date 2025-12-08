import z from "zod";

export const ArticleMetaZodSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string(),
  tags: z.array(z.string()),
  slug: z.string(),
});

const blogPosts = import.meta.glob('@/content/*.mdx', {
  eager: false,
  import: 'meta'
});

export const postsLoaders = Object.entries(blogPosts).map(([path]) => {
  return {
    path: path,
    loader: async () => import(/* @vite-ignore */`${path}`)
  };
});

export const getFileInBlog = (name: string) => {
  return postsLoaders.find((post) => {
    const fileName = post.path.split('/').pop();
    const fileNameSplitted = fileName?.split('.');
    const fileNameWithoutExtension = fileNameSplitted?.slice(0, -1).join('');
    if (fileNameWithoutExtension === name) {
      return true;
    }
  });
};

export const listAllPosts = async () => {
  return await Promise.all(postsLoaders.map(async (post) => {
    const exports = await post.loader();
    if (!exports.meta) {
      throw new Error(`Post ${post.path} doesn't have a meta export`);
    }
    const parsed = ArticleMetaZodSchema.parse(exports.meta);
    return {
      meta: parsed,
    };
  }));
};

export const findPostBySlug = async (slug: string) => {
  const posts = await listAllPosts();
  return posts.find((post) => post.meta.slug === slug);
};