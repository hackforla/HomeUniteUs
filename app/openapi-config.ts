import type {ConfigFile} from '@rtk-query/codegen-openapi';

const config: ConfigFile = {
  schemaFile: 'http://localhost:38429/api/openapi.json',
  apiFile: './src/services/api.ts',
  apiImport: 'api',
  outputFiles: {
    './src/services/host.ts': {
      filterEndpoints: [/host/i],
      exportName: 'hostAPI',
    },
    './src/services/guest.ts': {
      filterEndpoints: [/guest/i],
      exportName: 'guestAPI',
    },
  },
  hooks: true,
};

export default config;
