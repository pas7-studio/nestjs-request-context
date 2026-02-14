/**
 * NestJS interceptor for Fastify request context
 */

import type { NestInterceptor } from '@nestjs/common';
import { createRequestContextInterceptor } from '@pas7/nestjs-request-context-shared';
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
  return createRequestContextInterceptor(options);
}
