/**
 * Factory function to create NestJS request context interceptors
 *
 * This module provides a unified way to create NestJS interceptors
 * for different HTTP adapters (Express, Fastify) with shared logic.
 */

import type { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { run } from '@pas7/request-context-core';
import type { RequestContextAdapterOptions } from './adapter-config.js';
import { DEFAULT_ADAPTER_OPTIONS } from './adapter-config.js';

/**
 * Options for creating a request context interceptor
 */
export interface CreateInterceptorOptions extends RequestContextAdapterOptions {
  /**
   * Optional suffix for the interceptor class name (e.g., 'Express', 'Fastify')
   * Used for debugging and logging purposes
   */
  nameSuffix?: string;
}

/**
 * Factory function to create a NestJS request context interceptor class
 *
 * This function encapsulates the shared logic for creating interceptors
 * that initialize request context for NestJS applications.
 *
 * @param options - Configuration options for the interceptor
 * @returns A NestJS interceptor class
 *
 * @example
 * ```typescript
 * import { createRequestContextInterceptor } from '@pas7/nestjs-request-context-shared';
 *
 * // Create Express interceptor
 * export function UseRequestContextExpress(options?: RequestContextExpressOptions) {
 *   return createRequestContextInterceptor(options);
 * }
 *
 * // Create Fastify interceptor
 * export function UseRequestContextFastify(options?: RequestContextFastifyOptions) {
 *   return createRequestContextInterceptor(options);
 * }
 * ```
 */
export function createRequestContextInterceptor(
  options?: CreateInterceptorOptions
): new () => NestInterceptor {
  // Pre-resolve options to avoid allocations in hot path
  const headerName = options?.header ?? DEFAULT_ADAPTER_OPTIONS.header;
  const idGenerator = options?.idGenerator ?? DEFAULT_ADAPTER_OPTIONS.idGenerator;

  @Injectable()
  class RequestContextInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
      const httpContext = context.switchToHttp();
      const request = httpContext.getRequest<{ headers: Record<string, string | undefined> }>();

      // Get request ID from header or generate new one
      const requestId = request.headers[headerName] ?? idGenerator();

      // Run the handler within the request context
      return run({ requestId }, () => next.handle());
    }
  }

  return RequestContextInterceptor;
}
