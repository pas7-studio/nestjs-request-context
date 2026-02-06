/**
 * Tests for RequestContextService
 */

import { ContextKey, run } from '@pas7/request-context-core';
import { RequestContextService } from './request-context.service.js';

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
});