/**
 * Decorator for injecting context values into controller methods
 */

import { createParamDecorator } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';
import { Context } from '@pas7/request-context-core';
import type { ContextKey } from '@pas7/request-context-core';
import { get } from '@pas7/request-context-core';

/**
 * Internal function to get context value by key
 *
 * @param key - Optional context key. If not provided, returns entire store
 * @returns The context value or entire store
 * @throws Error if no active context found
 *
 * @internal
 */
export function getContextValue<T>(key: ContextKey<T> | undefined): T | Record<string, unknown> {
  const currentContext = Context.current();
  if (!currentContext) {
    throw new Error('No active context found');
  }

  if (!key) {
    // Return the entire store if no key is provided
    return currentContext._getStore().getStore() as Record<string, unknown>;
  }
  // Return value for the specific key
  return get(key);
}

/**
 * Parameter decorator for injecting context values
 *
 * @example
 * ```typescript
 * @Get()
 * handler(@Ctx() store: Record<string, unknown>) {
 *   // Returns entire context store
 * }
 *
 * @Get()
 * handler(@Ctx(REQUEST_ID_KEY) requestId: string) {
 *   // Returns typed value for specific key
 * }
 * ```
 *
 * @param key - Optional context key. If not provided, returns entire store
 * @returns Parameter decorator
 */
export const Ctx = createParamDecorator(
  <T>(key: ContextKey<T> | undefined, _ctx: ExecutionContext): T | Record<string, unknown> => {
    return getContextValue(key);
  }
);
