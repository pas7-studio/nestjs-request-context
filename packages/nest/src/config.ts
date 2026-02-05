/**
 * Configuration interfaces for RequestContextModule
 */

import type { ModuleMetadata } from '@nestjs/common';

/**
 * Key configuration for context storage
 */
export interface RequestContextKeysConfig {
  /** Key name for storing request ID (default: 'requestId') */
  requestId?: string;
  /** Key name for storing route (default: 'route') */
  route?: string;
  /** Key name for storing HTTP method (default: 'method') */
  method?: string;
  /** Key name for storing client IP (default: undefined - not stored in minimal mode) */
  ip?: string;
}

/**
 * Configuration options for RequestContextModule
 */
export interface RequestContextModuleOptions {
  /** Header name to extract request ID from (default: 'x-request-id') */
  header?: string;
  /** Custom ID generator function (default: crypto.randomUUID) */
  idGenerator?: () => string;
  /** Context mode: 'minimal' (only requestId) or 'standard' (requestId + route + method) (default: 'minimal') */
  mode?: 'minimal' | 'standard';
  /** Custom key names for context storage */
  keys?: RequestContextKeysConfig;
}

/**
 * Async configuration options for RequestContextModule with dependency injection
 */
export interface RequestContextModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  /** Dependencies to inject into useFactory */
  inject?: any[];
  /** Factory function to create configuration options */
  useFactory: (...args: unknown[]) => RequestContextModuleOptions;
}

/** Default header name for request ID extraction */
export const DEFAULT_HEADER = 'x-request-id';

/** Default key names */
export const DEFAULT_KEYS = {
  requestId: 'requestId',
  route: 'route',
  method: 'method',
  ip: undefined,
} as const satisfies RequestContextKeysConfig;

/** Default context mode */
export const DEFAULT_MODE: 'minimal' | 'standard' = 'minimal';
