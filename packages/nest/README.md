# @pas7/nestjs-request-context

NestJS module and decorators for AsyncLocalStorage-based request context.

## Why use it

- Avoid request-scoped provider overhead
- Keep typed request metadata available in controllers/services
- Reuse one integration style for Express and Fastify adapters

## Installation

```bash
pnpm add @pas7/nestjs-request-context
```

You also need one adapter package:

```bash
pnpm add @pas7/nestjs-request-context-adapter-express
# or
pnpm add @pas7/nestjs-request-context-adapter-fastify
```

## Quick example

```ts
import { Module } from '@nestjs/common';
import { RequestContextModule } from '@pas7/nestjs-request-context';

@Module({
  imports: [RequestContextModule.forRoot({ mode: 'standard' })],
})
export class AppModule {}
```

```ts
import { Controller, Get } from '@nestjs/common';
import { Ctx, REQUEST_ID_KEY } from '@pas7/nestjs-request-context';

@Controller()
export class AppController {
  @Get()
  getRequestId(@Ctx(REQUEST_ID_KEY) requestId: string) {
    return { requestId };
  }
}
```

## Main exports

- `RequestContextModule`
- `RequestContextService`
- `Ctx`
- `ContextInterceptor`, `ContextGuard`
- `REQUEST_ID_KEY`, `ROUTE_KEY`, `METHOD_KEY`, `IP_KEY`
- `DEFAULT_HEADER`, `DEFAULT_KEYS`, `DEFAULT_MODE`

## Related

- Root docs: `README.md`
- Changelog: `CHANGELOG.md`
- Core package: `@pas7/request-context-core`

## About

Developed by **PAS7** - [https://pas7.com.ua/](https://pas7.com.ua/)

- 📖 Article: [NestJS Request Context with ALS](https://pas7.com.ua/blog/en/nestjs-request-context-als-2026)
- 📧 Contact: [https://pas7.com.ua/contact](https://pas7.com.ua/contact)

## License

Apache-2.0
