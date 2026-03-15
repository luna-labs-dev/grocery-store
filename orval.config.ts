import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: './apps/backend/auto-generated-api.yaml',
    output: {
      target: './apps/frontend/src/infrastructure/api/endpoints.ts',
      schemas: './apps/frontend/src/infrastructure/api/types',
      clean: true,
      namingConvention: 'kebab-case',
      client: 'react-query',
      httpClient: 'axios',
      override: {
        mutator: {
          path: './apps/frontend/src/config/clients/custom-http-client.ts',
          name: 'customInstance',
        },
        query: {
          version: 5,
        },
        operations: {
          searchProduct: {
            query: {
              useInfinite: true,
              useInfiniteQueryParam: 'pageIndex',
            },
          },
        },
      },
      mode: 'tags',
      indexFiles: true,
    },
    hooks: {
      afterAllFilesWrite: 'pnpm lint',
    },
  },
});
