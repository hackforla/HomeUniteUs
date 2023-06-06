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
});
