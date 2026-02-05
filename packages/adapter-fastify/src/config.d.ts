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
export declare const DEFAULT_FASTIFY_OPTIONS: {
    readonly header: "x-request-id";
    readonly addResponseHeader: true;
    readonly idGenerator: () => `${string}-${string}-${string}-${string}-${string}`;
};
//# sourceMappingURL=config.d.ts.map