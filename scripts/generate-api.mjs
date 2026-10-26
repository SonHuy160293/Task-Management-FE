import { readFile, writeFile, mkdir } from 'node:fs/promises';
import openapiTS, { astToString } from 'openapi-typescript';
import prettier from 'prettier';

const output = new URL(
  '../src/api/generated/identity/schema.ts',
  import.meta.url,
);
const ast = await openapiTS(
  new URL('../contracts/identity/openapi.json', import.meta.url),
);
const source = await prettier.format(
  '// Generated from contracts/identity/openapi.json. Do not edit.\n' +
    astToString(ast),
  { parser: 'typescript', singleQuote: true },
);
if (process.argv.includes('--check')) {
  const existing = await readFile(output, 'utf8');
  if (existing.replaceAll('\r\n', '\n') !== source) {
    throw new Error(
      'Generated Identity contracts are stale. Run npm run api:generate.',
    );
  }
  console.log('Identity contracts match the checked-in OpenAPI snapshot.');
} else {
  await mkdir(new URL('../src/api/generated/identity/', import.meta.url), {
    recursive: true,
  });
  await writeFile(output, source);
  console.log('Generated Identity contracts.');
}
