/**
 * NestJS middleware for request context management with Fastify
 */

import type { NestMiddleware } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { run } from '@pas7/request-context-core';
import type { RequestContextFastifyOptions } from './config.js';

/**
 * NestJS middleware class for request context with FastifyAdapter
 *
 * The middleware:
 * - Extracts or generates a request ID from headers
 * - Starts the request context using core.run() with next callback
 * - Optionally adds the request ID to response headers
 * - Maintains AsyncLocalStorage throughout request lifecycle
 *
 * @param options - Middleware configuration options
 * @returns NestJS middleware class
 *
 * @example
 * ```typescript
 * import { Module, MiddlewareConsumer } from '@nestjs/common';
 * import { requestContextMiddleware } from '@pas7/nestjs-request-context-adapter-fastify';
 *
 * @Module({
 *   // ...
 * })
 * export class AppModule {
 *   configure(consumer: MiddlewareConsumer) {
 *     consumer.apply(requestContextMiddleware()).forRoutes('*');
 *   }
 * }
 * ```
 */
export function requestContextMiddleware(
  options?: RequestContextFastifyOptions,
): new () => NestMiddleware {
  // Merge options with defaults (avoid allocations in hot path)
  const headerName = options?.header ?? 'x-request-id';
  const idGenerator = options?.idGenerator ?? (() => crypto.randomUUID());
  const addResponseHeader = options?.addResponseHeader ?? true;

  @Injectable()
  class RequestContextMiddleware implements NestMiddleware {
    use(req: any, res: any, next: () => void) {
      // Get request ID from header or generate new one
      const headers = req.headers as Record<string, string | string[] | undefined>;
      const requestId = typeof headers[headerName] === 'string'
        ? headers[headerName]
        : idGenerator();

      // Optionally add request ID to response headers
      if (addResponseHeader) {
        res.header(headerName, requestId);
      }

      // Start request context by wrapping request handling
      // Using callback pattern to preserve AsyncLocalStorage throughout request lifecycle
      // The next() callback maintains context until request handling completes
      run(
        { requestId },
        () => {
          // The route handler will be executed within this context
          // NestJS middleware chain maintains AsyncLocalStorage properly through the callback
          next();
        },
      );
    }
  }

  return RequestContextMiddleware;
}
