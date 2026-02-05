/**
 * NestJS module for request context management
 */

import { DynamicModule, Module, Provider } from '@nestjs/common';
import type { RequestContextModuleAsyncOptions, RequestContextModuleOptions } from './config.js';
import { RequestContextService, MODULE_OPTIONS } from './request-context.service.js';
import { ContextInterceptor } from './context.interceptor.js';
import { ContextGuard } from './context.guard.js';

/**
 * Module for managing request context in NestJS applications
 */
/* eslint-disable @typescript-eslint/no-extraneous-class */
@Module({})
export class RequestContextModule {
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
  static forRoot(options: RequestContextModuleOptions = {}): DynamicModule {
    const providers: Provider[] = [
      {
        provide: MODULE_OPTIONS,
        useValue: options,
      },
      RequestContextService,
      ContextInterceptor,
      ContextGuard,
      {
        provide: 'APP_INTERCEPTOR',
        useClass: ContextInterceptor,
      },
    ];

    return {
      module: RequestContextModule,
      providers,
      exports: [RequestContextService],
      global: true,
    };
  }

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
  static forRootAsync(options: RequestContextModuleAsyncOptions): DynamicModule {
    const providers: Provider[] = [
      {
        provide: MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject,
      },
      RequestContextService,
      ContextInterceptor,
      ContextGuard,
      {
        provide: 'APP_INTERCEPTOR',
        useClass: ContextInterceptor,
      },
    ];

    return {
      module: RequestContextModule,
      imports: options.imports,
      providers,
      exports: [RequestContextService],
      global: true,
    };
  }
}
