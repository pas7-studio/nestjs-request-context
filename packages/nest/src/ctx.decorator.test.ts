/**
 * Tests for Ctx decorator
 */

import { Controller, Get } from '@nestjs/common';
import { run, Context, get } from '@pas7/request-context-core';
import { Ctx } from './ctx.decorator.js';
import { REQUEST_ID_KEY } from './keys.js';
import { ContextKey } from '@pas7/request-context-core';

describe('Ctx decorator', () => {
  it('should be defined', () => {
    expect(Ctx).toBeDefined();
  });

  describe('context access functionality', () => {
    describe('without key parameter', () => {
      it('should return entire store when no key is provided', () => {
        const testData = {
          requestId: 'test-id',
          route: '/test',
          method: 'GET',
        };

        const result = run(testData, () => {
          const currentContext = Context.current();
          if (!currentContext) {
            throw new Error('No active context found');
          }
          return currentContext._getStore().getStore() as Record<string, unknown>;
        });

        expect(result).toBeDefined();
        expect(result).toEqual(expect.objectContaining(testData));
      });
    });

    describe('with key parameter', () => {
      it('should return value for specific key when key is provided', () => {
        const result = run({ requestId: 'test-request-id' }, () => {
          return get(REQUEST_ID_KEY);
        });

        expect(result).toBe('test-request-id');
      });

      it('should work with custom ContextKey', () => {
        const customKey = new ContextKey<string>('customKey');

        const result = run({ customKey: 'custom-value' }, () => {
          return get(customKey);
        });

        expect(result).toBe('custom-value');
      });

      it('should return undefined when key not found', () => {
        const customKey = new ContextKey<string>('nonExistentKey');

        const result = run({}, () => {
          return get(customKey);
        });

        expect(result).toBeUndefined();
      });
    });

    describe('error handling', () => {
      it('should throw error when no active context', () => {
        expect(() => {
          get(REQUEST_ID_KEY);
        }).toThrow('No active context');
      });
    });
  });
});
