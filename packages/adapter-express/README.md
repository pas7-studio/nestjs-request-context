# @pas7/nestjs-request-context-adapter-express

Express adapter for `@pas7/nestjs-request-context`.

## When to use

Use this package when your NestJS app runs on `@nestjs/platform-express`.

## Installation

```bash
pnpm add @pas7/nestjs-request-context @pas7/nestjs-request-context-adapter-express
```

## Quick example

```ts
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

```ts
interface RequestContextExpressOptions {
  header?: string;
  idGenerator?: () => string;
  addResponseHeader?: boolean;
}
```

## Exports

- `requestContextMiddleware`
- `UseRequestContextExpress`
- `DEFAULT_EXPRESS_OPTIONS`
- `RequestContextExpressOptions`

## Related

- Root docs: `README.md`
- Changelog: `CHANGELOG.md`
- Main package: `@pas7/nestjs-request-context`

## About

Developed by **PAS7** - [https://pas7.com.ua/](https://pas7.com.ua/)

- 📖 Article: [NestJS Request Context with ALS](https://pas7.com.ua/blog/en/nestjs-request-context-als-2026)
- 📧 Contact: [https://pas7.com.ua/contact](https://pas7.com.ua/contact)

## License

Apache-2.0
