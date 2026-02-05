/**
 * Tests for ContextGuard
 */

import type { ExecutionContext } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';
import { run } from '@pas7/request-context-core';
import { ContextGuard } from './context.guard.js';

describe('ContextGuard', () => {
  let guard: ContextGuard;

  beforeEach(() => {
    guard = new ContextGuard();
  });

  const createMockExecutionContext = (): ExecutionContext => {
    return {} as ExecutionContext;
  };

  describe('canActivate', () => {
    it('should return true when context is active', () => {
      let result: boolean | undefined;

      run({ requestId: 'test-id' }, () => {
        const context = createMockExecutionContext();
        result = guard.canActivate(context);
      });

      expect(result).toBe(true);
    });

    it('should throw ForbiddenException when context is not active', () => {
      const context = createMockExecutionContext();

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(context)).toThrow('No active context found');
    });
  });
});
