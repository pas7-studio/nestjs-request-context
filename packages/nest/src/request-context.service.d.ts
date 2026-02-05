/**
 * Injectable service providing static access to request context
 */
import type { ContextKey } from '@pas7/request-context-core';
import type { RequestContextModuleOptions } from './config.js';
/** Injection token for module options */
export declare const MODULE_OPTIONS: unique symbol;
/**
 * Service for accessing request context
 * Provides static methods for convenient access without dependency injection
 */
export declare class RequestContextService {
    private readonly options;
    constructor(options: RequestContextModuleOptions);
    /**
     * Get a value from the current context
     * @param key - The context key to retrieve
     * @returns The value or undefined if not found
     */
    static get<T>(key: ContextKey<T>): T | undefined;
    /**
     * Set a value in the current context
     * @param key - The context key to set
     * @param value - The value to store
     */
    static set<T>(key: ContextKey<T>, value: T): void;
    /**
     * Check if a key exists in the current context
     * @param key - The context key to check
     * @returns True if the key exists
     */
    static has<T>(key: ContextKey<T>): boolean;
    /**
     * Require a value from the current context
     * @param key - The context key to require
     * @returns The value
     * @throws Error if the key is not found
     */
    static require<T>(key: ContextKey<T>): T;
    /**
     * Get the request ID from the current context
     * @returns The request ID or undefined
     */
    static getRequestId(): string | undefined;
    /**
     * Get the route from the current context
     * @returns The route or undefined
     */
    static getRoute(): string | undefined;
    /**
     * Get the HTTP method from the current context
     * @returns The method or undefined
     */
    static getMethod(): string | undefined;
}
//# sourceMappingURL=request-context.service.d.ts.map