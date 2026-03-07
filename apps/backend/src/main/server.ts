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

registerInjections(app);
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

    // Start background worker for outbox
    const { OutboxWorker } = await import('./workers/outbox-worker');
    const worker = new OutboxWorker(5000);
    worker.start();

    // Graceful shutdown
    process.on('SIGINT', () => {
      worker.stop();
      app.close().then(() => process.exit(0));
    });

    process.on('SIGTERM', () => {
      worker.stop();
      app.close().then(() => process.exit(0));
    });

    await new Promise((resolve) => setTimeout(resolve, 100));
    console.log(
      `🔥 HTTP server running on http://localhost:${baseConfig.port}`,
    );
    console.log(`📕 Docs on http://localhost:${baseConfig.port}/swagger`);
    console.log(`📚 Docs v2 on http://localhost:${baseConfig.port}/scalar`);
  });
