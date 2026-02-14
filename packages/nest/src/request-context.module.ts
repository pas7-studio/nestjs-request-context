/**
 * NestJS module for request context management
 */

import {
  DynamicModule,
  InjectionToken,
  Module,
  OptionalFactoryDependency,
  Provider,
} from '@nestjs/common';
import type { RequestContextModuleAsyncOptions, RequestContextModuleOptions } from './config.js';
import { RequestContextService } from './request-context.service.js';
import { ContextInterceptor } from './context.interceptor.js';
import { ContextGuard } from './context.guard.js';

/** Injection token for module options */
export const MODULE_OPTIONS = Symbol('MODULE_OPTIONS');

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
    ];

    const extraProviders: Provider[] = [];

    // Only register ContextInterceptor, ContextGuard, and APP_INTERCEPTOR if useGlobalInterceptor is true (default)
    if (options.useGlobalInterceptor !== false) {
      providers.push(ContextInterceptor, ContextGuard);
      extraProviders.push({
        provide: 'APP_INTERCEPTOR',
        useClass: ContextInterceptor,
      });
    }

    return {
      module: RequestContextModule,
      providers: [...providers, ...extraProviders],
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
        inject: options.inject as (InjectionToken | OptionalFactoryDependency)[] | undefined,
      },
      RequestContextService,
    ];

    const extraProviders: Provider[] = [];

    // Register ContextInterceptor and ContextGuard
    // Use useFactory to conditionally provide APP_INTERCEPTOR based on useGlobalInterceptor option
    providers.push(ContextInterceptor, ContextGuard);
    extraProviders.push({
      provide: 'APP_INTERCEPTOR',
      useFactory: (moduleOptions: RequestContextModuleOptions) => {
        // If useGlobalInterceptor is explicitly false, return undefined (no interceptor)
        if (moduleOptions.useGlobalInterceptor === false) {
          return undefined;
        }
        // Otherwise, create a new instance of ContextInterceptor
        return new ContextInterceptor();
      },
      inject: [MODULE_OPTIONS],
    });

    return {
      module: RequestContextModule,
      imports: options.imports,
      providers: [...providers, ...extraProviders],
      exports: [RequestContextService],
      global: true,
    };
  }
}
