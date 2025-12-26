import z from "zod";

const configSchema = z.object({
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  port: z.number().min(1).max(65535).default(3000),
  host: z.string(),
});


export const config = configSchema.parse({
  nodeEnv: import.meta.env.MODE || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  host: import.meta.env.VITE_APP_HOST ?? process?.env.VITE_APP_HOST ?? 'localhost',
});

const buildApiUrl = (config: z.infer<typeof configSchema>) => {
  if (config.nodeEnv === 'development') {
    return `http://${config.host}:4000/trpc`;
  }

  return `https://${config.host}/api/trpc`;
};

export const apiUrl = buildApiUrl(config);
