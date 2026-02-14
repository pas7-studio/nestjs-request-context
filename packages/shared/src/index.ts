/**
 * @nestjs-request-context/shared
 *
 * Shared types and utilities for @nestjs-request-context adapters
 */

export type { RequestContextAdapterOptions } from './adapter-config';

export { DEFAULT_ADAPTER_OPTIONS } from './adapter-config';

export { createRequestContextInterceptor } from './create-context-interceptor.js';
export type { CreateInterceptorOptions } from './create-context-interceptor.js';
