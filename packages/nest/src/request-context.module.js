/**
 * NestJS module for request context management
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RequestContextModule_1;
import { Module } from '@nestjs/common';
import { RequestContextService, MODULE_OPTIONS } from './request-context.service.js';
import { ContextInterceptor } from './context.interceptor.js';
import { ContextGuard } from './context.guard.js';
/**
 * Module for managing request context in NestJS applications
 */
let RequestContextModule = RequestContextModule_1 = class RequestContextModule {
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
    static forRoot(options = {}) {
        const providers = [
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
            module: RequestContextModule_1,
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
    static forRootAsync(options) {
        const providers = [
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
            module: RequestContextModule_1,
            imports: options.imports,
            providers,
            exports: [RequestContextService],
            global: true,
        };
    }
};
RequestContextModule = RequestContextModule_1 = __decorate([
    Module({})
], RequestContextModule);
export { RequestContextModule };
//# sourceMappingURL=request-context.module.js.map