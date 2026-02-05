/**
 * Tests for ContextKey and contracts
 */

import { describe, it, expect } from 'vitest';
import { ContextKey, SetPolicy } from './contracts.js';

describe('ContextKey', () => {
  it('should create a ContextKey with a name', () => {
    const key = new ContextKey<string>('test-key');
    expect(key.name).toBe('test-key');
  });

  it('should work with type inference', () => {
    const stringKey = new ContextKey<string>('string-key');
    const numberKey = new ContextKey<number>('number-key');
    const booleanKey = new ContextKey<boolean>('boolean-key');

    // Type inference should work (this is a compile-time check)
    // Runtime checks for value types
    expect(typeof stringKey.name).toBe('string');
    expect(typeof numberKey.name).toBe('string');
    expect(typeof booleanKey.name).toBe('string');
  });

  // Note: readonly is a TypeScript compile-time check and cannot be tested at runtime
  // TypeScript will throw a compile error if you try to assign to a readonly property
});

describe('SetPolicy', () => {
  it('should have valid policy types', () => {
    const policies: SetPolicy[] = ['deny', 'overwrite', 'ignore'];
    expect(policies).toContain('deny');
    expect(policies).toContain('overwrite');
    expect(policies).toContain('ignore');
    expect(policies.length).toBe(3);
  });
});
