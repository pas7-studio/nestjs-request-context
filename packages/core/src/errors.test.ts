/**
 * Tests for custom error classes
 */

import { describe, it, expect } from 'vitest';
import * as errorsModule from './errors.js';
import { KeyExistsError } from './key-exists-error.js';
import { ContextKey } from './contracts.js';

// Debug: log all exports
console.log('[errors.test.ts] All exports from errors.ts:', Object.keys(errorsModule));
console.log('[errors.test.ts] KeyExistsError from errors.ts:', errorsModule.KeyExistsError);
console.log('[errors.test.ts] KeyExistsError from key-exists-error.ts:', KeyExistsError);

const { ContextNotActiveError, ContextKeyCollisionError, ContextMissingError } = errorsModule;

describe('ContextNotActiveError', () => {
  it('should create error with correct message', () => {
    const error = new ContextNotActiveError();
    expect(error.message).toBe(
      'No active context. Use run() to create a context before accessing it.'
    );
    expect(error.name).toBe('ContextNotActiveError');
  });

  it('should be instance of Error', () => {
    const error = new ContextNotActiveError();
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ContextNotActiveError);
  });

  it('should have correct prototype chain', () => {
    const error = new ContextNotActiveError();
    expect(Object.getPrototypeOf(error)).toBe(ContextNotActiveError.prototype);
  });
});

describe('ContextKeyCollisionError', () => {
  it('should create error with key in message', () => {
    const error = new ContextKeyCollisionError('test-key');
    expect(error.message).toBe(
      'Key "test-key" already exists in store and policy is set to \'deny\'.'
    );
    expect(error.name).toBe('ContextKeyCollisionError');
  });

  it('should be instance of Error', () => {
    const error = new ContextKeyCollisionError('test-key');
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ContextKeyCollisionError);
  });

  it('should have correct prototype chain', () => {
    const error = new ContextKeyCollisionError('test-key');
    expect(Object.getPrototypeOf(error)).toBe(ContextKeyCollisionError.prototype);
  });

  it('should handle different key names', () => {
    const error1 = new ContextKeyCollisionError('key1');
    const error2 = new ContextKeyCollisionError('another-key');
    expect(error1.message).toContain('key1');
    expect(error2.message).toContain('another-key');
  });
});

describe('ContextMissingError', () => {
  it('should create error with key in message', () => {
    const error = new ContextMissingError('test-key');
    expect(error.message).toBe('Required key "test-key" is missing from the context.');
    expect(error.name).toBe('ContextMissingError');
  });

  it('should be instance of Error', () => {
    const error = new ContextMissingError('test-key');
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ContextMissingError);
  });

  it('should have correct prototype chain', () => {
    const error = new ContextMissingError('test-key');
    expect(Object.getPrototypeOf(error)).toBe(ContextMissingError.prototype);
  });

  it('should handle different key names', () => {
    const error1 = new ContextMissingError('key1');
    const error2 = new ContextMissingError('another-key');
    expect(error1.message).toContain('key1');
    expect(error2.message).toContain('another-key');
  });
});

describe('KeyExistsError', () => {
  it('should import KeyExistsError correctly', () => {
    // Debug: check what is imported
    console.log('KeyExistsError:', KeyExistsError);
    console.log('typeof KeyExistsError:', typeof KeyExistsError);
    console.log('KeyExistsError.prototype:', KeyExistsError?.prototype);
    expect(KeyExistsError).toBeDefined();
    expect(typeof KeyExistsError).toBe('function');
  });

  it('should create error with key in message', () => {
    const error = new KeyExistsError('test-key');
    expect(error.message).toBe('Key "test-key" already exists in context');
    expect(error.name).toBe('KeyExistsError');
  });

  it('should create error with custom message', () => {
    const error = new KeyExistsError('test-key', 'Custom error message');
    expect(error.message).toBe('Custom error message');
    expect(error.name).toBe('KeyExistsError');
    expect(error.key).toBe('test-key');
  });

  it('should be instance of Error', () => {
    const error = new KeyExistsError('test-key');
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(KeyExistsError);
  });

  it('should have correct prototype chain', () => {
    const error = new KeyExistsError('test-key');
    expect(Object.getPrototypeOf(error)).toBe(KeyExistsError.prototype);
  });

  it('should expose key property', () => {
    const error = new KeyExistsError('my-key');
    expect(error.key).toBe('my-key');
  });

  it('should handle different key names', () => {
    const error1 = new KeyExistsError('key1');
    const error2 = new KeyExistsError('another-key');
    expect(error1.message).toContain('key1');
    expect(error2.message).toContain('another-key');
  });
});

// Error throwing tests are in api.test.ts to avoid circular imports