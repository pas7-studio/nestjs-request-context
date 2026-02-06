/**
 * NestJS module for request context management
 */
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
import { Module } from '@nestjs/common';
import { RequestContextService, MODULE_OPTIONS } from './request-context.service.js';
import { ContextInterceptor } from './context.interceptor.js';
import { ContextGuard } from './context.guard.js';
/**
 * Module for managing request context in NestJS applications
 */
/* eslint-disable @typescript-eslint/no-extraneous-class */
let RequestContextModule = (() => {
    let _classDecorators = [Module({})];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var RequestContextModule = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            RequestContextModule = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
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
                module: RequestContextModule,
                imports: options.imports,
                providers,
                exports: [RequestContextService],
                global: true,
            };
        }
    };
    return RequestContextModule = _classThis;
})();
export { RequestContextModule };
//# sourceMappingURL=request-context.module.js.map