/**
 * Express middleware for request context management
 */
import { run } from '@pas7/request-context-core';
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
export function requestContextMiddleware(options) {
    // Merge options with defaults (avoid allocations in hot path)
    const headerName = options?.header ?? 'x-request-id';
    const idGenerator = options?.idGenerator ?? (() => crypto.randomUUID());
    const addResponseHeader = options?.addResponseHeader ?? true;
    return (req, res, next) => {
        // Get request ID from header or generate new one
        const headers = req.headers;
        const requestId = typeof headers[headerName] === 'string'
            ? headers[headerName]
            : idGenerator();
        // Optionally add request ID to response headers
        if (addResponseHeader) {
            res.setHeader(headerName, requestId);
        }
        // Start request context by wrapping request handling
        // We use async wrapper to ensure context is maintained across async operations
        // Wrapping in a try-catch to handle errors properly
        try {
            run({ requestId }, () => {
                next();
            });
        }
        catch (error) {
            // Ensure error is passed to Express error handling
            next(error);
        }
    };
}
//# sourceMappingURL=request-context.middleware.js.map