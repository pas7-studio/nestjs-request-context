/**
 * Injectable service providing static access to request context
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var RequestContextService_1;
import { Inject, Injectable } from '@nestjs/common';
import { get, set, has, require } from '@pas7/request-context-core';
/** Injection token for module options */
export const MODULE_OPTIONS = Symbol('MODULE_OPTIONS');
/**
 * Service for accessing request context
 * Provides static methods for convenient access without dependency injection
 */
let RequestContextService = RequestContextService_1 = class RequestContextService {
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
        return RequestContextService_1.get({ name: 'requestId' });
    }
    /**
     * Get the route from the current context
     * @returns The route or undefined
     */
    static getRoute() {
        return RequestContextService_1.get({ name: 'route' });
    }
    /**
     * Get the HTTP method from the current context
     * @returns The method or undefined
     */
    static getMethod() {
        return RequestContextService_1.get({ name: 'method' });
    }
};
RequestContextService = RequestContextService_1 = __decorate([
    Injectable(),
    __param(0, Inject(MODULE_OPTIONS)),
    __metadata("design:paramtypes", [Object])
], RequestContextService);
export { RequestContextService };
//# sourceMappingURL=request-context.service.js.map