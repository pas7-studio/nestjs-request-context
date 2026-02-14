/**
 * Tests for API functions (run, get, set, has, require, merge, snapshot, restore)
 */

import { describe, it, expect } from 'vitest';
import { run, get, set, has, require, merge, snapshot, restore } from './api.js';
import { ContextKey } from './contracts.js';
import { ContextNotActiveError, ContextKeyCollisionError, ContextMissingError } from './errors.js';

describe('run', () => {
  it('should execute function within context', () => {
    const result = run({ test: 'value' }, () => {
      return get(new ContextKey<string>('test'));
    });
    expect(result).toBe('value');
  });

  it('should execute function and return result', () => {
    const result = run({}, () => {
      return 42;
    });
    expect(result).toBe(42);
  });

  it('should clean up context after execution', () => {
    let result: string | undefined;
    run({ test: 'value' }, () => {
      result = get(new ContextKey<string>('test'));
    });
    expect(result).toBe('value');

    // After run, context should be cleaned up
    expect(() => {
      get(new ContextKey<string>('test'));
    }).toThrow(ContextNotActiveError);
  });

  it('should handle nested runs - inner should be isolated', () => {
    const outerKey = new ContextKey<string>('outer');
    const innerKey = new ContextKey<string>('inner');

    const result = run({ [outerKey.name]: 'outer-value' }, () => {
      const outerValue = get(outerKey);

      const innerResult = run({ [innerKey.name]: 'inner-value' }, () => {
        return {
          outer: get(outerKey),
          inner: get(innerKey),
        };
      });

      // After inner run, we should be back to outer context
      const outerAfterInner = get(outerKey);
      const innerAfterInner = get(innerKey);

      return {
        outerValue,
        outerAfterInner,
        innerAfterInner,
        innerResult,
      };
    });

    expect(result.outerValue).toBe('outer-value');
    expect(result.outerAfterInner).toBe('outer-value');
    expect(result.innerAfterInner).toBeUndefined();
    expect(result.innerResult.outer).toBeUndefined();
    expect(result.innerResult.inner).toBe('inner-value');
  });

  it('should handle nested runs - modifications to inner should not affect outer', () => {
    const key = new ContextKey<string>('test');

    const result = run({ [key.name]: 'initial' }, () => {
      const initial = get(key);

      run({}, () => {
        set(key, 'modified');
      });

      const afterInner = get(key);
      return { initial, afterInner };
    });

    expect(result.initial).toBe('initial');
    expect(result.afterInner).toBe('initial');
  });

  it('should handle parallel runs - each should have its own context', async () => {
    const key = new ContextKey<string>('test');

    const promise1 = new Promise((resolve) => {
      setTimeout(() => {
        const result = run({ [key.name]: 'value1' }, () => {
          return get(key);
        });
        resolve(result);
      }, 10);
    });

    const promise2 = new Promise((resolve) => {
      setTimeout(() => {
        const result = run({ [key.name]: 'value2' }, () => {
          return get(key);
        });
        resolve(result);
      }, 5);
    });

    const results = await Promise.all([promise1, promise2]);
    expect(results[0]).toBe('value1');
    expect(results[1]).toBe('value2');
  });
});

describe('get', () => {
  it('should get value from context', () => {
    run({ test: 'value' }, () => {
      const value = get(new ContextKey<string>('test'));
      expect(value).toBe('value');
    });
  });

  it('should return undefined for missing key', () => {
    run({}, () => {
      const value = get(new ContextKey<string>('non-existent'));
      expect(value).toBeUndefined();
    });
  });

  it('should throw ContextNotActiveError outside of run', () => {
    expect(() => {
      get(new ContextKey<string>('test'));
    }).toThrow(ContextNotActiveError);
  });
});

describe('set', () => {
  it('should set value in context', () => {
    run({}, () => {
      const key = new ContextKey<string>('test');
      set(key, 'value');
      expect(get(key)).toBe('value');
    });
  });

  it('should overwrite existing value by default', () => {
    run({ test: 'initial' }, () => {
      const key = new ContextKey<string>('test');
      set(key, 'updated');
      expect(get(key)).toBe('updated');
    });
  });

  it('should throw ContextNotActiveError outside of run', () => {
    expect(() => {
      set(new ContextKey<string>('test'), 'value');
    }).toThrow(ContextNotActiveError);
  });

  it('should throw ContextKeyCollisionError with deny policy', () => {
    run({ test: 'initial' }, () => {
      const key = new ContextKey<string>('test');
      expect(() => {
        set(key, 'updated', 'deny');
      }).toThrow(ContextKeyCollisionError);
    });
  });

  it('should ignore existing value with ignore policy', () => {
    run({ test: 'initial' }, () => {
      const key = new ContextKey<string>('test');
      set(key, 'updated', 'ignore');
      expect(get(key)).toBe('initial');
    });
  });
});

