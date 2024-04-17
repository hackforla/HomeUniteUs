// currently, esnext cannot read json directly without createRequire
import semver from 'semver';
import {createRequire} from 'node:module';
const require = createRequire(import.meta.url);
const packageJson = require('./package.json');
console.log('packageJson', packageJson);
const engines = packageJson.engines;

const version = engines.node;
if (!semver.satisfies(process.version, version)) {
  console.log(
    `Required node version ${version} is not satisfied with current version ${process.version}. Please upgrade to minimum node version for this app.`,
  );
  process.exit(1);
} else {
  console.log(
    `Required node version ${version} is satisfied with current version ${process.version} and ready to proceed`,
  );
}

export {};
