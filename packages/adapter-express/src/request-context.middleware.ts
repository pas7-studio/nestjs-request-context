/**
 * Express middleware for request context management
 */

import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { run } from '@pas7/request-context-core';
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
 * Note: Async errors in downstream middleware/handlers are NOT caught by try-catch
 * in Express. Use Express error handling middleware or wrap async handlers.
 * AsyncLocalStorage context is preserved across async boundaries automatically.
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
export function requestContextMiddleware(options?: RequestContextExpressOptions): RequestHandler {
  // Merge options with defaults (avoid allocations in hot path)
  const headerName = options?.header ?? 'x-request-id';
  const idGenerator = options?.idGenerator ?? (() => crypto.randomUUID());
  const addResponseHeader = options?.addResponseHeader ?? true;

  return (req: Request, res: Response, next: NextFunction): void => {
    // Get request ID from header or generate new one
    const headers = req.headers as Record<string, string | string[] | undefined>;
    const requestId = typeof headers[headerName] === 'string' ? headers[headerName] : idGenerator();

    // Optionally add request ID to response headers
    if (addResponseHeader) {
      res.setHeader(headerName, requestId);
    }

    // Start request context using AsyncLocalStorage
    // Context is automatically maintained across async operations
    // Note: Errors from async handlers must be handled by Express error middleware
    run({ requestId }, () => {
      next();
    });
  };
}
