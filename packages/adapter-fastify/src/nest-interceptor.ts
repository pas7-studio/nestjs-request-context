/**
 * NestJS interceptor for Fastify request context
 */

import type { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { run } from '@pas7/request-context-core';
import type { RequestContextFastifyOptions } from './config.js';

/**
 * NestJS interceptor that integrates the Fastify request context plugin with NestJS
 *
 * This interceptor is designed to be used with NestJS applications using FastifyAdapter.
 * It provides a way to apply the request context functionality to specific routes or controllers.
 *
 * Note: For global application-wide request context, it's recommended to register the
 * `requestContextPlugin` directly on the Fastify instance.
 *
 * @param options - Configuration options for the request context
 * @returns A NestJS interceptor class
 */
export function UseRequestContextFastify(
  options?: RequestContextFastifyOptions
): new () => NestInterceptor {
  // Pre-resolve options to avoid allocations in hot path
  const headerName = options?.header ?? 'x-request-id';
  const idGenerator = options?.idGenerator ?? (() => crypto.randomUUID());

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
