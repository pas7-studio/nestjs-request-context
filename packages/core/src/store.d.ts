/**
 * Internal Store implementation for context data storage
 */
import type { SetPolicy, Store as IStore } from './contracts.js';
/**
 * Creates an empty store without prototype
 * @returns A new empty store
 */
export declare function createEmptyStore(): IStore;
/**
 * Internal Store class for managing context data
 */
export declare class Store {
    private readonly _store;
    constructor();
    /**
     * Set a value in the store
     * @param key - The key to set
     * @param value - The value to store
     * @param policy - The policy to use when key already exists (default: 'overwrite')
     */
    set(key: string, value: unknown, policy?: SetPolicy): void;
    /**
     * Get a value from the store
     * @param key - The key to get
     * @returns The value or undefined if not found
     */
    get<T>(key: string): T | undefined;
    /**
     * Check if a key exists in the store
     * @param key - The key to check
     * @returns True if the key exists
     */
    has(key: string): boolean;
    /**
     * Merge multiple key-value pairs into the store
     * @param data - The data to merge
     * @param policy - The policy to use when keys already exist (default: 'overwrite')
     */
    merge(data: Record<string, unknown>, policy?: SetPolicy): void;
    /**
     * Get the underlying store object
     * @returns The internal store
     */
    getStore(): Record<string, unknown>;
}
//# sourceMappingURL=store.d.ts.map