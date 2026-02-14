/**
 * Internal Store implementation for context data storage
 */

import type { SetPolicy, Store as IStore } from './contracts.js';

/**
 * Creates an empty store without prototype
 * @returns A new empty store
 */
export function createEmptyStore(): IStore {
  return Object.create(null);
}

/**
 * Internal Store class for managing context data
 */
export class Store {
  private readonly _store: Record<string, unknown>;

  constructor() {
    this._store = createEmptyStore() as Record<string, unknown>;
  }

  /**
   * Set a value in the store
   * @param key - The key to set
   * @param value - The value to store
   * @param policy - The policy to use when key already exists (default: 'overwrite')
   */
  set(key: string, value: unknown, policy: SetPolicy = 'overwrite'): void {
    if (key in this._store) {
      switch (policy) {
        case 'deny':
          throw new Error(`Key "${key}" already exists in store`);
        case 'ignore':
          return;
        case 'overwrite':
          (this._store as Record<string, unknown>)[key] = value;
          break;
      }
    } else {
      (this._store as Record<string, unknown>)[key] = value;
    }
  }

  /**
   * Get a value from the store
   * @param key - The key to get
   * @returns The value or undefined if not found
   */
  get<T>(key: string): T | undefined {
    return this._store[key] as T | undefined;
  }

  /**
   * Check if a key exists in the store
   * @param key - The key to check
   * @returns True if the key exists
   */
  has(key: string): boolean {
    return key in this._store;
  }

  /**
   * Merge multiple key-value pairs into the store
   * @param data - The data to merge
   * @param policy - The policy to use when keys already exist (default: 'overwrite')
   */
  merge(data: Record<string, unknown>, policy: SetPolicy = 'overwrite'): void {
    for (const key of Object.keys(data)) {
      this.set(key, data[key], policy);
    }
  }

  /**
   * Get the underlying store object
   * @returns The internal store
   */
  getStore(): Record<string, unknown> {
    return this._store;
  }

  /**
   * Reset the store with new data, replacing all existing entries
   * This creates a new internal store object to avoid memory leaks
   * @param data - The new data for the store
   */
  reset(data: Record<string, unknown> = {}): void {
    (this as { _store: Record<string, unknown> })._store = createEmptyStore();
    Object.assign(this._store, data);
  }

  /**
   * Clear all entries from the store
   * Creates a new empty store object to avoid memory leaks
   */
  clear(): void {
    (this as { _store: Record<string, unknown> })._store = createEmptyStore();
  }
}
