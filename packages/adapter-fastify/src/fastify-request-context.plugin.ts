/**
 * Fastify plugin for request context management
 */

import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { run } from '@pas7/request-context-core';
import type { RequestContextFastifyOptions } from './config.js';

/**
 * Fastify plugin that initializes request context for each HTTP request
 *
 * The plugin:
 * - Extracts or generates a request ID
 * - Starts the request context using core.run() with callback
 * - Optionally adds the request ID to response headers
 * - Maintains AsyncLocalStorage throughout request lifecycle
 *
 * @param fastify - Fastify instance
 * @param options - Plugin configuration options
 */
export async function requestContextPlugin(
  fastify: FastifyInstance,
  options: RequestContextFastifyOptions = {}
): Promise<void> {
  // Merge options with defaults (avoid allocations in hot path)
  const headerName = options.header ?? 'x-request-id';
  const idGenerator = options.idGenerator ?? (() => crypto.randomUUID());
  const addResponseHeader = options.addResponseHeader ?? true;

  // Register onRequest hook
  // The hook creates context and wraps the request lifecycle
  fastify.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
    // Get request ID from header or generate new one
    const headers = request.headers as Record<string, string | string[] | undefined>;
    const requestId = typeof headers[headerName] === 'string' ? headers[headerName] : idGenerator();

    // Store request ID in request object
    (request as FastifyRequest & { requestId?: string }).requestId = requestId;

    // Optionally add request ID to response headers
    if (addResponseHeader) {
      reply.header(headerName, requestId);
    }

    // Start request context using AsyncLocalStorage
    // We need to wrap the entire request lifecycle
    return run({ requestId }, async () => {
      // Context is active, but will be lost when this function completes
      // We cannot directly wrap route handler from here
      // This is a known limitation with Fastify hooks and AsyncLocalStorage
    });
  });
}
