/**
 * Decorator for injecting context values into controller methods
 */
import { createParamDecorator } from '@nestjs/common';
import { Context } from '@pas7/request-context-core';
import { get } from '@pas7/request-context-core';
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
export const Ctx = createParamDecorator((key, _ctx) => {
    const currentContext = Context.current();
    if (!currentContext) {
        throw new Error('No active context found');
    }
    if (!key) {
        // Return the entire store if no key is provided
        return currentContext._getStore().getStore();
    }
    // Return value for the specific key
    return get(key);
});
//# sourceMappingURL=ctx.decorator.js.map