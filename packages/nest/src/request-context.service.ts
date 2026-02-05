/**
 * Injectable service providing static access to request context
 */

import { Inject, Injectable } from '@nestjs/common';
import type { ContextKey } from '@pas7/request-context-core';
import { get, set, has, require } from '@pas7/request-context-core';
import type { RequestContextModuleOptions } from './config.js';

/** Injection token for module options */
export const MODULE_OPTIONS = Symbol('MODULE_OPTIONS');

/**
 * Service for accessing request context
 * Provides static methods for convenient access without dependency injection
 */
@Injectable()
export class RequestContextService {
  constructor(@Inject(MODULE_OPTIONS) private readonly options: RequestContextModuleOptions) {}

  /**
   * Get a value from the current context
   * @param key - The context key to retrieve
   * @returns The value or undefined if not found
   */
  static get<T>(key: ContextKey<T>): T | undefined {
    return get(key);
  }

  /**
   * Set a value in the current context
   * @param key - The context key to set
   * @param value - The value to store
   */
  static set<T>(key: ContextKey<T>, value: T): void {
    set(key, value);
  }

  /**
   * Check if a key exists in the current context
   * @param key - The context key to check
   * @returns True if the key exists
   */
  static has<T>(key: ContextKey<T>): boolean {
    return has(key);
  }

  /**
   * Require a value from the current context
   * @param key - The context key to require
   * @returns The value
   * @throws Error if the key is not found
   */
  static require<T>(key: ContextKey<T>): T {
    return require(key);
  }

  /**
   * Get the request ID from the current context
   * @returns The request ID or undefined
   */
  static getRequestId(): string | undefined {
    return RequestContextService.get({ name: 'requestId' } as ContextKey<string>);
  }

  /**
   * Get the route from the current context
   * @returns The route or undefined
   */
  static getRoute(): string | undefined {
    return RequestContextService.get({ name: 'route' } as ContextKey<string>);
  }

  /**
   * Get the HTTP method from the current context
   * @returns The method or undefined
   */
  static getMethod(): string | undefined {
    return RequestContextService.get({ name: 'method' } as ContextKey<string>);
  }
}
