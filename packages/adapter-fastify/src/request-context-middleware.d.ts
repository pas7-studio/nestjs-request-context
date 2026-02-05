/**
 * NestJS middleware for request context management with Fastify
 */
import type { NestMiddleware } from '@nestjs/common';
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
export declare function requestContextMiddleware(options?: RequestContextFastifyOptions): new () => NestMiddleware;
//# sourceMappingURL=request-context-middleware.d.ts.map