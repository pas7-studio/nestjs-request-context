/**
 * Core API functions for context management
 */
import type { ContextKey, SetPolicy } from './contracts.js';
import type { ContextSnapshot } from './snapshot.js';
/**
 * Run a function within a new context
 * This is the only way to start a context. It creates a context, executes the function, and cleans up the context.
 * @param initial - Initial data for the context
 * @param fn - The function to run within the context
 * @returns The result of the function
 */
export declare function run<T>(initial: Record<string, unknown>, fn: () => T): T;
/**
 * Get a value from the current context
 * @param key - The key to get
 * @returns The value or undefined if not found
 */
export declare function get<T>(key: ContextKey<T>): T | undefined;
/**
 * Set a value in the current context
 * @param key - The key to set
 * @param value - The value to store
 * @param policy - The policy to use when key already exists (default: 'overwrite')
 * @throws ContextKeyCollisionError if key already exists and policy is 'deny'
 */
export declare function set<T>(key: ContextKey<T>, value: T, policy?: SetPolicy): void;
/**
 * Check if a key exists in the current context
 * @param key - The key to check
 * @returns True if the key exists
 */
export declare function has<T>(key: ContextKey<T>): boolean;
/**
 * Require a value from the current context, throwing an error if not found
 * @param key - The key to require
 * @returns The value
 * @throws ContextMissingError if the key is not found
 */
export declare function require<T>(key: ContextKey<T>): T;
/**
 * Merge multiple key-value pairs into the current context
 * @param data - The data to merge
 * @param policy - The policy to use when keys already exist (default: 'overwrite')
 */
export declare function merge(data: Record<string, unknown>, policy?: SetPolicy): void;
/**
 * Create a snapshot of the current context state
 * @returns A snapshot of the context
 */
export declare function snapshot(): ContextSnapshot;
/**
 * Restore the current context from a snapshot
 * @param snapshot - The snapshot to restore
 */
export declare function restore(snapshot: ContextSnapshot): void;
//# sourceMappingURL=api.d.ts.map