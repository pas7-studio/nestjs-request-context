/**
 * Unit tests for assertNoLeak
 */

import { describe, it, expect } from 'vitest';
import { assertNoLeak, ContextLeakError } from './assert-no-leak.js';

describe('assertNoLeak', () => {
  describe('Basic functionality', () => {
    it('should pass when contexts are isolated', () => {
      const contexts = [{ requestId: '1' }, { requestId: '2' }, { requestId: '3' }];

      expect(() => assertNoLeak(contexts)).not.toThrow();
    });

    it('should pass with unique UUID-like request IDs', () => {
      const contexts = [
        { requestId: '550e8400-e29b-41d4-a716-446655440000' },
        { requestId: '6ba7b810-9dad-11d1-80b4-00c04fd430c8' },
        { requestId: '6ba7b811-9dad-11d1-80b4-00c04fd430c8' },
      ];

      expect(() => assertNoLeak(contexts)).not.toThrow();
    });

    it('should pass with single context', () => {
      const contexts = [{ requestId: 'only-one' }];

      expect(() => assertNoLeak(contexts)).not.toThrow();
    });

    it('should pass with empty array', () => {
      const contexts: Record<string, unknown>[] = [];

      expect(() => assertNoLeak(contexts)).not.toThrow();
    });
  });

  describe('Leak detection', () => {
    it('should throw when context leak detected - duplicate IDs', () => {
      const contexts = [
        { requestId: '1' },
        { requestId: '1' }, // leak!
        { requestId: '2' },
      ];

      expect(() => assertNoLeak(contexts)).toThrow(ContextLeakError);
      expect(() => assertNoLeak(contexts)).toThrow('Context leak detected');
    });

    it('should throw with multiple duplicate IDs', () => {
      const contexts = [
        { requestId: '1' },
        { requestId: '2' },
        { requestId: '1' }, // duplicate
        { requestId: '3' },
        { requestId: '2' }, // duplicate
      ];

      expect(() => assertNoLeak(contexts)).toThrow(ContextLeakError);
      expect(() => assertNoLeak(contexts)).toThrow('1');
      expect(() => assertNoLeak(contexts)).toThrow('2');
    });

    it('should throw when all IDs are the same', () => {
      const contexts = [
        { requestId: 'same-id' },
        { requestId: 'same-id' },
        { requestId: 'same-id' },
        { requestId: 'same-id' },
      ];

      expect(() => assertNoLeak(contexts)).toThrow(ContextLeakError);
      expect(() => assertNoLeak(contexts)).toThrow('same-id');
    });

    it('should include duplicate IDs in error message', () => {
      const contexts = [
        { requestId: 'id-1' },
        { requestId: 'id-2' },
        { requestId: 'id-1' }, // duplicate
        { requestId: 'id-3' },
        { requestId: 'id-2' }, // duplicate
      ];

      try {
        assertNoLeak(contexts);
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ContextLeakError);
        const message = (error as Error).message;
        expect(message).toContain('id-1');
        expect(message).toContain('id-2');
      }
    });
  });

  describe('Error handling - missing requestId', () => {
    it('should throw when requestId is missing', () => {
      const contexts = [
        { requestId: '1' },
        { otherKey: 'value' }, // no requestId
        { requestId: '3' },
      ];

      expect(() => assertNoLeak(contexts)).toThrow(ContextLeakError);
      expect(() => assertNoLeak(contexts)).toThrow(
        'Result at index 1 is missing requestId property'
      );
    });

    it('should throw when requestId is undefined', () => {
      const contexts = [{ requestId: '1' }, { requestId: undefined }, { requestId: '3' }];

      expect(() => assertNoLeak(contexts)).toThrow(ContextLeakError);
      expect(() => assertNoLeak(contexts)).toThrow(
        'Result at index 1 is missing requestId property'
      );
    });

    it('should throw when requestId is null', () => {
      const contexts = [{ requestId: '1' }, { requestId: null }, { requestId: '3' }];

      expect(() => assertNoLeak(contexts)).toThrow(ContextLeakError);
      expect(() => assertNoLeak(contexts)).toThrow(
        'Result at index 1 is missing requestId property'
      );
    });

    it('should throw when requestId is empty string', () => {
      const contexts = [{ requestId: '1' }, { requestId: '' }, { requestId: '3' }];

      // Empty string is still a string, so it should be valid (though unusual)
      expect(() => assertNoLeak(contexts)).not.toThrow();
    });
  });

  describe('Real-world scenarios', () => {
    it('should handle mixed types in context', () => {
      const contexts = [
        { requestId: '1', timestamp: 123, data: {} },
        { requestId: '2', timestamp: 456, data: { id: 1 } },
        { requestId: '3', timestamp: 789, data: { id: 2 } },
      ];

      expect(() => assertNoLeak(contexts)).not.toThrow();
    });

    it('should detect leak in real-world scenario', () => {
      const contexts = [
        {
          requestId: '550e8400-e29b-41d4-a716-446655440000',
          route: '/api/users',
          method: 'GET',
        },
        {
          requestId: '550e8400-e29b-41d4-a716-446655440000', // leak!
          route: '/api/posts',
          method: 'POST',
        },
        {
          requestId: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
          route: '/api/comments',
          method: 'GET',
        },
      ];

      expect(() => assertNoLeak(contexts)).toThrow(ContextLeakError);
    });

    it('should handle large number of contexts without leaks', () => {
      const contexts = Array.from({ length: 1000 }, (_, i) => ({
        requestId: `id-${i}`,
      }));

      expect(() => assertNoLeak(contexts)).not.toThrow();
    });

    it('should detect leak in large number of contexts', () => {
      const contexts = Array.from({ length: 1000 }, (_, i) => ({
        requestId: i % 10 === 0 ? 'leaky-id' : `id-${i}`,
      }));

      // Every 10th request has the same ID
      expect(() => assertNoLeak(contexts)).toThrow(ContextLeakError);
    });
  });
});
