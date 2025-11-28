import z from "zod";

// -- 1. Schemas --

const baseConfigSchema = z.object({
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  port: z.number().min(1).max(65535).default(3000),
});

const publicConfigSchema = baseConfigSchema.extend({
  apiUrl: z.string().url().default('http://localhost:3000/api'),
  appUrl: z.string().url().default('http://localhost:3000'),
  trpcUrl: z.string().url().default('http://localhost:4000/trpc')
});

const serverS3Schema = z.object({
  secretKey: z.string().min(1, 'S3_SECRET_KEY is required'),
  accessKey: z.string().min(1, 'S3_ACCESS_KEY is required'),
  endpoint: z.string().url('S3_ENDPOINT must be a valid URL'),
  bucketName: z.string().min(1, 'S3_BUCKET_NAME is required'),
  region: z.string().min(1, 'S3_REGION is required'),
});

const serverConfigSchema = baseConfigSchema.extend({
  trpcUrl: z.string().url().default('http://localhost:4000/trpc'),
  s3: serverS3Schema,
});

export const isServer = typeof window === 'undefined';
export const isClient = !isServer;

// -- 2. Parsing helpers --

function parsePublicConfigFromEnv() {
  return publicConfigSchema.parse({
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
    trpcUrl: process.env.NEXT_PUBLIC_TRPC_URL || 'http://localhost:4000/trpc'
  });
}

function parseServerConfigFromEnv() {
  return serverConfigSchema.parse({
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
    trpcUrl: process.env.TRPC_URL || 'http://localhost:4000/trpc',
    s3: {
      secretKey: process.env.S3_SECRET_KEY || '',
      accessKey: process.env.S3_ACCESS_KEY || '',
      endpoint: process.env.S3_ENDPOINT || '',
      bucketName: process.env.S3_BUCKET_NAME || '',
      region: process.env.S3_REGION || '',
    }
  });
}

// -- 3. Access functions --

let cachedPublicConfig: z.infer<typeof publicConfigSchema> | undefined;
let cachedServerConfig: z.infer<typeof serverConfigSchema> | undefined;

/**
 * Get config relevant for the client (browser), validate and cache.
 */
export function getClientConfig(): z.infer<typeof publicConfigSchema> {
  if (!isClient) throw new Error("getClientConfig() called outside browser");
  if (!cachedPublicConfig) {
    cachedPublicConfig = parsePublicConfigFromEnv();
  }
  return cachedPublicConfig;
}

/**
 * Get config relevant for the server, validate and cache.
 */
export function getServerConfig(): z.infer<typeof serverConfigSchema> {
  if (!isServer) throw new Error("getServerConfig() called outside server");
  if (!cachedServerConfig) {
    cachedServerConfig = parseServerConfigFromEnv();
  }
  return cachedServerConfig;
}

// -- 4. Utilities --

export const isServerDev = () => isServer && getServerConfig().nodeEnv === 'development';
export const isClientDev = () => isClient && getClientConfig().nodeEnv === 'development';

export const clientConfig = () => (isClient ? getClientConfig() : null);
export const serverConfig = () => (isServer ? getServerConfig() : null);

