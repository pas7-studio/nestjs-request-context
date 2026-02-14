/**
 * NestJS interceptor for Express request context
 */

import type { NestInterceptor } from '@nestjs/common';
import { createRequestContextInterceptor } from '@pas7/nestjs-request-context-shared';
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
  return createRequestContextInterceptor(options);
}
