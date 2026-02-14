/**
 * NestJS interceptor for Express request context
 */

import type { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { run } from '@pas7/request-context-core';
import type { RequestContextExpressOptions } from './config.js';

/**
 * NestJS interceptor that integrates the Express request context middleware with NestJS
 *
 * This interceptor is designed to be used with NestJS applications using ExpressAdapter.
 * It provides a way to apply the request context functionality to specific routes or controllers.
 *
 * Note: For global application-wide request context, it's recommended to register the
 * `requestContextMiddleware` directly on the Express instance before Nest initialization.
 *
 * @param options - Configuration options for the request context
 * @returns A NestJS interceptor class
 *
 * @example
 * ```typescript
 * import { Controller, Get, UseInterceptors } from '@nestjs/common';
 * import { UseRequestContextExpress } from '@pas7/nestjs-request-context-adapter-express';
 *
 * @Controller()
 * @UseInterceptors(UseRequestContextExpress())
 * export class MyController {
 *   @Get()
 *   test() {
 *     // Context is available here
 *   }
 * }
 * ```
 */
export function UseRequestContextExpress(
  options?: RequestContextExpressOptions
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
