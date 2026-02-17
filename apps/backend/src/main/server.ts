import 'reflect-metadata';
import './di';
import { setupApp } from '@/main/config/app';
import { env } from '@/main/config/env';

const init = async (): Promise<void> => {
  const app = await setupApp();
  const server = app.listen(env.baseConfig.port, () => {
    console.log(`Server running at http://localhost:${env.baseConfig.port}`);
  });

  process.on('SIGINT', () => {
    server.close();
    console.log('Server process ended.');
  });
};

init().catch(console.error);
