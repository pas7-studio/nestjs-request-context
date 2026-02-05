/**
 * Configuration types for Fastify request context plugin
 */
/**
 * Default values for Fastify plugin options
 */
export const DEFAULT_FASTIFY_OPTIONS = {
    header: 'x-request-id',
    addResponseHeader: true,
    idGenerator: () => crypto.randomUUID(),
};
//# sourceMappingURL=config.js.map