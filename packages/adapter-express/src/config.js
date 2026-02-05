/**
 * Configuration types for Express request context middleware
 */
/**
 * Default values for Express middleware options
 */
export const DEFAULT_EXPRESS_OPTIONS = {
    header: 'x-request-id',
    addResponseHeader: true,
    idGenerator: () => crypto.randomUUID(),
};
//# sourceMappingURL=config.js.map