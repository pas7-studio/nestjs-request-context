/**
 * Guard for checking if context is active
 */
import { CanActivate, ExecutionContext } from '@nestjs/common';
/**
 * Guard that ensures an active context exists
 * Throws ForbiddenException if no context is active
 */
export declare class ContextGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
//# sourceMappingURL=context.guard.d.ts.map