/**
 * NestJS interceptor for Express request context
 */

import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
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
  options?: RequestContextExpressOptions,
): new () => NestInterceptor {
  @Injectable()
  class RequestContextInterceptor implements NestInterceptor {
    constructor() {
      // Store options for future use
      // Currently, the actual context management happens in the Express middleware
      // This interceptor can be extended with additional functionality
      void options;
    }

    intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
      // Note: The actual context management happens in the Express middleware (requestContextMiddleware)
      // This interceptor serves as a marker and can be extended in the future for
      // additional functionality or validation

      return next.handle();
    }
  }

  return RequestContextInterceptor;
}
