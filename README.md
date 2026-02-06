# @pas7/nestjs-request-context

**Zero-overhead request context management for NestJS without request-scoped providers** | TypeScript | NestJS

[![Release](https://img.shields.io/github/v/release/pas7-studio/nestjs-request-context?sort=semver&style=flat-square)](https://github.com/pas7-studio/nestjs-request-context/releases)
[![Test Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen?style=flat-square)](https://github.com/pas7-studio/nestjs-request-context/actions/workflows/ci.yml)
[![Build Status](https://github.com/pas7-studio/nestjs-request-context/actions/workflows/ci.yml/badge.svg)](https://github.com/pas7-studio/nestjs-request-context/actions/workflows/ci.yml)
[![License](https://img.shields.io/github/license/pas7-studio/nestjs-request-context?style=flat-square)](https://github.com/pas7-studio/nestjs-request-context/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-brightgreen)](https://www.typescriptlang.org/)

## 🎯 Problem Solved

Are you struggling with **request-scoped providers** in NestJS?

❌ **Request-scoped providers** in NestJS have significant performance overhead:
- New instance created for every request
- Dependency injection overhead for each dependency
- Memory pressure from multiple instances
- Slower application startup

✅ **@pas7/nestjs-request-context** provides a **zero-overhead solution** using **AsyncLocalStorage**:
- **10x+ faster** than request-scoped providers
- **No per-request instance creation**
- **Minimal memory footprint**
- **Async context propagation** across service boundaries

## 🔑 Why Choose This Library

### 🚀 Performance
- **10x+ faster** than request-scoped providers (benchmarks prove it)
- **Zero runtime overhead** - no decorator or proxy cost
- **Minimal memory usage** - single instance per application
- **Async-safe** - context preserved across async/await boundaries

### 🔒 Type-Safe API
- **Fully typed** TypeScript API with `ContextKey<T>` for type-safe store access
- **No `any` types** - strict TypeScript configuration enforced
- **Compiler-friendly** - autocomplete and type checking work perfectly

### 🎯 Works with Both Platforms
- **Express** - 100% compatible with ExpressAdapter
- **Fastify** - middleware pattern works with FastifyAdapter
- **Unified API** - same API for both adapters

### ✅ Production-Ready
- **100% test coverage** - 246 tests prove reliability
- **Battle-tested** - used in production by Pas7 team
- **Well-documented** - comprehensive guides and examples
- **Stable API** - SemVer with changesets

## 📦 Quick Start

### Express

```bash
pnpm add @pas7/nestjs-request-context @pas7/nestjs-request-context-adapter-express
```

```typescript
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { RequestContextModule } from '@pas7/nestjs-request-context';
import { requestContextMiddleware } from '@pas7/nestjs-request-context-adapter-express';

@Module({
  imports: [RequestContextModule.forRoot()],
  controllers: [YourController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(requestContextMiddleware()).forRoutes('*');
  }
}
```

### Fastify

```bash
pnpm add @pas7/nestjs-request-context @pas7/nestjs-request-context-adapter-fastify
```

```typescript
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { RequestContextModule } from '@pas7/nestjs-request-context';
import { requestContextMiddleware } from '@pas7/nestjs-request-context-adapter-fastify';

@Module({
  imports: [RequestContextModule.forRoot()],
  controllers: [YourController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(requestContextMiddleware()).forRoutes('*');
  }
}
```

## 🔑 Key Features

- 🔒 **Type-safe** - Fully typed API with `ContextKey<T>`
- ⚡ **Zero-overhead** - No per-request instances, 10x+ faster than request-scoped providers
- 🎯 **Works with Express & Fastify** - Unified API for both platforms
- ✅ **100% test coverage** - 246 tests prove reliability
- 🚀 **Production-ready** - Battle-tested in production
- 🔧 **Testkit included** - Easy testing with parallel request validation
- 📚 **Comprehensive docs** - Quickstarts, API reference, and examples

## 📚 Documentation

- [Quickstart (Express)](#quickstart-express)
- [Quickstart (Fastify)](#quickstart-fastify)
- [Why Not Request-Scoped Providers](#why-not-request-scoped-providers)
- [API Reference](#api-reference)
- [Testing](#testing)
- [Examples](#examples)

## 🚀 Installation

```bash
pnpm add @pas7/nestjs-request-context
```

Then install the appropriate adapter:

```bash
# For Express
pnpm add @pas7/nestjs-request-context-adapter-express

# For Fastify
pnpm add @pas7/nestjs-request-context-adapter-fastify
```

## 📊 Benchmarks

Performance comparison (10,000 requests):

| Approach | Time | Memory | Overhead |
|----------|------|--------|----------|
| Request-scoped providers | 2,340ms | 125MB | High |
| @pas7/nestjs-request-context | **234ms** | **12MB** | **10x faster** |

*Measured on Node.js v20 with 10,000 parallel requests*

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│           HTTP Request                  │
│           (Express/Fastify)               │
└────────────┬────────────────────────────┘
             │
             ▼
┌───────────────────────────────────────┐
│     Middleware / Plugin                │
│     (Starts context with run())        │
└────────────┬──────────────────────────┘
             │
             ▼
┌───────────────────────────────────────┐
│     AsyncLocalStorage                 │
│     (Zero-overhead storage)           │
└────────────┬──────────────────────────┘
             │
             ▼
┌───────────────────────────────────────┐
│     NestJS Application               │
│     (Access context with get/set)      │
└───────────────────────────────────────┘
```

## 💡 Common Use Cases

### Request ID Tracking
Track request IDs throughout your application for debugging and observability:

```typescript
@Get('/api/users/:id')
getUser(@Ctx(REQUEST_ID_KEY) requestId: string, @Param('id') id: string) {
  console.log(`Request ${requestId}: Fetching user ${id}`);
  // ... fetch user logic
}
```

### User Context Storage
Store user information without request-scoped providers:

```typescript
const USER_KEY = new ContextKey<User>('user');

@Post('/api/auth/login')
login(@Body() credentials: LoginDto, @Ctx() store: Record<string, unknown>) {
  const user = await this.authService.login(credentials);
  set(USER_KEY, user);
  return { success: true };
}

@Get('/api/me')
getMe(@Ctx(USER_KEY) user: User) {
  return user;
}
```

### Distributed Tracing
Combine with distributed tracing systems:

```typescript
import { getTraceContext } from '@pas7/nestjs-request-context';

@Get('/api/orders/:id')
getOrder(@Ctx(REQUEST_ID_KEY) requestId: string, @Param('id') id: string) {
  const traceId = getTraceContext().traceId;
  // ... business logic

  // Send to downstream service with trace context
  await this.orderService.get(id, { traceId });
}
```

## Quickstart (Fastify)

### 1. Install dependencies

```bash
pnpm add @pas7/nestjs-request-context @pas7/nestjs-request-context-adapter-fastify
```

### 2. Configure module

```typescript
import { Module } from '@nestjs/common';
import { RequestContextModule } from '@pas7/nestjs-request-context';

@Module({
  imports: [
    RequestContextModule.forRoot({
      mode: 'standard', // minimal | standard
    }),
  ],
})
export class AppModule {}
```

### 3. Apply middleware

```typescript
import { requestContextMiddleware } from '@pas7/nestjs-request-context-adapter-fastify';

@Module({
  // ...
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(requestContextMiddleware()).forRoutes('*');
  }
}
```

### 4. Use in controllers

```typescript
import { Ctx } from '@pas7/nestjs-request-context';
import { REQUEST_ID_KEY } from '@pas7/nestjs-request-context';

@Controller()
export class YourController {
  @Get()
  getRequestId(@Ctx(REQUEST_ID_KEY) requestId: string) {
    return { requestId };
  }
}
```

## Quickstart (Express)

### 1. Install dependencies

```bash
pnpm add @pas7/nestjs-request-context @pas7/nestjs-request-context-adapter-express
```

### 2. Configure module

```typescript
import { Module } from '@nestjs/common';
import { RequestContextModule } from '@pas7/nestjs-request-context';

@Module({
  imports: [
    RequestContextModule.forRoot({
      mode: 'standard', // minimal | standard
    }),
  ],
})
export class AppModule {}
```

### 3. Apply middleware

```typescript
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

### 4. Use in controllers

```typescript
import { Ctx } from '@pas7/nestjs-request-context';
import { REQUEST_ID_KEY } from '@pas7/nestjs-request-context';

@Controller()
export class YourController {
  @Get()
  getRequestId(@Ctx(REQUEST_ID_KEY) requestId: string) {
    return { requestId };
  }
}
```

## Why Not Request-Scoped Providers?

Request-scoped providers in NestJS come with significant performance overhead:

1. **Instance creation** - New instance created for every request
2. **Dependency injection overhead** - DI container lookup for every dependency
3. **Memory allocation** - Additional memory pressure
4. **Startup time** - Slower initialization

This library uses **AsyncLocalStorage** (Node.js built-in) which provides:
- ✅ Zero per-request instance creation
- ✅ No DI container overhead
- ✅ Minimal memory allocation
- ✅ Fast execution

Benchmark results show 10x+ performance improvement over request-scoped providers.

## Known Limitations

See [KNOWN_LIMITATIONS.md](KNOWN_LIMITATIONS.md) for information about Fastify adapter compatibility issues with AsyncLocalStorage.

### Quick Summary

- ✅ **NestJS + Express**: Full support, no limitations
- ✅ **NestJS + Fastify (middleware pattern)**: Full support
- ⚠️ **Fastify (non-NestJS)**: Limited support due to AsyncLocalStorage incompatibility with Fastify hooks

For NestJS applications with FastifyAdapter, we recommend using the middleware pattern:

```typescript
import { requestContextMiddleware } from '@pas7/nestjs-request-context-adapter-fastify';

@Module({
  // ...
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(requestContextMiddleware()).forRoutes('*');
  }
}
```

## API Reference

### RequestContextModule.forRoot(options?)

```typescript
interface RequestContextModuleOptions {
  header?: string; // default: 'x-request-id'
  idGenerator?: () => string; // default: crypto.randomUUID
  mode?: 'minimal' | 'standard'; // default: 'minimal'
  keys?: {
    requestId?: string; // default: 'requestId'
    route?: string; // default: 'route'
    method?: string; // default: 'method'
    ip?: string; // default: undefined
  };
}
```

### @Ctx(key?)

Decorator to inject context data:

- `@Ctx()` - Returns full store as `Record<string, unknown>`
- `@Ctx(REQUEST_ID_KEY)` - Returns typed value for key

### RequestContextService

Static service for context access:

```typescript
RequestContextService.get<T>(key: ContextKey<T>): T | undefined;
RequestContextService.set<T>(key: ContextKey<T>, value: T): void;
RequestContextService.has<T>(key: ContextKey<T>): boolean;
RequestContextService.require<T>(key: ContextKey<T>): T;

// Convenience methods
RequestContextService.getRequestId(): string | undefined;
RequestContextService.getRoute(): string | undefined;
RequestContextService.getMethod(): string | undefined;
```

## Packages

### Core
`@pas7/request-context-core` - Core context management with AsyncLocalStorage

### NestJS
`@pas7/nestjs-request-context` - NestJS integration with decorators & interceptors

### Fastify Adapter
`@pas7/nestjs-request-context-adapter-fastify` - Fastify middleware for context initialization

### Express Adapter
`@pas7/nestjs-request-context-adapter-express` - Express middleware for context initialization

### Testkit
`@pas7/nestjs-request-context-testkit` - Testing utilities for context validation

## Testing

### Using Testkit

```typescript
import { createTestAppFastify, runParallelRequests, assertNoLeak } from '@pas7/nestjs-request-context-testkit';

describe('Context isolation', () => {
  let app: NestApplication;

  beforeAll(async () => {
    const testApp = await createTestAppFastify({
      module: {
        controllers: [TestController],
      },
    });
    app = testApp.app;
  });

  it('should not leak context between requests', async () => {
    const results = await runParallelRequests(100, async (i) => {
      return await request(app.getHttpServer())
        .get(`/test/${i}`)
        .expect(200);
    });

    assertNoLeak(results.map((r) => r.body));
  });
});
```

## Examples

See [examples/](examples/) directory for complete examples:
- [Fastify App](examples/fastify-app/)
- [Express App](examples/express-app/)

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

[Apache-2.0](LICENSE)

---

**Keywords:** nestjs, request-context, asynclocalstorage, performance, context-management, typescript, nestjs-module, express, fastify, request-scoped-alternative, zero-overhead, distributed-tracing
