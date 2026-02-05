/**
 * Fastify plugin for request context management
 */
import type { FastifyInstance } from 'fastify';
import type { RequestContextFastifyOptions } from './config.js';
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
export declare function requestContextPlugin(fastify: FastifyInstance, options?: RequestContextFastifyOptions): Promise<void>;
//# sourceMappingURL=fastify-request-context.plugin.d.ts.map