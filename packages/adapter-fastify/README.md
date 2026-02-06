# @pas7/nestjs-request-context-adapter-fastify

[![npm version](https://img.shields.io/npm/v/@pas7/nestjs-request-context-adapter-fastify?style=flat-square)](https://www.npmjs.com/package/@pas7/nestjs-request-context-adapter-fastify)
[![License](https://img.shields.io/github/license/pas7-studio/nestjs-request-context?style=flat-square)](https://github.com/pas7-studio/nestjs-request-context/blob/main/LICENSE)

Fastify adapter for `@pas7/nestjs-request-context`.

## Installation

```bash
pnpm add @pas7/nestjs-request-context @pas7/nestjs-request-context-adapter-fastify
```

## Quick Start

```typescript
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { requestContextMiddleware } from '@pas7/nestjs-request-context-adapter-fastify';

@Module({})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(requestContextMiddleware()).forRoutes('*');
  }
}
```

## Options

```typescript
interface RequestContextFastifyOptions {
  header?: string;
  idGenerator?: () => string;
  addResponseHeader?: boolean;
}
```

## Note

For NestJS + FastifyAdapter, use the middleware approach above.

## Related Packages

- Main module: [`@pas7/nestjs-request-context`](https://www.npmjs.com/package/@pas7/nestjs-request-context)
- Core primitives: [`@pas7/request-context-core`](https://www.npmjs.com/package/@pas7/request-context-core)

## Links

- Repository: https://github.com/pas7-studio/nestjs-request-context
- Package source: https://github.com/pas7-studio/nestjs-request-context/tree/main/packages/adapter-fastify
- Full docs: https://github.com/pas7-studio/nestjs-request-context#readme

## Versioning

Versions are managed in the monorepo via Changesets (SemVer).

## License

Apache-2.0
