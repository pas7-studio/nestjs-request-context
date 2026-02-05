/**
 * Interceptor for enriching context with request information
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
import { Inject, Injectable } from '@nestjs/common';
import { run } from '@pas7/request-context-core';
import { MODULE_OPTIONS } from './request-context.service.js';
/**
 * Interceptor that enriches the context with request information
 * - Extracts or generates request ID
 * - Adds route and method in 'standard' mode
 * - Optionally adds IP address if configured
 */
let ContextInterceptor = class ContextInterceptor {
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
            contextData[ipKey] = request.ip ?? request.socket?.remoteAddress;
        }
        // Run the handler within the enriched context
        return run(contextData, () => next.handle());
    }
};
ContextInterceptor = __decorate([
    Injectable(),
    __param(0, Inject(MODULE_OPTIONS)),
    __metadata("design:paramtypes", [Object])
], ContextInterceptor);
export { ContextInterceptor };
//# sourceMappingURL=context.interceptor.js.map