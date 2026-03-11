/// <reference types="vite/client" />

interface ImportMetaHot {
  data: any;
}

interface ImportMeta {
  readonly hot?: ImportMetaHot;
}

declare module '*.css';
