import z from "zod";

const configSchema = z.object({
  mode: z.enum(['development', 'production', 'test']).default('development'),
  port: z.number().min(1).max(65535).default(3000),
});

export const config = configSchema.parse({
  mode: import.meta.env.MODE || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
});

const buildApiUrl = (config: z.infer<typeof configSchema>) => {
  if (config.mode === 'production') {
    return `https://norra.fr/api`;
  }

  return `http://localhost:4000`;
};

export const apiUrl = buildApiUrl(config);
export const authUrl = buildApiUrl(config) + '/api/auth';
export const trpcUrl = buildApiUrl(config) + '/trpc';
