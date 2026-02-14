/**
 * Injectable service providing static access to request context
 */

import { Injectable } from '@nestjs/common';
import { get, set, has, require } from '@pas7/request-context-core';
import { REQUEST_ID_KEY, ROUTE_KEY, METHOD_KEY } from './keys.js';

/**
 * Service for accessing request context
 * Provides static methods for convenient access without dependency injection
 */
/* eslint-disable @typescript-eslint/no-extraneous-class */
@Injectable()
export class RequestContextService {
  // Constructor removed - unused dependency injection parameter

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
    return RequestContextService.get(REQUEST_ID_KEY);
  }

  /**
   * Get the route from the current context
   * @returns The route or undefined
   */
  static getRoute(): string | undefined {
    return RequestContextService.get(ROUTE_KEY);
  }

  /**
   * Get the HTTP method from the current context
   * @returns The method or undefined
   */
  static getMethod(): string | undefined {
    return RequestContextService.get(METHOD_KEY);
  }
}
