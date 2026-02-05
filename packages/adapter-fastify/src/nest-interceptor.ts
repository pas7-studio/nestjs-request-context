/**
 * NestJS interceptor for Fastify request context
 */

import type { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';
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
  @Injectable()
  class RequestContextInterceptor implements NestInterceptor {
    constructor() {
      // Store options for future use
      // Currently, the actual context management happens in the Fastify plugin
      // This interceptor can be extended with additional functionality
      void options;
    }

    intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
      // Note: The actual context management happens in the Fastify plugin (requestContextPlugin)
      // This interceptor serves as a marker and can be extended in the future for
      // additional functionality or validation

      return next.handle();
    }
  }

  return RequestContextInterceptor;
}