describe('has', () => {
  it('should return true for existing key', () => {
    run({ test: 'value' }, () => {
      const exists = has(new ContextKey<string>('test'));
      expect(exists).toBe(true);
    });
  });

  it('should return false for missing key', () => {
    run({}, () => {
      const exists = has(new ContextKey<string>('non-existent'));
      expect(exists).toBe(false);
    });
  });

  it('should throw ContextNotActiveError outside of run', () => {
    expect(() => {
      has(new ContextKey<string>('test'));
    }).toThrow(ContextNotActiveError);
  });
});

describe('require', () => {
  it('should return value for existing key', () => {
    run({ test: 'value' }, () => {
      const value = require(new ContextKey<string>('test'));
      expect(value).toBe('value');
    });
  });

  it('should throw ContextMissingError for missing key', () => {
    run({}, () => {
      expect(() => {
        require(new ContextKey<string>('non-existent'));
      }).toThrow(ContextMissingError);
    });
  });

  it('should throw ContextNotActiveError outside of run', () => {
    expect(() => {
      require(new ContextKey<string>('test'));
    }).toThrow(ContextNotActiveError);
  });
});

describe('merge', () => {
  it('should merge data into context', () => {
    run({ key1: 'value1' }, () => {
      merge({ key2: 'value2', key3: 'value3' });
      expect(get(new ContextKey<string>('key1'))).toBe('value1');
      expect(get(new ContextKey<string>('key2'))).toBe('value2');
      expect(get(new ContextKey<string>('key3'))).toBe('value3');
    });
  });

  it('should overwrite existing keys by default', () => {
    run({ key1: 'value1' }, () => {
      merge({ key1: 'new-value1', key2: 'value2' });
      expect(get(new ContextKey<string>('key1'))).toBe('new-value1');
    });
  });

  it('should throw ContextNotActiveError outside of run', () => {
    expect(() => {
      merge({ key: 'value' });
    }).toThrow(ContextNotActiveError);
  });

  it('should ignore existing keys with ignore policy', () => {
    run({ key1: 'value1' }, () => {
      merge({ key1: 'new-value1', key2: 'value2' }, 'ignore');
      expect(get(new ContextKey<string>('key1'))).toBe('value1');
      expect(get(new ContextKey<string>('key2'))).toBe('value2');
    });
  });

  it('should throw ContextKeyCollisionError with deny policy on existing keys', () => {
    run({ key1: 'value1' }, () => {
      expect(() => {
        merge({ key1: 'new-value1', key2: 'value2' }, 'deny');
      }).toThrow(ContextKeyCollisionError);
    });
  });
});

describe('snapshot', () => {
  it('should create snapshot of current context', () => {
    run({ key1: 'value1', key2: 'value2' }, () => {
      const snap = snapshot();
      expect(snap.store.key1).toBe('value1');
      expect(snap.store.key2).toBe('value2');
    });
  });

  it('should create independent snapshot', () => {
    run({ key1: 'value1' }, () => {
      const snap = snapshot();
      set(new ContextKey<string>('key1'), 'new-value');
      expect(snap.store.key1).toBe('value1');
    });
  });

  it('should throw ContextNotActiveError outside of run', () => {
    expect(() => {
      snapshot();
    }).toThrow(ContextNotActiveError);
  });
});

describe('restore', () => {
  it('should restore context from snapshot', () => {
    run({ key1: 'value1', key2: 'value2' }, () => {
      const snap = snapshot();

      // Modify context
      set(new ContextKey<string>('key1'), 'new-value1');
      set(new ContextKey<string>('key3'), 'value3');

      // Restore
      restore(snap);

      expect(get(new ContextKey<string>('key1'))).toBe('value1');
      expect(get(new ContextKey<string>('key2'))).toBe('value2');
      expect(get(new ContextKey<string>('key3'))).toBeUndefined();
    });
  });

  it('should throw ContextNotActiveError outside of run', () => {
    expect(() => {
      restore({ store: {} });
    }).toThrow(ContextNotActiveError);
  });
});

describe('API integration', () => {
  it('should work with async functions', async () => {
    const result = await run({ test: 'value' }, async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
      return get(new ContextKey<string>('test'));
    });
    expect(result).toBe('value');
  });

  it('should work with multiple ContextKeys', () => {
    const stringKey = new ContextKey<string>('string-key');
    const numberKey = new ContextKey<number>('number-key');
    const booleanKey = new ContextKey<boolean>('boolean-key');

    run({}, () => {
      set(stringKey, 'test-string');
      set(numberKey, 42);
      set(booleanKey, true);

      expect(get(stringKey)).toBe('test-string');
      expect(get(numberKey)).toBe(42);
      expect(get(booleanKey)).toBe(true);
      expect(require(stringKey)).toBe('test-string');
      expect(require(numberKey)).toBe(42);
    });
  });

  it('should handle snapshot and restore with API functions', () => {
    run({ key1: 'value1', key2: 'value2' }, () => {
      const snap = snapshot();

      // Modify context
      set(new ContextKey<string>('key1'), 'new-value1');
      set(new ContextKey<string>('key3'), 'value3');

      // Restore
      restore(snap);

      expect(get(new ContextKey<string>('key1'))).toBe('value1');
      expect(get(new ContextKey<string>('key2'))).toBe('value2');
      expect(get(new ContextKey<string>('key3'))).toBeUndefined();
    });
  });
});
