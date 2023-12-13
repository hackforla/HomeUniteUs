/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_COGNITO_CLIENT_ID: string;
  readonly VITE_COGNITO_REDIRECT_URI: string;
  readonly VITE_HUU_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
