# @pas7/nestjs-request-context-shared

Shared adapter types and interceptor factory for the request-context ecosystem.

## When to use

Usually you do not install this package directly. It is pulled in by adapter packages.

Install directly only if you are building your own adapter.

## Installation

```bash
pnpm add @pas7/nestjs-request-context-shared
```

## Main exports

- `RequestContextAdapterOptions`
- `DEFAULT_ADAPTER_OPTIONS`
- `createRequestContextInterceptor`
- `CreateInterceptorOptions`

## Quick custom-adapter example

```ts
import { createRequestContextInterceptor } from '@pas7/nestjs-request-context-shared';

const interceptor = createRequestContextInterceptor({
  options: { header: 'x-request-id' },
  getRequestId: (req, header) => req.headers[header],
  setRequestId: (res, header, id) => res.setHeader(header, id),
  getRequest: (ctx) => ctx.switchToHttp().getRequest(),
  getResponse: (ctx) => ctx.switchToHttp().getResponse(),
});
```

## Related

- Root docs: `README.md`
- Changelog: `CHANGELOG.md`
- Express adapter: `@pas7/nestjs-request-context-adapter-express`
- Fastify adapter: `@pas7/nestjs-request-context-adapter-fastify`

## About

Developed by **PAS7** - [https://pas7.com.ua/](https://pas7.com.ua/)

- 📖 Article: [NestJS Request Context with ALS](https://pas7.com.ua/blog/en/nestjs-request-context-als-2026)
- 📧 Contact: [https://pas7.com.ua/contact](https://pas7.com.ua/contact)

## License

Apache-2.0
