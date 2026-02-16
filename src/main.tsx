import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';

import { Providers, type router } from '@/providers';

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <Providers />
    </StrictMode>,
  );
}
