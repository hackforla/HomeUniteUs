// currently, esnext cannot read json directly without createRequire
import semver from 'semver';
import {createRequire} from 'node:module';
const require = createRequire(import.meta.url);
const packageJson = require('./package.json');
const engines = packageJson.engines;

const version = engines.node;
if (!semver.satisfies(process.version, version)) {
  console.log(
    `Required node version ${version} not satisfied with current version ${process.version}.`,
  );
  process.exit(1);
}
export {};
