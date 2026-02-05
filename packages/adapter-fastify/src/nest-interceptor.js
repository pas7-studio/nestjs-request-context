/**
 * NestJS interceptor for Fastify request context
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
import { Injectable } from '@nestjs/common';
/**
 * NestJS interceptor that integrates the Fastify request context plugin with NestJS
 *
 * This interceptor is designed to be used with NestJS applications using FastifyAdapter.
 * It provides a way to apply the request context functionality to specific routes or controllers.
 *
 * Note: For global application-wide request context, it's recommended to register the
 * `requestContextPlugin` directly on the Fastify instance.
 *
 * @param options - Configuration options for the request context
 * @returns A NestJS interceptor class
 */
export function UseRequestContextFastify(options) {
    let RequestContextInterceptor = class RequestContextInterceptor {
        constructor() {
            // Store options for future use
            // Currently, the actual context management happens in the Fastify plugin
            // This interceptor can be extended with additional functionality
            void options;
        }
        intercept(_context, next) {
            // Note: The actual context management happens in the Fastify plugin (requestContextPlugin)
            // This interceptor serves as a marker and can be extended in the future for
            // additional functionality or validation
            return next.handle();
        }
    };
    RequestContextInterceptor = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [])
    ], RequestContextInterceptor);
    return RequestContextInterceptor;
}
//# sourceMappingURL=nest-interceptor.js.map