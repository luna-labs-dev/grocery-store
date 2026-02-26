import 'reflect-metadata';
import { env } from './config/env';
import { registerInjections } from './di';
import { controllers } from './fastify';
import { setupFastifyApp } from './fastify/setup/app';

const { baseConfig } = env;
export const { app } = setupFastifyApp();

registerInjections();
app.register(controllers);

app
  .listen({
    port: baseConfig.port,
    host: baseConfig.host,
  })
  .then(() => {
    console.log(
      `🔥 HTTP server running on http://localhost:${baseConfig.port}`,
    );
    console.log(`📕 Docs on http://localhost:${baseConfig.port}/swagger`);
    console.log(`📚 Docs v2 on http://localhost:${baseConfig.port}/scalar`);
  });
