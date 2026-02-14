# @pas7/nestjs-request-context

Zero-overhead request context for NestJS based on Node.js AsyncLocalStorage.

[![Release](https://img.shields.io/github/v/release/pas7-studio/nestjs-request-context?sort=semver&style=flat-square)](https://github.com/pas7-studio/nestjs-request-context/releases)
[![Build Status](https://github.com/pas7-studio/nestjs-request-context/actions/workflows/ci.yml/badge.svg)](https://github.com/pas7-studio/nestjs-request-context/actions/workflows/ci.yml)
[![Test Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen?style=flat-square)](https://github.com/pas7-studio/nestjs-request-context/actions/workflows/ci.yml)
[![Tests](https://img.shields.io/badge/tests-308-brightgreen?style=flat-square)](https://github.com/pas7-studio/nestjs-request-context/actions/workflows/ci.yml)
[![License](https://img.shields.io/github/license/pas7-studio/nestjs-request-context?style=flat-square)](https://github.com/pas7-studio/nestjs-request-context/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-brightgreen)](https://www.typescriptlang.org/)

## Why this package

NestJS request-scoped providers are convenient but expensive under load: new instances per request, more DI work, and more memory churn.

`@pas7/nestjs-request-context` keeps request data in AsyncLocalStorage and gives you:

- Near-zero runtime overhead in practical benchmarks
- Type-safe context access with `ContextKey<T>`
- Stable behavior across async/await chains
- Support for both NestJS + Express and NestJS + Fastify

## Key features

- AsyncLocalStorage-based context lifecycle
- Strong typing via `ContextKey<T>` and typed access APIs
- NestJS-first API: `RequestContextModule`, `RequestContextService`, `@Ctx()`
- Adapter support for both `@nestjs/platform-express` and `@nestjs/platform-fastify`
- Snapshot/restore utilities for advanced flows and testing
- Dedicated testkit for parallel-request isolation checks

## Why this matters in real projects

- Keep services singleton-friendly while still accessing request metadata
- Avoid spreading `Request` objects through business-layer method signatures
- Standardize request ID/correlation ID handling across modules
- Reduce accidental context leaks in async workflows
- Make observability use cases (logs, tracing, audit) easier to implement consistently

Typical covered use cases:

- Correlation ID and distributed trace propagation
- Tenant ID / locale / auth claims access in deep service layers
- Audit logging with request metadata enrichment
- Safe parallel request handling in tests and production paths

## Advantages vs alternatives

Compared with request-scoped providers in NestJS:

- No per-request provider instantiation
- No request-scope DI graph rebuild
- Lower memory churn on high traffic
- Simpler migration path for existing singleton services

Compared with generic context helpers (without NestJS integration):

- Native decorator and module integration for NestJS
- Unified adapter behavior for Express and Fastify
- Ready-to-use defaults for request id propagation and access

## Measured overhead and memory

Benchmark command:

```bash
pnpm bench:request-context
```

Last measured on **February 14, 2026** (local machine):

- Node.js: `v24.6.0`
- CPU: `Intel(R) Core(TM) i9-14900K`
- Load profile: `3000 requests`, concurrency `30`, warmup `300`, memory phase `6000 requests`, `5 rounds`, median reported

| Scenario                       | Median total time | Median throughput | Median avg/request | Median peak heap delta | Median retained heap | Median RSS delta |
| ------------------------------ | ----------------: | ----------------: | -----------------: | ---------------------: | -------------------: | ---------------: |
| Request-scoped provider        |      `4423.02 ms` |    `678.27 req/s` |       `1474.34 us` |             `59.71 MB` |            `0.13 MB` |        `0.95 MB` |
| `@pas7/nestjs-request-context` |      `4297.86 ms` |    `698.02 req/s` |       `1432.62 us` |             `53.61 MB` |           `-0.01 MB` |        `0.55 MB` |
| `nestjs-cls`                   |      `4989.55 ms` |    `601.26 req/s` |       `1663.18 us` |             `54.96 MB` |           `-0.08 MB` |        `1.83 MB` |

Interpretation for this profile:

- vs request-scoped provider: near parity, with `@pas7/nestjs-request-context` about `1.03x` faster (`2.83%` less total time)
- vs `nestjs-cls`: `@pas7/nestjs-request-context` about `1.16x` faster (`13.86%` less total time)
- Peak heap is lower than request-scoped baseline (about `10.21%` lower)
- Practical conclusion: the library is primarily a DX/architecture improvement and stays performance-competitive under this benchmark profile

Notes:

- These are real local numbers from the benchmark script in `scripts/benchmark/request-context-vs-request-scoped.cjs`.
- The command runs Node with `--expose-gc` to make memory deltas measurable.
- Results depend on Node version, hardware, request complexity, and DI graph depth. Re-run the command in your environment before making capacity decisions.
- Script scenarios currently include: native request-scoped provider, `@pas7/nestjs-request-context`, and `nestjs-cls`.

## What you install

| Package                                        | Purpose                                                      |
| ---------------------------------------------- | ------------------------------------------------------------ |
| `@pas7/nestjs-request-context`                 | Main NestJS module, decorators, service                      |
| `@pas7/nestjs-request-context-adapter-express` | Middleware/interceptor integration for ExpressAdapter        |
| `@pas7/nestjs-request-context-adapter-fastify` | Middleware/interceptor integration for FastifyAdapter        |
| `@pas7/request-context-core`                   | Framework-agnostic core primitives                           |
| `@pas7/nestjs-request-context-shared`          | Shared adapter types/factory (usually transitive dependency) |
| `@pas7/nestjs-request-context-testkit`         | Helpers for isolation and leak testing                       |

## Installation

Install the main package and one adapter.

```bash
pnpm add @pas7/nestjs-request-context

# choose one adapter
pnpm add @pas7/nestjs-request-context-adapter-express
# or
pnpm add @pas7/nestjs-request-context-adapter-fastify
```

## Quick start (Express)

```ts
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { RequestContextModule } from '@pas7/nestjs-request-context';
import { requestContextMiddleware } from '@pas7/nestjs-request-context-adapter-express';

@Module({
  imports: [RequestContextModule.forRoot({ mode: 'standard' })],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(requestContextMiddleware())
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
```

## Quick start (Fastify)

```ts
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { RequestContextModule } from '@pas7/nestjs-request-context';
import { requestContextMiddleware } from '@pas7/nestjs-request-context-adapter-fastify';

@Module({
  imports: [RequestContextModule.forRoot({ mode: 'standard' })],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(requestContextMiddleware()).forRoutes('*');
  }
}
```

## Architecture

```text
HTTP Request (Express/Fastify)
          |
          v
Adapter Middleware / Interceptor
          |
          v
AsyncLocalStorage Context (run/get/set)
          |
          v
NestJS Layer (Controller/Service/Guard)
          |
          v
Typed Access via @Ctx() / RequestContextService
```

## Using context in handlers

```ts
import { Controller, Get } from '@nestjs/common';
import { Ctx, REQUEST_ID_KEY } from '@pas7/nestjs-request-context';

@Controller()
export class AppController {
  @Get('/health')
  health(@Ctx(REQUEST_ID_KEY) requestId: string) {
    return { ok: true, requestId };
  }
}
```

## API overview

Main exports from `@pas7/nestjs-request-context`:

- `RequestContextModule.forRoot()` / `forRootAsync()`
- `RequestContextService`
- `@Ctx()` decorator
- `REQUEST_ID_KEY`, `ROUTE_KEY`, `METHOD_KEY`, `IP_KEY`
- `ContextInterceptor`, `ContextGuard`

Core exports from `@pas7/request-context-core`:

- `run`, `get`, `set`, `has`, `require`, `merge`
- `snapshot`, `restore`
- `Context`, `ContextKey`
- `KeyExistsError`, `ContextMissingError`, `ContextNotActiveError`, `ContextKeyCollisionError`

## Known limitations

See `KNOWN_LIMITATIONS.md` for framework-specific notes.

## Documentation and examples

- Root docs: `README.md`
- Changelog: `CHANGELOG.md`
- Examples: `examples/express-app` and `examples/fastify-app`
- Package docs: `packages/nest/README.md`, `packages/adapter-express/README.md`, `packages/adapter-fastify/README.md`, `packages/core/README.md`, `packages/shared/README.md`, `packages/testkit/README.md`

## Development

```bash
pnpm install
pnpm build
pnpm test
pnpm test:e2e
```

## License

Apache-2.0
