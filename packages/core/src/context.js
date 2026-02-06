/**
 * Context class for managing request-scoped data
 */
import { AsyncLocalStorage } from 'node:async_hooks';
import { ContextMissingError } from './errors.js';
import { Store } from './store.js';
/**
 * AsyncLocalStorage instance for managing context across async boundaries
 */
const asyncLocalStorage = new AsyncLocalStorage();
/**
 * Context class for managing request-scoped data
 */
export class Context {
    _store;
    constructor(initial) {
        this._store = new Store();
        this._store.merge(initial);
    }
    /**
     * Create a new context with initial data
     * @param initial - Initial data for the context
     * @returns A new context instance
     */
    static create(initial = {}) {
        return new Context(initial);
    }
    /**
     * Get the current active context
     * @returns The current context or undefined if no context is active
     */
    static current() {
        return asyncLocalStorage.getStore();
    }
    /**
     * Get a value from the context
     * @param key - The key to get
     * @returns The value or undefined if not found
     */
    get(key) {
        return this._store.get(key.name);
    }
    /**
     * Set a value in the context
     * @param key - The key to set
     * @param value - The value to store
     * @param policy - The policy to use when key already exists (default: 'overwrite')
     */
    set(key, value, policy) {
        this._store.set(key.name, value, policy);
    }
    /**
     * Check if a key exists in the context
     * @param key - The key to check
     * @returns True if the key exists
     */
    has(key) {
        return this._store.has(key.name);
    }
    /**
     * Require a value from the context, throwing an error if not found
     * @param key - The key to require
     * @returns The value
     * @throws ContextMissingError if the key is not found
     */
    require(key) {
        const value = this._store.get(key.name);
        if (value === undefined) {
            throw new ContextMissingError(key.name);
        }
        return value;
    }
    /**
     * Merge multiple key-value pairs into the context
     * @param data - The data to merge
     * @param policy - The policy to use when keys already exist (default: 'overwrite')
     */
    merge(data, policy) {
        this._store.merge(data, policy);
    }
    /**
     * Create a snapshot of the current context state
     * @returns A snapshot of the context
     */
    snapshot() {
        const store = this._store.getStore();
        return {
            store: { ...store },
        };
    }
    /**
     * Restore the context from a snapshot
     * @param snapshot - The snapshot to restore
     */
    restore(snapshot) {
        const currentStore = this._store.getStore();
        // Clear current store
        for (const key of Object.keys(currentStore)) {
            Reflect.deleteProperty(currentStore, key);
        }
        // Restore from snapshot
        Object.assign(currentStore, snapshot.store);
    }
    /**
     * Run a function within this context
     * @param fn - The function to run
     * @returns The result of the function
     */
    run(fn) {
        return asyncLocalStorage.run(this, fn);
    }
    /**
     * Get the internal store (for testing purposes)
     * @returns The internal store
     * @internal
     */
    _getStore() {
        return this._store;
    }
}
//# sourceMappingURL=context.js.map