# @pas7/nestjs-request-context-adapter-express

Express adapter for @pas7/nestjs-request-context.

## Installation

```bash
pnpm add @pas7/nestjs-request-context-adapter-express
```

## Quickstart

```typescript
import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { requestContextMiddleware } from '@pas7/nestjs-request-context-adapter-express';

@Module({
  // ...
})
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
  header?: string; // default: 'x-request-id'
  idGenerator?: () => string; // default: crypto.randomUUID
  addResponseHeader?: boolean; // default: true
}
```

## License

Apache-2.0
