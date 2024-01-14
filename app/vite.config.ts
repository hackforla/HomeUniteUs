/// <reference types="vitest" />
/// <reference types="vite/client" />

import {defineConfig, loadEnv} from 'vite';
import react from '@vitejs/plugin-react';

// Returns the value of the VITE_HUU_API_BASE_URL environment variable as a URL.
// This ensure the environment variable exists and the value is a URL.
function huuApiBaseUrl(envHuuApiBaseUrl: string, mode: string): URL | never {
  try {
    return new URL(envHuuApiBaseUrl);
  } catch {
    if (mode == 'development' || mode == 'test') {
      return new URL('http://localhost:8080/api/');
    } else {
      throw new Error('VITE_HUU_API_BASE_URL is not configured with a URL');
    }
  }
}

// This code configures vite before it processes the application's code
// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  // Load environment variables starting with VITE_ from:
  // 1. the process' environment variables
  // 2. if exists, a .env file and any .env files for the given mode
  //
  // The process' environment variables take precedence over variables defined in any .env file.
  //
  // The environment variables can be used in code using `import.meta.env.VITE_<rest of variable>`.
  // They are statically string replaced during a production build
  //
  // By default, vite automatically loads the environment variables.
  // However, they are explicitly loaded here to handle the required variables.
  // Otherwise, vite will replace undefined environment variables with `{}.VITE_<rest of variable>`.
  const env = loadEnv(mode, process.cwd());
  const apiBaseUrl = huuApiBaseUrl(env.VITE_HUU_API_BASE_URL, mode);

  return {
    define: {
      // ensures this is defined for vite to replace
      'import.meta.env.VITE_HUU_API_BASE_URL': JSON.stringify(apiBaseUrl),
    },
    plugins: [react()],
    server: {
      port: 4040,
      proxy: {
        '/api': {
          target: apiBaseUrl.origin
        },
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/utils/test/setupTests.ts',
    },
  };
});
