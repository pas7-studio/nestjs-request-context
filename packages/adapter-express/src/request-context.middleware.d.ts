/**
 * Express middleware for request context management
 */
import type { RequestHandler } from 'express';
import type { RequestContextExpressOptions } from './config.js';
/**
 * Express middleware that initializes request context for each HTTP request
 *
 * The middleware:
 * - Extracts or generates a request ID from headers
 * - Starts the request context using core.run()
 * - Optionally adds the request ID to response headers
 * - Maintains context across async operations
 *
 * @param options - Middleware configuration options
 * @returns Express request handler middleware
 *
 * @example
 * ```typescript
 * import express from 'express';
 * import { requestContextMiddleware } from '@pas7/nestjs-request-context-adapter-express';
 *
 * const app = express();
 * app.use(requestContextMiddleware());
 * ```
 */
export declare function requestContextMiddleware(options?: RequestContextExpressOptions): RequestHandler;
//# sourceMappingURL=request-context.middleware.d.ts.map