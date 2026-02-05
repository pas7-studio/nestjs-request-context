# @pas7/nestjs-request-context-adapter-fastify

Fastify adapter for @pas7/nestjs-request-context.

## Installation

```bash
pnpm add @pas7/nestjs-request-context-adapter-fastify
```

## Quickstart

```typescript
import { Module, MiddlewareConsumer } from '@nestjs/common';
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

## Known Limitations

### AsyncLocalStorage and Fastify Hooks

This adapter has known limitations with Fastify hooks due to AsyncLocalStorage incompatibility. See [KNOWN_LIMITATIONS.md](../../KNOWN_LIMITATIONS.md) for full details.

### Recommended Usage

For NestJS applications with FastifyAdapter, use the middleware pattern:

```typescript
import { Module, MiddlewareConsumer } from '@nestjs/common';
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

**Do not use the plugin for NestJS applications** - it won't work correctly with Fastify hooks.

### API Reference

#### requestContextMiddleware(options?)

NestJS middleware for context initialization (Recommended for NestJS + FastifyAdapter).

```typescript
function requestContextMiddleware(
  options?: RequestContextFastifyOptions,
): NestMiddleware
```

**Note:** This is the recommended approach for NestJS applications.

#### requestContextPlugin(options?)

Fastify plugin for context initialization (Limited functionality).

⚠️ **Note:** This has limited functionality due to AsyncLocalStorage incompatibility with Fastify hooks. Use the middleware pattern instead.

```typescript
async function requestContextPlugin(
  fastify: FastifyInstance,
  options: RequestContextFastifyOptions,
): Promise<void>
```

## Options

```typescript
interface RequestContextFastifyOptions {
  header?: string; // default: 'x-request-id'
  idGenerator?: () => string; // default: crypto.randomUUID
  addResponseHeader?: boolean; // default: true
}
```

## License

Apache-2.0
