/**
 * Configuration types for Express request context middleware
 */
/**
 * Options for configuring the Express request context middleware
 */
export interface RequestContextExpressOptions {
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
 * Default values for Express middleware options
 */
export declare const DEFAULT_EXPRESS_OPTIONS: {
    readonly header: "x-request-id";
    readonly addResponseHeader: true;
    readonly idGenerator: () => `${string}-${string}-${string}-${string}-${string}`;
};
//# sourceMappingURL=config.d.ts.map