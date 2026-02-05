/**
 * NestJS interceptor for Express request context
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
import { Injectable } from '@nestjs/common';
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
export function UseRequestContextExpress(options) {
    let RequestContextInterceptor = (() => {
        let _classDecorators = [Injectable()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var RequestContextInterceptor = class {
            static { _classThis = this; }
            static {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                RequestContextInterceptor = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                __runInitializers(_classThis, _classExtraInitializers);
            }
            constructor() {
                // Store options for future use
                // Currently, the actual context management happens in the Express middleware
                // This interceptor can be extended with additional functionality
                void options;
            }
            intercept(_context, next) {
                // Note: The actual context management happens in the Express middleware (requestContextMiddleware)
                // This interceptor serves as a marker and can be extended in the future for
                // additional functionality or validation
                return next.handle();
            }
        };
        return RequestContextInterceptor = _classThis;
    })();
    return RequestContextInterceptor;
}
//# sourceMappingURL=nest-interceptor.js.map