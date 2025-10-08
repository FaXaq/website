import z from "zod";

const appConfigSchema = z.object({
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  port: z.number().min(1).max(65535).default(3000),
});

// lib/config.ts
const configSchema = z.object({
  // Public variables (accessible in browser)
  public: appConfigSchema.extend({
    apiUrl: z.url().default('http://localhost:3000/api'),
    appUrl: z.url().default('http://localhost:3000'),
  }),

  // Private variables (server-side only)
  server: appConfigSchema.extend({
    s3: z.object({
      secretKey: z.string().min(1, 'S3_SECRET_KEY is required'),
      accessKey: z.string().min(1, 'S3_ACCESS_KEY is required'),
      endpoint: z.url().min(1, 'S3_ENDPOINT is required'),
      bucketName: z.string().min(1, 'S3_BUCKET_NAME is required'),
      region: z.string().min(1, 'S3_REGION is required'),
    })
  }),

  // App settings
});

type Config = z.infer<typeof configSchema>;

// Helper to check if running on server
export const isServer = typeof window === 'undefined';
export const isClient = !isServer;

const getConfig = (): Config => {
  try {
    const config = configSchema.parse({
    // Public variables - prefixed with NEXT_PUBLIC_
      public: {
        apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
        appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        nodeEnv: process.env.NODE_ENV || 'development',
        port: parseInt(process.env.PORT || '3000', 10),
      },

      // Private variables - server-side only
      server: {
        s3: {
          secretKey: process.env.S3_SECRET_KEY || '',
          accessKey: process.env.S3_ACCESS_KEY || '',
          endpoint: process.env.S3_ENDPOINT || '',
          bucketName: process.env.S3_BUCKET_NAME || '',
          region: process.env.S3_REGION || '',
        },
        // App settings
        nodeEnv: process.env.NODE_ENV || 'development',
        port: parseInt(process.env.PORT || '3000', 10),
      },
    });

    return config;
  } catch (err) {
    console.error("Configuration error:", err);
  }
};

const config = getConfig();

export const getServerConfig = (): Config['server'] => {
  if (!isServer) {
    throw new Error("Server config can only be accessed on the server side.");
  }
  return config.server;
};

export const getClientConfig = (): Config['public'] => {
  if (!isClient) {
    throw new Error("Client config can only be accessed on the client side.");
  }
  return config.public;
};

export const isServerDev = isServer && config.server.nodeEnv === 'development';
export const isClientDev = isClient && config.public.nodeEnv === 'development';
export const clientConfig = isClient ? config.public : null;
export const serverConfig = isServer ? config.server : null;
