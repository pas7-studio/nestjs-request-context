/**
 * NestJS module for request context management
 */
import { DynamicModule } from '@nestjs/common';
import type { RequestContextModuleAsyncOptions, RequestContextModuleOptions } from './config.js';
/**
 * Module for managing request context in NestJS applications
 */
export declare class RequestContextModule {
    /**
     * Configure the module synchronously
     *
     * @example
     * ```typescript
     * @Module({
     *   imports: [RequestContextModule.forRoot()],
     * })
     * export class AppModule {}
     *
     * @Module({
     *   imports: [
     *     RequestContextModule.forRoot({
     *       mode: 'standard',
     *       keys: { ip: 'clientIp' },
     *     }),
     *   ],
     * })
     * export class AppModule {}
     * ```
     *
     * @param options - Configuration options
     * @returns Dynamic module configuration
     */
    static forRoot(options?: RequestContextModuleOptions): DynamicModule;
    /**
     * Configure the module asynchronously with dependency injection
     *
     * @example
     * ```typescript
     * @Module({
     *   imports: [
     *     RequestContextModule.forRootAsync({
     *       imports: [ConfigModule],
     *       inject: [ConfigService],
     *       useFactory: (config: ConfigService) => ({
     *         mode: config.get('REQUEST_CONTEXT_MODE'),
     *         header: config.get('REQUEST_ID_HEADER'),
     *       }),
     *     }),
     *   ],
     * })
     * export class AppModule {}
     * ```
     *
     * @param options - Async configuration options
     * @returns Dynamic module configuration
     */
    static forRootAsync(options: RequestContextModuleAsyncOptions): DynamicModule;
}
//# sourceMappingURL=request-context.module.d.ts.map