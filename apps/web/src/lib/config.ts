import z from "zod";

const configSchema = z.object({
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  port: z.number().min(1).max(65535).default(3000),
  appUrl: z.url().default('http://localhost:3000'),
  trpcUrl: z.url().default('http://localhost:4000/trpc')
});

export const config = configSchema.parse({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  appUrl: process.env.VITE_APP_URL || 'http://localhost:3000',
  trpcUrl: process.env.VITE_TRPC_URL || 'http://localhost:4000/trpc'
});
