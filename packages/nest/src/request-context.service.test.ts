/**
 * Tests for RequestContextService
 */

import { ContextKey, run } from '@pas7/request-context-core';
import { RequestContextService } from './request-context.service.js';
import { REQUEST_ID_KEY, ROUTE_KEY, METHOD_KEY, IP_KEY } from './keys.js';

describe('RequestContextService', () => {
  const mockOptions = {
    mode: 'minimal' as const,
    header: 'x-request-id',
  };

  it('should create service with injected options', () => {
    // The service is instantiated with DI, but we can test the static methods
    expect(RequestContextService).toBeDefined();
  });

  describe('static methods', () => {
    let testKey: ContextKey<string>;

    beforeEach(() => {
      testKey = new ContextKey<string>('testKey');
    });

    describe('get', () => {
      it('should get value from active context', () => {
        run({ testKey: 'testValue' }, () => {
          const result = RequestContextService.get(testKey);
          expect(result).toBe('testValue');
        });
      });

      it('should return undefined when key not found', () => {
        run({}, () => {
          const result = RequestContextService.get(testKey);
          expect(result).toBeUndefined();
        });
      });
    });

    describe('set', () => {
      it('should set value in active context', () => {
        run({}, () => {
          RequestContextService.set(testKey, 'testValue');
          const result = RequestContextService.get(testKey);
          expect(result).toBe('testValue');
        });
      });
    });

    describe('has', () => {
      it('should return true when key exists', () => {
        run({ testKey: 'testValue' }, () => {
          const result = RequestContextService.has(testKey);
          expect(result).toBe(true);
        });
      });

      it('should return false when key does not exist', () => {
        run({}, () => {
          const result = RequestContextService.has(testKey);
          expect(result).toBe(false);
        });
      });
    });

    describe('require', () => {
      it('should return value when key exists', () => {
        run({ testKey: 'testValue' }, () => {
          const result = RequestContextService.require(testKey);
          expect(result).toBe('testValue');
        });
      });

      it('should throw error when key does not exist', () => {
        run({}, () => {
          expect(() => RequestContextService.require(testKey)).toThrow();
        });
      });
    });

    describe('getRequestId', () => {
      it('should get request ID from context', () => {
        run({ requestId: 'test-request-id' }, () => {
          const result = RequestContextService.getRequestId();
          expect(result).toBe('test-request-id');
        });
      });

      it('should return undefined when requestId not set', () => {
        run({}, () => {
          const result = RequestContextService.getRequestId();
          expect(result).toBeUndefined();
        });
      });
    });

    describe('getRoute', () => {
      it('should get route from context', () => {
        run({ route: '/test/route' }, () => {
          const result = RequestContextService.getRoute();
          expect(result).toBe('/test/route');
        });
      });

      it('should return undefined when route not set', () => {
        run({}, () => {
          const result = RequestContextService.getRoute();
          expect(result).toBeUndefined();
        });
      });
    });

    describe('getMethod', () => {
      it('should get method from context', () => {
        run({ method: 'GET' }, () => {
          const result = RequestContextService.getMethod();
          expect(result).toBe('GET');
        });
      });

      it('should return undefined when method not set', () => {
        run({}, () => {
          const result = RequestContextService.getMethod();
          expect(result).toBeUndefined();
        });
      });
    });
  });

  // ============================================
  // Type Safety Tests with Constants
  // ============================================

  describe('type safety with predefined keys', () => {
    describe('REQUEST_ID_KEY constant', () => {
      it('should work with REQUEST_ID_KEY constant', () => {
        run({ requestId: 'req-123' }, () => {
          const result = RequestContextService.get(REQUEST_ID_KEY);
          expect(result).toBe('req-123');
        });
      });

      it('should set value using REQUEST_ID_KEY constant', () => {
        run({}, () => {
          RequestContextService.set(REQUEST_ID_KEY, 'new-req-id');
          expect(RequestContextService.get(REQUEST_ID_KEY)).toBe('new-req-id');
        });
      });

      it('should check existence using REQUEST_ID_KEY constant', () => {
        run({ requestId: 'existing-id' }, () => {
          expect(RequestContextService.has(REQUEST_ID_KEY)).toBe(true);
        });
      });

      it('should require value using REQUEST_ID_KEY constant', () => {
        run({ requestId: 'required-id' }, () => {
          expect(RequestContextService.require(REQUEST_ID_KEY)).toBe('required-id');
        });
      });
    });

    describe('ROUTE_KEY constant', () => {
      it('should work with ROUTE_KEY constant', () => {
        run({ route: '/api/users' }, () => {
          const result = RequestContextService.get(ROUTE_KEY);
          expect(result).toBe('/api/users');
        });
      });

      it('should set value using ROUTE_KEY constant', () => {
        run({}, () => {
          RequestContextService.set(ROUTE_KEY, '/api/products');
          expect(RequestContextService.get(ROUTE_KEY)).toBe('/api/products');
        });
      });

      it('should check existence using ROUTE_KEY constant', () => {
        run({ route: '/test' }, () => {
          expect(RequestContextService.has(ROUTE_KEY)).toBe(true);
        });
      });
    });

    describe('METHOD_KEY constant', () => {
      it('should work with METHOD_KEY constant', () => {
        run({ method: 'POST' }, () => {
          const result = RequestContextService.get(METHOD_KEY);
          expect(result).toBe('POST');
        });
      });

      it('should set value using METHOD_KEY constant', () => {
        run({}, () => {
          RequestContextService.set(METHOD_KEY, 'DELETE');
          expect(RequestContextService.get(METHOD_KEY)).toBe('DELETE');
        });
      });

      it('should check existence using METHOD_KEY constant', () => {
        run({ method: 'PUT' }, () => {
          expect(RequestContextService.has(METHOD_KEY)).toBe(true);
        });
      });
    });

    describe('IP_KEY constant', () => {
      it('should work with IP_KEY constant', () => {
        run({ ip: '192.168.1.1' }, () => {
          const result = RequestContextService.get(IP_KEY);
          expect(result).toBe('192.168.1.1');
        });
      });

      it('should set value using IP_KEY constant', () => {
        run({}, () => {
          RequestContextService.set(IP_KEY, '10.0.0.1');
          expect(RequestContextService.get(IP_KEY)).toBe('10.0.0.1');
        });
      });

      it('should check existence using IP_KEY constant', () => {
        run({ ip: '127.0.0.1' }, () => {
          expect(RequestContextService.has(IP_KEY)).toBe(true);
        });
      });

      it('should return undefined when IP not set', () => {
        run({}, () => {
          expect(RequestContextService.get(IP_KEY)).toBeUndefined();
        });
      });
    });

    describe('multiple keys together', () => {
      it('should handle all predefined keys simultaneously', () => {
        run(
          {
            requestId: 'req-multi',
            route: '/api/test',
            method: 'GET',
            ip: '192.168.0.1',
          },
          () => {
            expect(RequestContextService.get(REQUEST_ID_KEY)).toBe('req-multi');
            expect(RequestContextService.get(ROUTE_KEY)).toBe('/api/test');
            expect(RequestContextService.get(METHOD_KEY)).toBe('GET');
            expect(RequestContextService.get(IP_KEY)).toBe('192.168.0.1');
          }
        );
      });

      it('should allow updating individual keys without affecting others', () => {
        run(
          {
            requestId: 'original-req',
            route: '/original',
          },
          () => {
            RequestContextService.set(ROUTE_KEY, '/updated');
            expect(RequestContextService.get(REQUEST_ID_KEY)).toBe('original-req');
            expect(RequestContextService.get(ROUTE_KEY)).toBe('/updated');
          }
        );
      });
    });
  });

  // ============================================
  // Type Safety with Custom Keys
  // ============================================

  describe('type safety with custom keys', () => {
    it('should work with custom string key', () => {
      const customKey = new ContextKey<string>('customStringKey');
      run({}, () => {
        RequestContextService.set(customKey, 'custom-value');
        expect(RequestContextService.get(customKey)).toBe('custom-value');
      });
    });

    it('should work with custom number key', () => {
      const numberKey = new ContextKey<number>('customNumberKey');
      run({}, () => {
        RequestContextService.set(numberKey, 42);
        expect(RequestContextService.get(numberKey)).toBe(42);
      });
    });

    it('should work with custom object key', () => {
      interface UserData {
        id: number;
        name: string;
      }
      const userKey = new ContextKey<UserData>('userData');
      const userData: UserData = { id: 1, name: 'Test User' };

      run({}, () => {
        RequestContextService.set(userKey, userData);
        expect(RequestContextService.get(userKey)).toEqual(userData);
      });
    });

    it('should work with custom array key', () => {
      const tagsKey = new ContextKey<string[]>('tags');
      const tags = ['tag1', 'tag2', 'tag3'];

      run({}, () => {
        RequestContextService.set(tagsKey, tags);
        expect(RequestContextService.get(tagsKey)).toEqual(tags);
      });
    });

    it('should work with nullable types', () => {
      const nullableKey = new ContextKey<string | null>('nullableValue');
      run({}, () => {
        RequestContextService.set(nullableKey, null);
        expect(RequestContextService.get(nullableKey)).toBeNull();
      });
    });
  });

  // ============================================
  // Edge Cases
  // ============================================

  describe('edge cases', () => {
    it('should handle empty string values', () => {
      const key = new ContextKey<string>('emptyString');
      run({}, () => {
        RequestContextService.set(key, '');
        expect(RequestContextService.get(key)).toBe('');
        expect(RequestContextService.has(key)).toBe(true);
      });
    });

    it('should handle false boolean values', () => {
      const key = new ContextKey<boolean>('falseBool');
      run({}, () => {
        RequestContextService.set(key, false);
        expect(RequestContextService.get(key)).toBe(false);
        expect(RequestContextService.has(key)).toBe(true);
      });
    });

    it('should handle zero number values', () => {
      const key = new ContextKey<number>('zeroNum');
      run({}, () => {
        RequestContextService.set(key, 0);
        expect(RequestContextService.get(key)).toBe(0);
        expect(RequestContextService.has(key)).toBe(true);
      });
    });

    it('should distinguish between undefined and null', () => {
      const key = new ContextKey<string | null>('testKey');
      run({}, () => {
        // Not set - should be undefined
        expect(RequestContextService.get(key)).toBeUndefined();
        expect(RequestContextService.has(key)).toBe(false);

        // Set to null - should be null, not undefined
        RequestContextService.set(key, null);
        expect(RequestContextService.get(key)).toBeNull();
        expect(RequestContextService.has(key)).toBe(true);
      });
    });
  });
});