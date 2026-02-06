/**
 * Decorator for injecting context values into controller methods
 */
import type { ContextKey } from '@pas7/request-context-core';
/**
 * Internal function to get context value by key
 *
 * @param key - Optional context key. If not provided, returns entire store
 * @returns The context value or entire store
 * @throws Error if no active context found
 *
 * @internal
 */
export declare function getContextValue<T>(key: ContextKey<T> | undefined): T | Record<string, unknown>;
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
export declare const Ctx: <T>(...dataOrPipes: (ContextKey<T> | import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>> | undefined)[]) => ParameterDecorator;
//# sourceMappingURL=ctx.decorator.d.ts.map