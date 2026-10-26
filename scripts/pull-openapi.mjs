import { writeFile } from 'node:fs/promises';

const url =
  process.env.OPENAPI_URL || 'http://localhost:8081/swagger/v1/swagger.json';
const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
if (!response.ok)
  throw new Error(`OpenAPI download failed (${response.status}).`);
const spec = await response.json();
if (!spec.openapi || !spec.paths?.['/api/v1/auth/register']) {
  throw new Error(
    'Expected DevFlow Identity OpenAPI with the registration endpoint.',
  );
}
await writeFile(
  new URL('../contracts/identity/openapi.json', import.meta.url),
  JSON.stringify(spec, null, 2) + '\n',
);
console.log(
  'Updated Identity OpenAPI. Review the diff, then run npm run api:generate.',
);
