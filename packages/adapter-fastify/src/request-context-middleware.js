/**
 * NestJS middleware for request context management with Fastify
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
/**
 * NestJS middleware class for request context with FastifyAdapter
 *
 * The middleware:
 * - Extracts or generates a request ID from headers
 * - Starts the request context using core.run() with next callback
 * - Optionally adds the request ID to response headers
 * - Maintains AsyncLocalStorage throughout request lifecycle
 *
 * @param options - Middleware configuration options
 * @returns NestJS middleware class
 *
 * @example
 * ```typescript
 * import { Module, MiddlewareConsumer } from '@nestjs/common';
 * import { requestContextMiddleware } from '@pas7/nestjs-request-context-adapter-fastify';
 *
 * @Module({
 *   // ...
 * })
 * export class AppModule {
 *   configure(consumer: MiddlewareConsumer) {
 *     consumer.apply(requestContextMiddleware()).forRoutes('*');
 *   }
 * }
 * ```
 */
export function requestContextMiddleware(options) {
    // Merge options with defaults (avoid allocations in hot path)
    const headerName = options?.header ?? 'x-request-id';
    const idGenerator = options?.idGenerator ?? (() => crypto.randomUUID());
    const addResponseHeader = options?.addResponseHeader ?? true;
    let RequestContextMiddleware = (() => {
        let _classDecorators = [Injectable()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var RequestContextMiddleware = class {
            static { _classThis = this; }
            static {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                RequestContextMiddleware = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                __runInitializers(_classThis, _classExtraInitializers);
            }
            use(req, res, next) {
                // Get request ID from header or generate new one
                const headers = req.headers;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const requestId = typeof headers[headerName] === 'string' ? headers[headerName] : idGenerator();
                // Optionally add request ID to response headers
                if (addResponseHeader) {
                    res.header(headerName, requestId);
                }
                // Start request context by wrapping request handling
                // Using callback pattern to preserve AsyncLocalStorage throughout request lifecycle
                // The next() callback maintains context until request handling completes
                run({ requestId }, () => {
                    // The route handler will be executed within this context
                    // NestJS middleware chain maintains AsyncLocalStorage properly through the callback
                    next();
                });
            }
        };
        return RequestContextMiddleware = _classThis;
    })();
    return RequestContextMiddleware;
}
//# sourceMappingURL=request-context-middleware.js.map