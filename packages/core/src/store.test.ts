/**
 * Tests for Store
 */

import { describe, it, expect } from 'vitest';
import { Store, createEmptyStore } from './store.js';
import { KeyExistsError } from './key-exists-error.js';

describe('Store', () => {
  it('should create an empty store without prototype', () => {
    const store = createEmptyStore();
    expect(Object.getPrototypeOf(store)).toBeNull();
    expect(Object.keys(store)).toEqual([]);
  });

  it('should set and get values', () => {
    const store = new Store();
    store.set('key1', 'value1');
    expect(store.get<string>('key1')).toBe('value1');
  });

  it('should return undefined for non-existent keys', () => {
    const store = new Store();
    expect(store.get<string>('non-existent')).toBeUndefined();
  });

  it('should check if key exists', () => {
    const store = new Store();
    store.set('key1', 'value1');
    expect(store.has('key1')).toBe(true);
    expect(store.has('non-existent')).toBe(false);
  });

  it('should overwrite values with overwrite policy', () => {
    const store = new Store();
    store.set('key1', 'value1', 'overwrite');
    store.set('key1', 'value2', 'overwrite');
    expect(store.get<string>('key1')).toBe('value2');
  });

  it('should throw KeyExistsError with deny policy when key exists', () => {
    const store = new Store();
    store.set('key1', 'value1', 'overwrite');
    expect(() => {
      store.set('key1', 'value2', 'deny');
    }).toThrow(KeyExistsError);
  });

  it('should throw KeyExistsError with correct key property', () => {
    const store = new Store();
    store.set('key1', 'value1', 'overwrite');
    try {
      store.set('key1', 'value2', 'deny');
      expect.fail('Expected KeyExistsError to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(KeyExistsError);
      expect((error as KeyExistsError).key).toBe('key1');
    }
  });

  it('should ignore with ignore policy when key exists', () => {
    const store = new Store();
    store.set('key1', 'value1', 'overwrite');
    store.set('key1', 'value2', 'ignore');
    expect(store.get<string>('key1')).toBe('value1'); // Should still be value1
  });

  it('should merge data with default overwrite policy', () => {
    const store = new Store();
    store.set('key1', 'value1', 'overwrite');
    store.set('key2', 'value2', 'overwrite');
    store.merge({ key1: 'new-value1', key3: 'value3' });
    expect(store.get<string>('key1')).toBe('new-value1');
    expect(store.get<string>('key2')).toBe('value2');
    expect(store.get<string>('key3')).toBe('value3');
  });

  it('should throw KeyExistsError when merge with deny policy on existing key', () => {
    const store = new Store();
    store.set('key1', 'value1', 'overwrite');
    expect(() => {
      store.merge({ key1: 'new-value1', key2: 'value2' }, 'deny');
    }).toThrow(KeyExistsError);
  });

  it('should merge data with ignore policy', () => {
    const store = new Store();
    store.set('key1', 'value1', 'overwrite');
    store.merge({ key1: 'new-value1', key2: 'value2' }, 'ignore');
    expect(store.get<string>('key1')).toBe('value1'); // Should remain unchanged
    expect(store.get<string>('key2')).toBe('value2');
  });

  it('should store different types of values', () => {
    const store = new Store();
    store.set('string', 'value');
    store.set('number', 42);
    store.set('boolean', true);
    store.set('object', { nested: 'value' });
    store.set('array', [1, 2, 3]);

    expect(store.get<string>('string')).toBe('value');
    expect(store.get<number>('number')).toBe(42);
    expect(store.get<boolean>('boolean')).toBe(true);
    expect(store.get<object>('object')).toEqual({ nested: 'value' });
    expect(store.get<number[]>('array')).toEqual([1, 2, 3]);
  });

  it('should work with empty merge', () => {
    const store = new Store();
    store.set('key1', 'value1');
    store.merge({}, 'overwrite');
    expect(store.get<string>('key1')).toBe('value1');
  });

  it('should work with null and undefined values', () => {
    const store = new Store();
    store.set('null', null);
    store.set('undefined', undefined);

    expect(store.get<null>('null')).toBeNull();
    expect(store.get<undefined>('undefined')).toBeUndefined();
  });

  it('should get underlying store', () => {
    const store = new Store();
    store.set('key1', 'value1');
    const underlying = store.getStore();
    expect(underlying).not.toBeNull();
    expect(Object.getPrototypeOf(underlying)).toBeNull();
    expect(underlying.key1).toBe('value1');
  });
});
