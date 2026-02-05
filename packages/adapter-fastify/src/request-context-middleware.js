/**
 * NestJS middleware for request context management with Fastify
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nestjs/common';
import { run } from '@pas7/request-context-core';
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
export function requestContextMiddleware(options) {
    // Merge options with defaults (avoid allocations in hot path)
    const headerName = options?.header ?? 'x-request-id';
    const idGenerator = options?.idGenerator ?? (() => crypto.randomUUID());
    const addResponseHeader = options?.addResponseHeader ?? true;
    let RequestContextMiddleware = class RequestContextMiddleware {
        use(req, res, next) {
            // Get request ID from header or generate new one
            const headers = req.headers;
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
            run({ requestId }, () => {
                // The route handler will be executed within this context
                // NestJS middleware chain maintains AsyncLocalStorage properly through the callback
                next();
            });
        }
    };
    RequestContextMiddleware = __decorate([
        Injectable()
    ], RequestContextMiddleware);
    return RequestContextMiddleware;
}
//# sourceMappingURL=request-context-middleware.js.map