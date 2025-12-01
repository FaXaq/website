import Fastify from 'fastify';

import {
  fastifyTRPCPlugin,
  FastifyTRPCPluginOptions,
} from '@trpc/server/adapters/fastify';

import { createContext } from './context';
import { appRouter } from './router';
import { config } from './config';
import fastifyCors from "@fastify/cors";
import { setupBetterAuth } from './auth/better-auth';
import { AppRouter } from './router/client';

const buildServer = () => {
  const server = Fastify({
    logger: true,
  });
  // Configure CORS policies
  server.register(fastifyCors, {
    origin: process.env.CLIENT_ORIGIN || "http://localhost:1234",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With"
    ],
    credentials: true,
    maxAge: 86400
  });

  server.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: {
      router: appRouter,
      createContext,
      onError({ path, error }) {
        console.error(error.cause);
        // report to error monitoring
        console.error(`Error in tRPC handler on path '${path}':`, error);
      }
    } satisfies FastifyTRPCPluginOptions<AppRouter>['trpcOptions'],
  });

  setupBetterAuth(server)


  return server;
};

const start = async () => {
  try {
    const server = buildServer();
    await server.listen({ port: config.PORT, host: '0.0.0.0' });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();

