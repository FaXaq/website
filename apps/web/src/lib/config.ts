import z from "zod";

const configSchema = z.object({
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  port: z.number().min(1).max(65535).default(3000),
  host: z.string(),
});


export const config = configSchema.parse({
  mode: import.meta.env.MODE || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  productRepo: import.meta.env.VITE_PRODUCT_REPO,
  productName: import.meta.env.VITE_PRODUCT_NAME,
  version: import.meta.env.VITE_VERSION,
  env: import.meta.env.VITE_ENV || 'development',
});

const buildApiUrl = (config: z.infer<typeof configSchema>) => {
  if (config.nodeEnv === 'development') {
    return `http://${config.host}:4000/trpc`;
  }

  return `https://${config.host}/api/trpc`;
};

export const apiUrl = buildApiUrl(config);
