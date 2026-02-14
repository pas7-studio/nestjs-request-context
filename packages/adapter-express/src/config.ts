/**
 * Configuration types for Express request context middleware
 */

import type { RequestContextAdapterOptions } from '@pas7/nestjs-request-context-shared';

/**
 * Options for configuring the Express request context middleware.
 * Extends the shared adapter options for backward compatibility.
 */
export type RequestContextExpressOptions = RequestContextAdapterOptions;

/**
 * Default values for Express middleware options.
 * Uses the same defaults as shared adapter options.
 */
export const DEFAULT_EXPRESS_OPTIONS = {
  header: 'x-request-id',
  addResponseHeader: true,
  idGenerator: () => crypto.randomUUID(),
} as const;

// Re-export shared types for convenience
export type { RequestContextAdapterOptions } from '@pas7/nestjs-request-context-shared';
