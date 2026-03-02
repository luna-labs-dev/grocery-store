import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: './apps/backend/auto-generated-api.yaml',
    output: {
      target: './apps/frontend/src/infrastructure/api/endpoints.ts',
      schemas: './apps/frontend/src/infrastructure/api/types',
      clean: true,
      namingConvention: 'kebab-case',
      httpClient: 'axios',
      client: 'react-query',
      mode: 'tags',
      indexFiles: true,
    },
    hooks: {
      afterAllFilesWrite: 'pnpm lint',
    },
  },
});
