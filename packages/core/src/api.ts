/**
 * Core API functions for context management
 */

import type { ContextKey, SetPolicy } from './contracts.js';
import { ContextNotActiveError, ContextKeyCollisionError } from './errors.js';
import type { ContextSnapshot } from './snapshot.js';
import { Context } from './context.js';

/**
 * Run a function within a new context
 * This is the only way to start a context. It creates a context, executes the function, and cleans up the context.
 * @param initial - Initial data for the context
 * @param fn - The function to run within the context
 * @returns The result of the function
 */
export function run<T>(initial: Record<string, unknown>, fn: () => T): T {
  const context = Context.create(initial);
  return context.run(fn);
}

/**
 * Get the current active context
 * @returns The current context
 * @throws ContextNotActiveError if no context is active
 */
function getCurrentContext(): Context {
  const context = Context.current();
  if (!context) {
    throw new ContextNotActiveError();
  }
  return context;
}

/**
 * Get a value from the current context
 * @param key - The key to get
 * @returns The value or undefined if not found
 */
export function get<T>(key: ContextKey<T>): T | undefined {
  const context = getCurrentContext();
  return context.get(key);
}

/**
 * Set a value in the current context
 * @param key - The key to set
 * @param value - The value to store
 * @param policy - The policy to use when key already exists (default: 'overwrite')
 * @throws ContextKeyCollisionError if key already exists and policy is 'deny'
 */
export function set<T>(key: ContextKey<T>, value: T, policy: SetPolicy = 'overwrite'): void {
  const context = getCurrentContext();
  try {
    context.set(key, value, policy);
  } catch (error) {
    if (error instanceof Error && error.message.includes('already exists')) {
      throw new ContextKeyCollisionError(key.name);
    }
    throw error;
  }
}

/**
 * Check if a key exists in the current context
 * @param key - The key to check
 * @returns True if the key exists
 */
export function has<T>(key: ContextKey<T>): boolean {
  const context = getCurrentContext();
  return context.has(key);
}

/**
 * Require a value from the current context, throwing an error if not found
 * @param key - The key to require
 * @returns The value
 * @throws ContextMissingError if the key is not found
 */
export function require<T>(key: ContextKey<T>): T {
  const context = getCurrentContext();
  return context.require(key);
}

/**
 * Merge multiple key-value pairs into the current context
 * @param data - The data to merge
 * @param policy - The policy to use when keys already exist (default: 'overwrite')
 */
export function merge(data: Record<string, unknown>, policy: SetPolicy = 'overwrite'): void {
  const context = getCurrentContext();
  context.merge(data, policy);
}

/**
 * Create a snapshot of the current context state
 * @returns A snapshot of the context
 */
export function snapshot(): ContextSnapshot {
  const context = getCurrentContext();
  return context.snapshot();
}

/**
 * Restore the current context from a snapshot
 * @param snapshot - The snapshot to restore
 */
export function restore(snapshot: ContextSnapshot): void {
  const context = getCurrentContext();
  context.restore(snapshot);
}
