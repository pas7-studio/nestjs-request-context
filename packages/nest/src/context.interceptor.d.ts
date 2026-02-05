/**
 * Interceptor for enriching context with request information
 */
import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import type { RequestContextModuleOptions } from './config.js';
/**
 * Interceptor that enriches the context with request information
 * - Extracts or generates request ID
 * - Adds route and method in 'standard' mode
 * - Optionally adds IP address if configured
 */
export declare class ContextInterceptor implements NestInterceptor {
    private readonly options;
    constructor(options: RequestContextModuleOptions);
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown>;
}
//# sourceMappingURL=context.interceptor.d.ts.map