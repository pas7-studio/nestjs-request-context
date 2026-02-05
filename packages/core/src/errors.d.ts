/**
 * Custom error classes for context management
 */
/**
 * Error thrown when trying to access context but no context is active
 */
export declare class ContextNotActiveError extends Error {
    constructor();
}
/**
 * Error thrown when a key collision occurs with 'deny' policy
 */
export declare class ContextKeyCollisionError extends Error {
    constructor(key: string);
}
/**
 * Error thrown when a required key is missing from the context
 */
export declare class ContextMissingError extends Error {
    constructor(key: string);
}
//# sourceMappingURL=errors.d.ts.map