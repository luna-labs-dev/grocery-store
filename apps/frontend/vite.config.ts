import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig, loadEnv } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const port = env.PORT ? Number(env.PORT) : 3000;

  return {
    plugins: [
      tanstackRouter({
        target: 'react',
        autoCodeSplitting: true,
        generatedRouteTree: 'src/route-tree.gen.ts',
        routeToken: 'layout',
      }),
      react(),
      tailwindcss(),
    ],
    server: {
      port,
      proxy: {
        '/api': {
          target: 'https://dev-grocery-store-backend.lunalabs.com.br',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    preview: { port },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
