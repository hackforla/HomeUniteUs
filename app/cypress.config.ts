import {defineConfig} from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4040',
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },
  env: {
    USE_MOCK: true,
    REAL_EMAIL: "put-your-real-user-here@aol.com",
    REAL_PASSWORD: "Quantum-encrypted-p@ssw0rd-here"
  }
});
