/**
 * Core contracts and type definitions for request context management
 */

/**
 * Typed key for accessing store values without stringly-typed access
 * @template T - The type of value stored under this key
 */
export class ContextKey<T = unknown> {
  readonly name: string;
  // Type parameter T is used for type-safe access, not runtime
  readonly _type?: T;

  constructor(name: string) {
    this.name = name;
  }
}

/**
 * Policy for behavior when setting a key
 * - 'deny': Throw error if key already exists
 * - 'overwrite': Overwrite existing value
 * - 'ignore': Ignore if key already exists
 */
export type SetPolicy = 'deny' | 'overwrite' | 'ignore';

/**
 * Store type for context data storage
 * Store without prototype: Object.create(null)
 */
export type Store = {
  readonly [key: string]: unknown;
};
