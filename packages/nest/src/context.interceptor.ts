/**
 * Interceptor for enriching context with request information
 */

import { Inject, Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { run } from '@pas7/request-context-core';
import { MODULE_OPTIONS } from './request-context.module.js';
import type { RequestContextModuleOptions } from './config.js';

/**
 * Interceptor that enriches the context with request information
 * - Extracts or generates request ID
 * - Adds route and method in 'standard' mode
 * - Optionally adds IP address if configured
 */
@Injectable()
export class ContextInterceptor implements NestInterceptor {
  constructor(@Inject(MODULE_OPTIONS) private readonly options: RequestContextModuleOptions) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Record<string, unknown>>();

    // Prepare context data
    const contextData: Record<string, unknown> = {};

    // Get or generate request ID
    const headerName = this.options.header ?? 'x-request-id';
    const requestId =
      (request.headers as Record<string, string | undefined>)[headerName] ??
      this.options.idGenerator?.() ??
      crypto.randomUUID();

    const requestIdKey = this.options.keys?.requestId ?? 'requestId';
    contextData[requestIdKey] = requestId;

    // Add route and method in standard mode
    if (this.options.mode === 'standard') {
      const routeKey = this.options.keys?.route ?? 'route';
      const methodKey = this.options.keys?.method ?? 'method';

      // Get route from request (Express: req.route?.path, Fastify: req.routeOptions?.url)
      const routePath =
        (request.route as { path?: string } | undefined)?.path ??
        (request.routeOptions as { url?: string } | undefined)?.url ??
        request.url;

      contextData[routeKey] = routePath;
      contextData[methodKey] = request.method;
    }

    // Add IP if configured
    if (this.options.keys?.ip) {
      const ipKey = this.options.keys.ip;
      contextData[ipKey] =
        request.ip ?? (request.socket as { remoteAddress?: string })?.remoteAddress;
    }

    // Run the handler within the enriched context
    return run(contextData, () => next.handle());
  }
}
