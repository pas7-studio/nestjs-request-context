/**
 * Shared configuration types for adapter middleware/interceptor
 */

/**
 * Base options for adapter request context configuration.
 * These options are shared across Express and Fastify adapters.
 */
export interface RequestContextAdapterOptions {
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
 * Default values for adapter options
 */
export const DEFAULT_ADAPTER_OPTIONS = {
  header: 'x-request-id',
  addResponseHeader: true,
  idGenerator: () => crypto.randomUUID(),
} as const;
