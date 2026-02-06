# @pas7/nestjs-request-context-adapter-express

[![npm version](https://img.shields.io/npm/v/@pas7/nestjs-request-context-adapter-express?style=flat-square)](https://www.npmjs.com/package/@pas7/nestjs-request-context-adapter-express)
[![License](https://img.shields.io/github/license/pas7-studio/nestjs-request-context?style=flat-square)](https://github.com/pas7-studio/nestjs-request-context/blob/main/LICENSE)

Express adapter for `@pas7/nestjs-request-context`.

## Installation

```bash
pnpm add @pas7/nestjs-request-context @pas7/nestjs-request-context-adapter-express
```

## Quick Start

```typescript
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { requestContextMiddleware } from '@pas7/nestjs-request-context-adapter-express';

@Module({})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(requestContextMiddleware())
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
```

## Options

```typescript
interface RequestContextExpressOptions {
  header?: string;
  idGenerator?: () => string;
  addResponseHeader?: boolean;
}
```

## Related Packages

- Main module: [`@pas7/nestjs-request-context`](https://www.npmjs.com/package/@pas7/nestjs-request-context)
- Core primitives: [`@pas7/request-context-core`](https://www.npmjs.com/package/@pas7/request-context-core)

## Links

- Repository: https://github.com/pas7-studio/nestjs-request-context
- Package source: https://github.com/pas7-studio/nestjs-request-context/tree/main/packages/adapter-express
- Full docs: https://github.com/pas7-studio/nestjs-request-context#readme

## Versioning

Versions are managed in the monorepo via Changesets (SemVer).

## License

Apache-2.0
