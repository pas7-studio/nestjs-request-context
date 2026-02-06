/**
 * Injectable service providing static access to request context
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
import { get, set, has, require } from '@pas7/request-context-core';
/** Injection token for module options */
export const MODULE_OPTIONS = Symbol('MODULE_OPTIONS');
/**
 * Service for accessing request context
 * Provides static methods for convenient access without dependency injection
 */
let RequestContextService = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var RequestContextService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            RequestContextService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        options;
        constructor(options) {
            this.options = options;
        }
        /**
         * Get a value from the current context
         * @param key - The context key to retrieve
         * @returns The value or undefined if not found
         */
        static get(key) {
            return get(key);
        }
        /**
         * Set a value in the current context
         * @param key - The context key to set
         * @param value - The value to store
         */
        static set(key, value) {
            set(key, value);
        }
        /**
         * Check if a key exists in the current context
         * @param key - The context key to check
         * @returns True if the key exists
         */
        static has(key) {
            return has(key);
        }
        /**
         * Require a value from the current context
         * @param key - The context key to require
         * @returns The value
         * @throws Error if the key is not found
         */
        static require(key) {
            return require(key);
        }
        /**
         * Get the request ID from the current context
         * @returns The request ID or undefined
         */
        static getRequestId() {
            return RequestContextService.get({ name: 'requestId' });
        }
        /**
         * Get the route from the current context
         * @returns The route or undefined
         */
        static getRoute() {
            return RequestContextService.get({ name: 'route' });
        }
        /**
         * Get the HTTP method from the current context
         * @returns The method or undefined
         */
        static getMethod() {
            return RequestContextService.get({ name: 'method' });
        }
    };
    return RequestContextService = _classThis;
})();
export { RequestContextService };
//# sourceMappingURL=request-context.service.js.map