/**
 * Internal Store implementation for context data storage
 */
/**
 * Creates an empty store without prototype
 * @returns A new empty store
 */
export function createEmptyStore() {
    return Object.create(null);
}
/**
 * Internal Store class for managing context data
 */
export class Store {
    _store;
    constructor() {
        this._store = createEmptyStore();
    }
    /**
     * Set a value in the store
     * @param key - The key to set
     * @param value - The value to store
     * @param policy - The policy to use when key already exists (default: 'overwrite')
     */
    set(key, value, policy = 'overwrite') {
        if (key in this._store) {
            switch (policy) {
                case 'deny':
                    throw new Error(`Key "${key}" already exists in store`);
                case 'ignore':
                    return;
                case 'overwrite':
                    this._store[key] = value;
                    break;
            }
        }
        else {
            this._store[key] = value;
        }
    }
    /**
     * Get a value from the store
     * @param key - The key to get
     * @returns The value or undefined if not found
     */
    get(key) {
        return this._store[key];
    }
    /**
     * Check if a key exists in the store
     * @param key - The key to check
     * @returns True if the key exists
     */
    has(key) {
        return key in this._store;
    }
    /**
     * Merge multiple key-value pairs into the store
     * @param data - The data to merge
     * @param policy - The policy to use when keys already exist (default: 'overwrite')
     */
    merge(data, policy = 'overwrite') {
        for (const key of Object.keys(data)) {
            this.set(key, data[key], policy);
        }
    }
    /**
     * Get the underlying store object
     * @returns The internal store
     */
    getStore() {
        return this._store;
    }
}
//# sourceMappingURL=store.js.map