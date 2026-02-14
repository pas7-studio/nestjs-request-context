/**
 * Tests for Context
 */

import { describe, it, expect } from 'vitest';
import { Context } from './context.js';
import { ContextKey } from './contracts.js';
import { ContextMissingError } from './errors.js';

describe('Context', () => {
  it('should create a context with initial data', () => {
    const context = Context.create({ key1: 'value1', key2: 'value2' });
    expect(context.get(new ContextKey<string>('key1'))).toBe('value1');
    expect(context.get(new ContextKey<string>('key2'))).toBe('value2');
  });

  it('should create a context with empty initial data', () => {
    const context = Context.create();
    const key = new ContextKey<string>('test');
    expect(context.get(key)).toBeUndefined();
  });

  it('should return current context within run scope', () => {
    const context = Context.create({ test: 'value' });
    const result = context.run(() => {
      const current = Context.current();
      expect(current).toBeDefined();
      expect(current).toBe(context);
      return 'result';
    });
    expect(result).toBe('result');
  });

  it('should return undefined for current outside of run scope', () => {
    const current = Context.current();
    expect(current).toBeUndefined();
  });

  it('should set and get values', () => {
    const context = Context.create();
    const key = new ContextKey<string>('test-key');
    context.set(key, 'test-value');
    expect(context.get(key)).toBe('test-value');
  });

  it('should check if key exists', () => {
    const context = Context.create();
    const key = new ContextKey<string>('test-key');
    expect(context.has(key)).toBe(false);
    context.set(key, 'test-value');
    expect(context.has(key)).toBe(true);
  });

  it('should require throws error for missing key', () => {
    const context = Context.create();
    const key = new ContextKey<string>('test-key');
    expect(() => {
      context.require(key);
    }).toThrow(ContextMissingError);
  });

  it('should require returns value for existing key', () => {
    const context = Context.create();
    const key = new ContextKey<string>('test-key');
    context.set(key, 'test-value');
    expect(context.require(key)).toBe('test-value');
  });

  it('should merge data', () => {
    const context = Context.create({ key1: 'value1' });
    context.merge({ key2: 'value2', key3: 'value3' });
    expect(context.get(new ContextKey<string>('key1'))).toBe('value1');
    expect(context.get(new ContextKey<string>('key2'))).toBe('value2');
    expect(context.get(new ContextKey<string>('key3'))).toBe('value3');
  });

  it('should merge data with deny policy', () => {
    const context = Context.create({ key1: 'value1' });
    expect(() => {
      context.merge({ key1: 'new-value1', key2: 'value2' }, 'deny');
    }).toThrow('already exists in context');
  });

  it('should merge data with ignore policy', () => {
    const context = Context.create({ key1: 'value1' });
    context.merge({ key1: 'new-value1', key2: 'value2' }, 'ignore');
    expect(context.get(new ContextKey<string>('key1'))).toBe('value1');
    expect(context.get(new ContextKey<string>('key2'))).toBe('value2');
  });

  it('should create and restore snapshot', () => {
    const context = Context.create({ key1: 'value1', key2: 'value2' });
    const snapshot = context.snapshot();

    // Modify context
    context.set(new ContextKey<string>('key1'), 'new-value1');
    context.set(new ContextKey<string>('key3'), 'value3');

    // Restore snapshot
    context.restore(snapshot);

    expect(context.get(new ContextKey<string>('key1'))).toBe('value1');
    expect(context.get(new ContextKey<string>('key2'))).toBe('value2');
    expect(context.get(new ContextKey<string>('key3'))).toBeUndefined();
  });

  it('should run function within context', () => {
    const context = Context.create({ test: 'value' });
    const result = context.run(() => {
      const current = Context.current();
      return current?.get(new ContextKey<string>('test'));
    });
    expect(result).toBe('value');
  });

  it('should work with typed ContextKey', () => {
    const context = Context.create();

    const stringKey = new ContextKey<string>('string-key');
    const numberKey = new ContextKey<number>('number-key');
    const booleanKey = new ContextKey<boolean>('boolean-key');
    const objectKey = new ContextKey<{ nested: string }>('object-key');

    context.set(stringKey, 'test-string');
    context.set(numberKey, 42);
    context.set(booleanKey, true);
    context.set(objectKey, { nested: 'nested-value' });

    expect(context.get(stringKey)).toBe('test-string');
    expect(context.get(numberKey)).toBe(42);
    expect(context.get(booleanKey)).toBe(true);
    expect(context.get(objectKey)).toEqual({ nested: 'nested-value' });

    expect(context.require(stringKey)).toBe('test-string');
    expect(context.require(numberKey)).toBe(42);
  });

  it('should work with nested runs', () => {
    const outerContext = Context.create({ outer: 'outer-value' });
    const innerContext = Context.create({ inner: 'inner-value' });

    const result = outerContext.run(() => {
      const outerValue = Context.current()?.get(new ContextKey<string>('outer'));

      const innerResult = innerContext.run(() => {
        const innerValue = Context.current()?.get(new ContextKey<string>('inner'));
        // Check that outer key is NOT available in inner context (isolation)
        const outerInInner = Context.current()?.get(new ContextKey<string>('outer'));
        return { innerValue, outerInInner };
      });

      // After inner run, we should be back to outer context
      const currentAfterInner = Context.current()?.get(new ContextKey<string>('outer'));
      return { outerValue, currentAfterInner, innerResult };
    });

    expect(result.outerValue).toBe('outer-value');
    expect(result.currentAfterInner).toBe('outer-value');
    expect(result.innerResult.innerValue).toBe('inner-value');
    expect(result.innerResult.outerInInner).toBeUndefined();
  });

  it('should handle set with overwrite policy', () => {
    const context = Context.create();
    const key = new ContextKey<string>('test-key');
    context.set(key, 'value1', 'overwrite');
    context.set(key, 'value2', 'overwrite');
    expect(context.get(key)).toBe('value2');
  });

  it('should handle set with ignore policy', () => {
    const context = Context.create();
    const key = new ContextKey<string>('test-key');
    context.set(key, 'value1', 'overwrite');
    context.set(key, 'value2', 'ignore');
    expect(context.get(key)).toBe('value1');
  });

  it('should handle set with deny policy', () => {
    const context = Context.create();
    const key = new ContextKey<string>('test-key');
    context.set(key, 'value1', 'overwrite');
    expect(() => {
      context.set(key, 'value2', 'deny');
    }).toThrow('already exists in context');
  });

  // ============================================
  // Snapshot Tests
  // ============================================

  it('snapshot() should return a copy of the store', () => {
    const context = Context.create({ key1: 'value1', key2: 'value2' });
    const snapshot = context.snapshot();

    expect(snapshot.store).toBeDefined();
    expect(snapshot.store.key1).toBe('value1');
    expect(snapshot.store.key2).toBe('value2');
  });

  it('restore() should restore context from snapshot', () => {
    const context = Context.create({ key1: 'original' });
    const snapshot = context.snapshot();

    context.set(new ContextKey<string>('key1'), 'modified');
    expect(context.get(new ContextKey<string>('key1'))).toBe('modified');

    context.restore(snapshot);
    expect(context.get(new ContextKey<string>('key1'))).toBe('original');
  });

  it('restore() should remove keys added after snapshot', () => {
    const context = Context.create({ key1: 'value1' });
    const snapshot = context.snapshot();

    context.set(new ContextKey<string>('key2'), 'value2');
    expect(context.has(new ContextKey<string>('key2'))).toBe(true);

    context.restore(snapshot);
    expect(context.has(new ContextKey<string>('key2'))).toBe(false);
  });

  // ============================================
  // Edge Cases
  // ============================================

  it('should handle empty snapshot restore', () => {
    const context = Context.create({ key1: 'value1' });
    const emptySnapshot = context.snapshot();

    context.set(new ContextKey<string>('key2'), 'value2');
    context.restore(emptySnapshot);

    expect(context.get(new ContextKey<string>('key1'))).toBe('value1');
  });

  it('should handle multiple snapshot/restore cycles', () => {
    const context = Context.create({ count: 0 });

    const snap1 = context.snapshot();
    context.set(new ContextKey<number>('count'), 1);

    const snap2 = context.snapshot();
    context.set(new ContextKey<number>('count'), 2);

    context.restore(snap1);
    expect(context.get(new ContextKey<number>('count'))).toBe(0);

    context.restore(snap2);
    expect(context.get(new ContextKey<number>('count'))).toBe(1);
  });

  it('should handle deeply nested initial data', () => {
    const nestedData = {
      level1: {
        level2: {
          level3: {
            value: 'deep',
          },
        },
      },
    };
    const context = Context.create({ nested: nestedData });

    const result = context.get(new ContextKey<typeof nestedData>('nested'));
    expect(result).toEqual(nestedData);
  });
});
