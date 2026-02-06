# @pas7/nestjs-request-context-testkit

[![npm version](https://img.shields.io/npm/v/@pas7/nestjs-request-context-testkit?style=flat-square)](https://www.npmjs.com/package/@pas7/nestjs-request-context-testkit)
[![License](https://img.shields.io/github/license/pas7-studio/nestjs-request-context?style=flat-square)](https://github.com/pas7-studio/nestjs-request-context/blob/main/LICENSE)

Testing utilities for `@pas7/nestjs-request-context`.

## Installation

```bash
pnpm add -D @pas7/nestjs-request-context-testkit
```

## Usage

```typescript
import { assertNoLeak, createTestAppFastify, runParallelRequests } from '@pas7/nestjs-request-context-testkit';

const testApp = await createTestAppFastify({
  module: { controllers: [TestController] },
});

const responses = await runParallelRequests(50, (i) =>
  request(testApp.app.getHttpServer()).get(`/test/${i}`).expect(200)
);

assertNoLeak(responses.map((r) => r.body));
```

## API

- `createTestAppFastify(options?)`
- `createTestAppExpress(options?)`
- `runParallelRequests(count, handler)`
- `assertNoLeak(results)`

## Related Packages

- Main module: [`@pas7/nestjs-request-context`](https://www.npmjs.com/package/@pas7/nestjs-request-context)
- Express adapter: [`@pas7/nestjs-request-context-adapter-express`](https://www.npmjs.com/package/@pas7/nestjs-request-context-adapter-express)
- Fastify adapter: [`@pas7/nestjs-request-context-adapter-fastify`](https://www.npmjs.com/package/@pas7/nestjs-request-context-adapter-fastify)

## Links

- Repository: https://github.com/pas7-studio/nestjs-request-context
- Package source: https://github.com/pas7-studio/nestjs-request-context/tree/main/packages/testkit
- Full docs: https://github.com/pas7-studio/nestjs-request-context#readme

## Versioning

Versions are managed in the monorepo via Changesets (SemVer).

## License

Apache-2.0
