/**
 * Fastify plugin for request context management
 */

import type {
  FastifyInstance,
  FastifyRequest,
  FastifyReply,
  HookHandlerDoneFunction,
} from 'fastify';
import { run } from '@pas7/request-context-core';
import type { RequestContextFastifyOptions } from './config.js';

/**
 * Fastify plugin that initializes request context for each HTTP request
 *
 * The plugin:
 * - Extracts or generates a request ID
 * - Starts the request context using AsyncLocalStorage
 * - Optionally adds the request ID to response headers
 * - Maintains AsyncLocalStorage throughout request lifecycle
 *
 * IMPORTANT: Uses synchronous onRequest hook with done() callback pattern
 * to preserve AsyncLocalStorage context through the entire request lifecycle.
 * Async hooks would lose context when the hook function completes.
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

  // Register synchronous onRequest hook with done() callback
  // Using sync hook with callback preserves AsyncLocalStorage context
  // through the entire request lifecycle including route handlers
  fastify.addHook(
    'onRequest',
    (request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) => {
      // Get request ID from header or generate new one
      const headers = request.headers as Record<string, string | string[] | undefined>;
      const requestId =
        typeof headers[headerName] === 'string' ? headers[headerName] : idGenerator();

      // Optionally add request ID to response headers
      if (addResponseHeader) {
        reply.header(headerName, requestId);
      }

      // Start request context using AsyncLocalStorage with callback pattern
      // The done() callback is called within the context, preserving it
      // through the entire request lifecycle
      run({ requestId }, () => {
        done();
      });
    }
  );
}
