/**
 * Guard for checking if context is active
 */

import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Context } from '@pas7/request-context-core';

/**
 * Guard that ensures an active context exists
 * Throws ForbiddenException if no context is active
 */
@Injectable()
export class ContextGuard implements CanActivate {
  canActivate(_context: ExecutionContext): boolean {
    const currentContext = Context.current();

    if (!currentContext) {
      throw new ForbiddenException('No active context found');
    }

    return true;
  }
}
