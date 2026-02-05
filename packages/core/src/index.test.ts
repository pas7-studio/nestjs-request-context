/**
 * Tests for core package public API
 */

import { describe, it, expect } from 'vitest';
import {
  ContextKey,
  SetPolicy,
  run,
  get,
  set,
  has,
  require,
  merge,
  snapshot,
  restore,
  ContextNotActiveError,
  ContextKeyCollisionError,
  ContextMissingError,
  Context,
} from './index.js';

describe('Core Package Public API', () => {
  it('should export ContextKey', () => {
    expect(ContextKey).toBeDefined();
    const key = new ContextKey<string>('test');
    expect(key.name).toBe('test');
  });

  // Note: SetPolicy is a type, not a value, so it cannot be tested at runtime
  // TypeScript will validate types at compile time

  it('should export run function', () => {
    expect(run).toBeDefined();
    expect(typeof run).toBe('function');
  });

  it('should export get function', () => {
    expect(get).toBeDefined();
    expect(typeof get).toBe('function');
  });

  it('should export set function', () => {
    expect(set).toBeDefined();
    expect(typeof set).toBe('function');
  });

  it('should export has function', () => {
    expect(has).toBeDefined();
    expect(typeof has).toBe('function');
  });

  it('should export require function', () => {
    expect(require).toBeDefined();
    expect(typeof require).toBe('function');
  });

  it('should export merge function', () => {
    expect(merge).toBeDefined();
    expect(typeof merge).toBe('function');
  });

  it('should export snapshot function', () => {
    expect(snapshot).toBeDefined();
    expect(typeof snapshot).toBe('function');
  });

  it('should export restore function', () => {
    expect(restore).toBeDefined();
    expect(typeof restore).toBe('function');
  });

  it('should export Context class', () => {
    expect(Context).toBeDefined();
    const context = Context.create({ test: 'value' });
    expect(context).toBeDefined();
  });

  it('should export error classes', () => {
    expect(ContextNotActiveError).toBeDefined();
    expect(ContextKeyCollisionError).toBeDefined();
    expect(ContextMissingError).toBeDefined();
  });

  it('should work with public API end-to-end', () => {
    const result = run({ key1: 'value1' }, () => {
      const key = new ContextKey<string>('key1');
      expect(get(key)).toBe('value1');
      expect(has(key)).toBe(true);

      set(new ContextKey<string>('key2'), 'value2');
      merge({ key3: 'value3' });

      expect(get(new ContextKey<string>('key2'))).toBe('value2');
      expect(get(new ContextKey<string>('key3'))).toBe('value3');

      const snap = snapshot();
      restore(snap);

      return require(key);
    });

    expect(result).toBe('value1');
  });

  it('should throw correct errors from public API', () => {
    expect(() => {
      get(new ContextKey<string>('test'));
    }).toThrow(ContextNotActiveError);
  });
});
