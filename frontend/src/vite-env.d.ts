/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE?: string
  readonly VITE_FORCE_REPLICA?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
