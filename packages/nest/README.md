# @pas7/nestjs-request-context

[![npm version](https://img.shields.io/npm/v/@pas7/nestjs-request-context?style=flat-square)](https://www.npmjs.com/package/@pas7/nestjs-request-context)
[![License](https://img.shields.io/github/license/pas7-studio/nestjs-request-context?style=flat-square)](https://github.com/pas7-studio/nestjs-request-context/blob/main/LICENSE)

NestJS integration for request context based on AsyncLocalStorage.

## Installation

```bash
pnpm add @pas7/nestjs-request-context
```

## Quick Start

```typescript
import { Module } from '@nestjs/common';
import { RequestContextModule } from '@pas7/nestjs-request-context';

@Module({
  imports: [RequestContextModule.forRoot()],
})
export class AppModule {}
```

## Usage

```typescript
import { Controller, Get } from '@nestjs/common';
import { Ctx, REQUEST_ID_KEY } from '@pas7/nestjs-request-context';

@Controller()
export class AppController {
  @Get()
  hello(@Ctx(REQUEST_ID_KEY) requestId: string) {
    return { requestId };
  }
}
```

## Related Packages

- Core primitives: [`@pas7/request-context-core`](https://www.npmjs.com/package/@pas7/request-context-core)
- Express adapter: [`@pas7/nestjs-request-context-adapter-express`](https://www.npmjs.com/package/@pas7/nestjs-request-context-adapter-express)
- Fastify adapter: [`@pas7/nestjs-request-context-adapter-fastify`](https://www.npmjs.com/package/@pas7/nestjs-request-context-adapter-fastify)
- Testkit: [`@pas7/nestjs-request-context-testkit`](https://www.npmjs.com/package/@pas7/nestjs-request-context-testkit)

## Links

- Repository: https://github.com/pas7-studio/nestjs-request-context
- Package source: https://github.com/pas7-studio/nestjs-request-context/tree/main/packages/nest
- Full docs: https://github.com/pas7-studio/nestjs-request-context#readme

## Versioning

Versions are managed in the monorepo via Changesets (SemVer).

## License

Apache-2.0
