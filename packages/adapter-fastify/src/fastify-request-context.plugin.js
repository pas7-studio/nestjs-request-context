/**
 * Fastify plugin for request context management
 */
import { run } from '@pas7/request-context-core';
/**
 * Fastify plugin that initializes request context for each HTTP request
 *
 * The plugin:
 * - Registers an onRequest hook with async/await pattern
 * - Extracts or generates a request ID
 * - Starts the request context using core.run() and awaits handler
 * - Optionally adds the request ID to response headers
 * - Maintains AsyncLocalStorage by awaiting route handler execution
 *
 * @param fastify - Fastify instance
 * @param options - Plugin configuration options
 */
export async function requestContextPlugin(fastify, options = {}) {
    // Merge options with defaults (avoid allocations in hot path)
    const headerName = options.header ?? 'x-request-id';
    const idGenerator = options.idGenerator ?? (() => crypto.randomUUID());
    const addResponseHeader = options.addResponseHeader ?? true;
    // Register onRequest hook with async wrapper
    // The hook creates context and awaits the route handler to maintain AsyncLocalStorage
    fastify.addHook('onRequest', async (request, reply) => {
        // Get request ID from header or generate new one
        const headers = request.headers;
        const requestId = typeof headers[headerName] === 'string' ? headers[headerName] : idGenerator();
        // Optionally add request ID to response headers
        if (addResponseHeader) {
            reply.header(headerName, requestId);
        }
        // Start request context and await route handler
        // By using async/await pattern, we maintain AsyncLocalStorage throughout
        // the entire request lifecycle including nested async operations
        return run({ requestId }, async () => {
            // The route handler will be executed within this context
            // Fastify will await the completion of all middleware and handlers
        });
    });
}
//# sourceMappingURL=fastify-request-context.plugin.js.map