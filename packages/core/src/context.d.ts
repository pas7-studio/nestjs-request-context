/**
 * Context class for managing request-scoped data
 */
import type { ContextKey, SetPolicy } from './contracts.js';
import type { ContextSnapshot } from './snapshot.js';
import { Store } from './store.js';
/**
 * Context class for managing request-scoped data
 */
export declare class Context {
    private readonly _store;
    private constructor();
    /**
     * Create a new context with initial data
     * @param initial - Initial data for the context
     * @returns A new context instance
     */
    static create(initial?: Record<string, unknown>): Context;
    /**
     * Get the current active context
     * @returns The current context or undefined if no context is active
     */
    static current(): Context | undefined;
    /**
     * Get a value from the context
     * @param key - The key to get
     * @returns The value or undefined if not found
     */
    get<T>(key: ContextKey<T>): T | undefined;
    /**
     * Set a value in the context
     * @param key - The key to set
     * @param value - The value to store
     * @param policy - The policy to use when key already exists (default: 'overwrite')
     */
    set<T>(key: ContextKey<T>, value: T, policy?: SetPolicy): void;
    /**
     * Check if a key exists in the context
     * @param key - The key to check
     * @returns True if the key exists
     */
    has<T>(key: ContextKey<T>): boolean;
    /**
     * Require a value from the context, throwing an error if not found
     * @param key - The key to require
     * @returns The value
     * @throws ContextMissingError if the key is not found
     */
    require<T>(key: ContextKey<T>): T;
    /**
     * Merge multiple key-value pairs into the context
     * @param data - The data to merge
     * @param policy - The policy to use when keys already exist (default: 'overwrite')
     */
    merge(data: Record<string, unknown>, policy?: SetPolicy): void;
    /**
     * Create a snapshot of the current context state
     * @returns A snapshot of the context
     */
    snapshot(): ContextSnapshot;
    /**
     * Restore the context from a snapshot
     * @param snapshot - The snapshot to restore
     */
    restore(snapshot: ContextSnapshot): void;
    /**
     * Run a function within this context
     * @param fn - The function to run
     * @returns The result of the function
     */
    run<T>(fn: () => T): T;
    /**
     * Get the internal store (for testing purposes)
     * @returns The internal store
     * @internal
     */
    _getStore(): Store;
}
//# sourceMappingURL=context.d.ts.map