/**
 * Fastify adapter for NestJS request context
 *
 * @packageDocumentation
 */

// Fastify Plugin
export { requestContextPlugin } from './fastify-request-context.plugin.js';

// Fastify Middleware
export { requestContextMiddleware } from './request-context-middleware.js';

// NestJS Interceptor
export { UseRequestContextFastify } from './nest-interceptor.js';

// Configuration Types
export type { RequestContextFastifyOptions } from './config.js';
export { DEFAULT_FASTIFY_OPTIONS } from './config.js';
