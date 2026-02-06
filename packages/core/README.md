# @pas7/request-context-core

[![npm version](https://img.shields.io/npm/v/@pas7/request-context-core?style=flat-square)](https://www.npmjs.com/package/@pas7/request-context-core)
[![License](https://img.shields.io/github/license/pas7-studio/nestjs-request-context?style=flat-square)](https://github.com/pas7-studio/nestjs-request-context/blob/main/LICENSE)

Core AsyncLocalStorage primitives for request context.

## Installation

```bash
pnpm add @pas7/request-context-core
```

## Usage

```typescript
import { ContextKey, get, run, set } from '@pas7/request-context-core';

const REQUEST_ID_KEY = new ContextKey<string>('requestId');

run({ requestId: 'req-1' }, () => {
  const id = get(REQUEST_ID_KEY);
  set(REQUEST_ID_KEY, 'req-2');
});
```

## API

- `run(initial, fn)`
- `get(key)`
- `set(key, value, policy?)`
- `has(key)`
- `require(key)`
- `merge(data, policy?)`
- `snapshot()`
- `restore(snapshot)`

## Related Packages

- Main NestJS module: [`@pas7/nestjs-request-context`](https://www.npmjs.com/package/@pas7/nestjs-request-context)
- Express adapter: [`@pas7/nestjs-request-context-adapter-express`](https://www.npmjs.com/package/@pas7/nestjs-request-context-adapter-express)
- Fastify adapter: [`@pas7/nestjs-request-context-adapter-fastify`](https://www.npmjs.com/package/@pas7/nestjs-request-context-adapter-fastify)
- Testkit: [`@pas7/nestjs-request-context-testkit`](https://www.npmjs.com/package/@pas7/nestjs-request-context-testkit)

## Links

- Repository: https://github.com/pas7-studio/nestjs-request-context
- Package source: https://github.com/pas7-studio/nestjs-request-context/tree/main/packages/core

## Versioning

Versions are managed in the monorepo via Changesets (SemVer).

## License

Apache-2.0
