/**
 * Express adapter for NestJS request context
 *
 * @packageDocumentation
 */

// Express Middleware
export { requestContextMiddleware } from './request-context.middleware.js';

// NestJS Interceptor
export { UseRequestContextExpress } from './nest-interceptor.js';

// Configuration Types
export type { RequestContextExpressOptions } from './config.js';
export { DEFAULT_EXPRESS_OPTIONS } from './config.js';
