import './config/otel';
import 'reflect-metadata';
import { writeFileSync } from 'node:fs';
import { v4 as uuid } from 'uuid';
import { env } from './config/env';
import { registerInjections } from './di/injections';
import { registerControllers } from './fastify';
import { setupFastifyApp } from './fastify/setup/app';

const { baseConfig } = env;
export const { app } = setupFastifyApp();

registerInjections();
app.register(registerControllers, {
  prefix: '/api',
});

app
  .listen({
    port: baseConfig.port,
    host: baseConfig.host,
  })
  .then(async () => {
    await app.ready();
    const yaml = app.swagger({ yaml: true });
    writeFileSync('./auto-generated-api.yaml', yaml);
    uuid();

    await new Promise((resolve) => setTimeout(resolve, 100));
    console.log(
      `🔥 HTTP server running on http://localhost:${baseConfig.port}`,
    );
    console.log(`📕 Docs on http://localhost:${baseConfig.port}/swagger`);
    console.log(`📚 Docs v2 on http://localhost:${baseConfig.port}/scalar`);
  });
