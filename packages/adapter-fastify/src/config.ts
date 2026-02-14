/**
 * Configuration types for Fastify request context plugin
 */

import type { RequestContextAdapterOptions } from '@pas7/nestjs-request-context-shared';

/**
 * Options for configuring the Fastify request context plugin.
 * Extends the shared adapter options for backward compatibility.
 */
export type RequestContextFastifyOptions = RequestContextAdapterOptions;

/**
 * Default values for Fastify plugin options.
 * Uses the same defaults as shared adapter options.
 */
export const DEFAULT_FASTIFY_OPTIONS = {
  header: 'x-request-id',
  addResponseHeader: true,
  idGenerator: () => crypto.randomUUID(),
} as const;

// Re-export shared types for convenience
export type { RequestContextAdapterOptions } from '@pas7/nestjs-request-context-shared';
