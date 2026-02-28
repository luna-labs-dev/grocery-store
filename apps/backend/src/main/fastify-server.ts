import 'reflect-metadata';
import { env } from './config/env';
import { registerInjections } from './di/injections';
import { registerControllers } from './fastify';
import { setupFastifyApp } from './fastify/setup/app';

const { baseConfig } = env;
export const { app } = setupFastifyApp();

registerInjections();
app.register(registerControllers);

app
  .listen({
    port: baseConfig.port,
    host: baseConfig.host,
  })
  .then(async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    console.log(
      `🔥 HTTP server running on http://localhost:${baseConfig.port}`,
    );
    console.log(`📕 Docs on http://localhost:${baseConfig.port}/swagger`);
    console.log(`📚 Docs v2 on http://localhost:${baseConfig.port}/scalar`);
  });
