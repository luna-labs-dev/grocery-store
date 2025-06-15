import { Providers } from '@/providers';
import React from 'react';
import ReactDOM from 'react-dom/client';

import './config/style/globals.css';
import { loadClerkIfNeeded } from './config/clients';

const rootElement = document.getElementById('root');
loadClerkIfNeeded();

if (!!rootElement && !rootElement?.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <Providers />
    </React.StrictMode>,
  );
}
