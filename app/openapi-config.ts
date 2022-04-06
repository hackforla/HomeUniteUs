import type {ConfigFile} from '@rtk-query/codegen-openapi';

const config: ConfigFile = {
  schemaFile: 'http://localhost:8080/api/openapi.json',
  apiFile: './src/services/emptyApi.ts',
  apiImport: 'emptySplitApi',
  outputFile: './src/services/api.ts',
  exportName: 'api',
  hooks: true,
};

export default config;
