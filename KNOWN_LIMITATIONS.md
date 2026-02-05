# Known Limitations

## 📌 Fastify Adapter Limitation

### AsyncLocalStorage and Fastify Hooks Compatibility

**Status:** ⚠️ Known Limitation
**SEO Keywords:** fastify asynclocalstorage, nestjs request context fastify, fastify request context

**Description:** AsyncLocalStorage, which is used for request context management, has compatibility issues with Fastify hooks (`onRequest`, `onRoute`, `onPreHandler`, etc.). This is because Fastify hooks execute and complete before the route handler runs, which causes the AsyncLocalStorage context to be lost.

**Technical Details:**

AsyncLocalStorage works correctly only when the callback remains active throughout the entire asynchronous chain. In Fastify hooks:

```typescript
// This doesn't work with AsyncLocalStorage
fastify.addHook('onRequest', async (request, reply) => {
  run(
    { requestId: '...' },
    async () => {
      // Hook completes here, context is lost before route handler
    }
  );
});
```

The hook completes before the route handler executes, breaking the AsyncLocalStorage chain.

**Affected Scenarios:**

- Non-NestJS Fastify applications using the plugin
- Custom Fastify plugins that try to use hooks
- Direct Fastify usage without NestJS

**Not Affected:**

- NestJS applications with FastifyAdapter using the middleware pattern
- Express adapter (Express middleware is fully compatible with AsyncLocalStorage)

### Recommended Solutions for Fastify

#### 1. For NestJS + FastifyAdapter (Recommended) ✅

Use the NestJS middleware pattern instead of the plugin:

```typescript
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { RequestContextModule } from '@pas7/nestjs-request-context';
import { requestContextMiddleware } from '@pas7/nestjs-request-context-adapter-fastify';

@Module({
  imports: [
    RequestContextModule.forRoot({
      mode: 'standard',
    }),
  ],
  controllers: [YourController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(requestContextMiddleware()).forRoutes('*');
  }
}
```

This approach works correctly because NestJS middleware supports the callback pattern that preserves AsyncLocalStorage context.

#### 2. For Non-NestJS Fastify Applications

If you're using Fastify without NestJS, you have limited options:

**Option A: Use Express instead**
- Express middleware is fully compatible with AsyncLocalStorage
- No changes to the library needed

**Option B: Custom Route Handler Wrappers**
Create a wrapper for your route handlers:

```typescript
function withRequestContext(handler: RouteHandlerMethod) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const requestId = request.headers['x-request-id'] || crypto.randomUUID();
    
    return run(
      { requestId },
      () => handler(request, reply)
    );
  };
}

// Usage
fastify.get('/test', withRequestContext(async (request, reply) => {
  // Context is available here
  const ctx = get(REQUEST_ID_KEY);
  return { requestId: ctx };
}));
```

**Option C: Use Fastify Middleware with Custom Wrapper**
Create a custom middleware wrapper that maintains AsyncLocalStorage context:

```typescript
class RequestContextWrapper {
  private storage = new AsyncLocalStorage<Store>();

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const requestId = request.headers['x-request-id'] || crypto.randomUUID();
    
    return this.storage.run(
      { requestId },
      async () => {
        // Manually call the route handler
        await request.raw;
      }
    );
  }
}
```

### Current Implementation Status

**@pas7/nestjs-request-context-adapter-fastify:**

- ✅ **NestJS Middleware** (`requestContextMiddleware`) - Works correctly with FastifyAdapter
- ⚠️ **Fastify Plugin** (`requestContextPlugin`) - Limited functionality due to AsyncLocalStorage incompatibility

**Recommendation:** For NestJS applications with FastifyAdapter, use the middleware pattern instead of the plugin.

### Performance Impact

The AsyncLocalStorage limitation in Fastify hooks has no performance impact on:
- NestJS applications with middleware pattern
- Express adapter
- Core functionality

For non-NestJS Fastify applications using the plugin, the context may not be available in route handlers, which defeats the purpose of the library.

### Future Work

We are investigating the following solutions:

1. **Fastify Plugin with Custom Lifecycle:** A custom plugin that wraps the entire request lifecycle
2. **AsyncLocalStorage Compatibility Layer:** A compatibility layer that works with Fastify hooks
3. **Alternative Storage Mechanism:** Exploring other async context propagation mechanisms

Contributions are welcome!

## Summary

| Platform | Adapter | Status | Recommendation |
|----------|----------|--------|----------------|
| NestJS + Express | Express Adapter | ✅ Full Support | Use as-is |
| NestJS + Fastify | Fastify Middleware | ✅ Full Support | Use middleware pattern |
| Fastify (Non-NestJS) | Fastify Plugin | ⚠️ Limited | Use Express or custom wrappers |
| NestJS + Fastify | Fastify Plugin | ⚠️ Limited | Use middleware pattern instead |

For most use cases, the recommended approach is to use the middleware pattern with NestJS + FastifyAdapter, which provides full functionality.
