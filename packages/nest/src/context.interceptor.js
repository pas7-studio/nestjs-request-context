/**
 * Interceptor for enriching context with request information
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
import { run } from '@pas7/request-context-core';
/**
 * Interceptor that enriches the context with request information
 * - Extracts or generates request ID
 * - Adds route and method in 'standard' mode
 * - Optionally adds IP address if configured
 */
let ContextInterceptor = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ContextInterceptor = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ContextInterceptor = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        options;
        constructor(options) {
            this.options = options;
        }
        intercept(context, next) {
            const httpContext = context.switchToHttp();
            const request = httpContext.getRequest();
            // Prepare context data
            const contextData = {};
            // Get or generate request ID
            const headerName = this.options.header ?? 'x-request-id';
            const requestId = request.headers[headerName] ??
                this.options.idGenerator?.() ??
                crypto.randomUUID();
            const requestIdKey = this.options.keys?.requestId ?? 'requestId';
            contextData[requestIdKey] = requestId;
            // Add route and method in standard mode
            if (this.options.mode === 'standard') {
                const routeKey = this.options.keys?.route ?? 'route';
                const methodKey = this.options.keys?.method ?? 'method';
                // Get route from request (Express: req.route?.path, Fastify: req.routeOptions?.url)
                const routePath = request.route?.path ??
                    request.routeOptions?.url ??
                    request.url;
                contextData[routeKey] = routePath;
                contextData[methodKey] = request.method;
            }
            // Add IP if configured
            if (this.options.keys?.ip) {
                const ipKey = this.options.keys.ip;
                contextData[ipKey] =
                    request.ip ?? request.socket?.remoteAddress;
            }
            // Run the handler within the enriched context
            return run(contextData, () => next.handle());
        }
    };
    return ContextInterceptor = _classThis;
})();
export { ContextInterceptor };
//# sourceMappingURL=context.interceptor.js.map