/**
 * Configuration types for Fastify request context plugin
 */

/**
 * Options for configuring the Fastify request context plugin
 */
export interface RequestContextFastifyOptions {
  /**
   * The header name to read/write request ID from/to
   * @default 'x-request-id'
   */
  header?: string;

  /**
   * Custom function to generate request IDs
   * @default () => crypto.randomUUID()
   */
  idGenerator?: () => string;

  /**
   * Whether to add the request ID to the response headers
   * @default true
   */
  addResponseHeader?: boolean;
}

/**
 * Default values for Fastify plugin options
 */
export const DEFAULT_FASTIFY_OPTIONS = {
  header: 'x-request-id',
  addResponseHeader: true,
  idGenerator: () => crypto.randomUUID(),
} as const;
