import { config as loadEnv } from 'dotenv';
import { z } from 'zod';

loadEnv();

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  BETTER_AUTH_SECRET: z
    .string()
    .min(1, 'BETTER_AUTH_SECRET is required'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  // S3
  S3_REGION: z.string().min(1, 'S3_REGION is required'),
  S3_ENDPOINT: z.url('S3_ENDPOINT must be a valid URL'),
  S3_ACCESS_KEY: z.string().min(1, 'S3_ACCESS_KEY is required'),
  S3_SECRET_KEY: z.string().min(1, 'S3_SECRET_KEY is required'),
  S3_BUCKET_NAME: z.string().min(1, 'S3_BUCKET_NAME is required'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('Invalid environment variables:');
  parsedEnv.error.issues.forEach((issue) => {
    const path = issue.path.join('.') || 'root';
    console.error(`- ${path}: ${issue.message}`);
  });
  throw new Error('Environment variable validation failed.');
}

export const config = parsedEnv.data;

