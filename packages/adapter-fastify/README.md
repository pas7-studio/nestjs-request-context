# @pas7/nestjs-request-context-adapter-fastify

Fastify adapter for `@pas7/nestjs-request-context`.

## When to use

Use this package when your NestJS app runs on `@nestjs/platform-fastify`.

## Installation

```bash
pnpm add @pas7/nestjs-request-context @pas7/nestjs-request-context-adapter-fastify
```

## Quick example

```ts
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

```ts
interface RequestContextFastifyOptions {
  header?: string;
  idGenerator?: () => string;
  addResponseHeader?: boolean;
}
```

## Exports

- `requestContextMiddleware`
- `requestContextPlugin`
- `UseRequestContextFastify`
- `DEFAULT_FASTIFY_OPTIONS`
- `RequestContextFastifyOptions`

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
