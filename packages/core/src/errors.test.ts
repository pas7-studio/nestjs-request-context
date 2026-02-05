/**
 * Tests for custom error classes
 */

import { describe, it, expect } from 'vitest';
import { ContextNotActiveError, ContextKeyCollisionError, ContextMissingError } from './errors.js';
import { run, get, set, require } from './api.js';
import { ContextKey } from './contracts.js';

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

describe('Error throwing in API', () => {
  it('ContextNotActiveError should be thrown outside run', () => {
    expect(() => {
      get(new ContextKey<string>('test'));
    }).toThrow(ContextNotActiveError);
  });

  it('ContextKeyCollisionError should be thrown with deny policy', () => {
    run({ test: 'value' }, () => {
      expect(() => {
        set(new ContextKey<string>('test'), 'new-value', 'deny');
      }).toThrow(ContextKeyCollisionError);
    });
  });

  it('ContextMissingError should be thrown for require with missing key', () => {
    run({}, () => {
      expect(() => {
        require(new ContextKey<string>('missing-key'));
      }).toThrow(ContextMissingError);
    });
  });

  it('Error instances should have correct stack traces', () => {
    try {
      run({}, () => {
        require(new ContextKey<string>('missing-key'));
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ContextMissingError);
      expect(error).toHaveProperty('stack');
    }
  });
});
