/**
 * Guard for checking if context is active
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable, ForbiddenException } from '@nestjs/common';
import { Context } from '@pas7/request-context-core';
/**
 * Guard that ensures an active context exists
 * Throws ForbiddenException if no context is active
 */
let ContextGuard = class ContextGuard {
    canActivate(context) {
        const currentContext = Context.current();
        if (!currentContext) {
            throw new ForbiddenException('No active context found');
        }
        return true;
    }
};
ContextGuard = __decorate([
    Injectable()
], ContextGuard);
export { ContextGuard };
//# sourceMappingURL=context.guard.js.map