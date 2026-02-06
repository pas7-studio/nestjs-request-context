/**
 * NestJS integration for request context management
 *
 * @packageDocumentation
 */

// Module
export { RequestContextModule, MODULE_OPTIONS } from './request-context.module.js';

// Service
export { RequestContextService } from './request-context.service.js';

// Decorators
export { Ctx, getContextValue } from './ctx.decorator.js';

// Interceptors & Guards
export { ContextInterceptor } from './context.interceptor.js';
export { ContextGuard } from './context.guard.js';

// Config types
export type {
  RequestContextModuleOptions,
  RequestContextModuleAsyncOptions,
  RequestContextKeysConfig,
} from './config.js';
export { DEFAULT_HEADER, DEFAULT_KEYS, DEFAULT_MODE } from './config.js';

// Keys
export { REQUEST_ID_KEY, ROUTE_KEY, METHOD_KEY, IP_KEY } from './keys.js';
