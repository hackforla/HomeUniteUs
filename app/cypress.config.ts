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
    // If mocking is disabled, then you must pass in
    // the email and password as a system environment
    // using $env:CYPRESS_REAL_EMAIL and $env:CYPRESS_REAL_PASSWORD
    // If mocking is enabled, then this test account
    // will be autocreated by the backend.
    REAL_EMAIL: 'test@test.com',
    REAL_PASSWORD: 'Test!123',
  },
});
