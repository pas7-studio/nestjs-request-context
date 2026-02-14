import { describe, it, expect, vi } from 'vitest';
import {
  RequestContextAdapterOptions,
  DEFAULT_ADAPTER_OPTIONS,
  createRequestContextInterceptor,
} from './index';

describe('shared package exports', () => {
  describe('RequestContextAdapterOptions', () => {
    it('should be a valid interface type', () => {
      const options: RequestContextAdapterOptions = {
        header: 'x-custom-id',
        idGenerator: () => 'test-id',
        addResponseHeader: false,
      };

      expect(options.header).toBe('x-custom-id');
      expect(options.idGenerator?.()).toBe('test-id');
      expect(options.addResponseHeader).toBe(false);
    });

    it('should allow partial options', () => {
      const options: RequestContextAdapterOptions = {
        header: 'x-request-id',
      };

      expect(options.header).toBe('x-request-id');
      expect(options.idGenerator).toBeUndefined();
      expect(options.addResponseHeader).toBeUndefined();
    });

    it('should allow empty options', () => {
      const options: RequestContextAdapterOptions = {};

      expect(options.header).toBeUndefined();
      expect(options.idGenerator).toBeUndefined();
      expect(options.addResponseHeader).toBeUndefined();
    });
  });

  describe('DEFAULT_ADAPTER_OPTIONS', () => {
    it('should have correct default header', () => {
      expect(DEFAULT_ADAPTER_OPTIONS.header).toBe('x-request-id');
    });

    it('should have addResponseHeader enabled by default', () => {
      expect(DEFAULT_ADAPTER_OPTIONS.addResponseHeader).toBe(true);
    });

    it('should have a function for idGenerator', () => {
      expect(typeof DEFAULT_ADAPTER_OPTIONS.idGenerator).toBe('function');
    });

    it('should generate valid UUIDs', () => {
      const id = DEFAULT_ADAPTER_OPTIONS.idGenerator();
      // UUID regex pattern
      const uuidPattern =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      expect(uuidPattern.test(id)).toBe(true);
    });

    it('should generate unique IDs', () => {
      const ids = new Set<string>();
      for (let i = 0; i < 100; i++) {
        ids.add(DEFAULT_ADAPTER_OPTIONS.idGenerator());
      }
      expect(ids.size).toBe(100);
    });
  });

  describe('createRequestContextInterceptor', () => {
    it('should return a NestInterceptor class', () => {
      const InterceptorClass = createRequestContextInterceptor();
      expect(InterceptorClass).toBeDefined();
      expect(typeof InterceptorClass).toBe('function');
    });

    it('should return an instance that implements NestInterceptor', () => {
      const InterceptorClass = createRequestContextInterceptor();
      const interceptor = new InterceptorClass();

      expect(interceptor).toBeDefined();
      expect(interceptor).toHaveProperty('intercept');
      expect(typeof interceptor.intercept).toBe('function');
    });

    it('should create interceptor with default options', () => {
      const InterceptorClass = createRequestContextInterceptor();
      const interceptor = new InterceptorClass();

      expect(interceptor).toBeDefined();
      expect(interceptor).toHaveProperty('intercept');
    });

    it('should create interceptor with custom options', () => {
      const InterceptorClass = createRequestContextInterceptor({
        header: 'custom-header',
        idGenerator: () => 'custom-id',
      });
      const interceptor = new InterceptorClass();

      expect(interceptor).toBeDefined();
      expect(interceptor).toHaveProperty('intercept');
    });

    it('should create different interceptor classes for different options', () => {
      const InterceptorClass1 = createRequestContextInterceptor({ header: 'header-1' });
      const InterceptorClass2 = createRequestContextInterceptor({ header: 'header-2' });

      // Each call creates a new class
      expect(InterceptorClass1).not.toBe(InterceptorClass2);
    });

    it('should create new instances from same class', () => {
      const InterceptorClass = createRequestContextInterceptor();
      const interceptor1 = new InterceptorClass();
      const interceptor2 = new InterceptorClass();

      expect(interceptor1).not.toBe(interceptor2);
      expect(interceptor1).toBeInstanceOf(InterceptorClass);
      expect(interceptor2).toBeInstanceOf(InterceptorClass);
    });

    it('should return Observable from intercept method', () => {
      const InterceptorClass = createRequestContextInterceptor();
      const interceptor = new InterceptorClass();

      const mockRequest = {
        headers: { 'x-request-id': 'test-request-id-123' },
      };

      const mockExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      };

      const mockObservable = { toPromise: () => Promise.resolve('result') };
      const mockCallHandler = {
        handle: () => mockObservable,
      };

      const result = interceptor.intercept(
        mockExecutionContext as unknown as Parameters<typeof interceptor.intercept>[0],
        mockCallHandler as unknown as Parameters<typeof interceptor.intercept>[1]
      );

      // Should return the observable from handler
      expect(result).toBe(mockObservable);
    });

    it('should call next.handle() and return its result', async () => {
      const InterceptorClass = createRequestContextInterceptor();
      const interceptor = new InterceptorClass();

      const mockRequest = {
        headers: { 'x-request-id': 'test-request-id-123' },
      };

      const mockExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      };

      const mockResult = { toPromise: () => Promise.resolve('test-result') };
      const mockCallHandler = {
        handle: vi.fn(() => mockResult),
      };

      const result = interceptor.intercept(
        mockExecutionContext as unknown as Parameters<typeof interceptor.intercept>[0],
        mockCallHandler as unknown as Parameters<typeof interceptor.intercept>[1]
      );

      expect(mockCallHandler.handle).toHaveBeenCalled();
      expect(result).toBe(mockResult);
    });

    it('should work with custom header configuration', () => {
      const InterceptorClass = createRequestContextInterceptor({ header: 'x-custom-id' });
      const interceptor = new InterceptorClass();

      const mockRequest = {
        headers: { 'x-custom-id': 'custom-id-456' },
      };

      const mockExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      };

      const mockResult = { toPromise: () => Promise.resolve('result') };
      const mockCallHandler = {
        handle: () => mockResult,
      };

      const result = interceptor.intercept(
        mockExecutionContext as unknown as Parameters<typeof interceptor.intercept>[0],
        mockCallHandler as unknown as Parameters<typeof interceptor.intercept>[1]
      );

      expect(result).toBe(mockResult);
    });

    it('should work with custom idGenerator configuration', () => {
      const customId = 'generated-uuid-789';
      const InterceptorClass = createRequestContextInterceptor({
        idGenerator: () => customId,
      });
      const interceptor = new InterceptorClass();

      const mockRequest = {
        headers: {}, // No x-request-id header
      };

      const mockExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      };

      const mockResult = { toPromise: () => Promise.resolve('result') };
      const mockCallHandler = {
        handle: () => mockResult,
      };

      const result = interceptor.intercept(
        mockExecutionContext as unknown as Parameters<typeof interceptor.intercept>[0],
        mockCallHandler as unknown as Parameters<typeof interceptor.intercept>[1]
      );

      expect(result).toBe(mockResult);
    });

    it('should handle empty headers', () => {
      const InterceptorClass = createRequestContextInterceptor();
      const interceptor = new InterceptorClass();

      const mockRequest = {
        headers: {},
      };

      const mockExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      };

      const mockResult = { toPromise: () => Promise.resolve('result') };
      const mockCallHandler = {
        handle: () => mockResult,
      };

      const result = interceptor.intercept(
        mockExecutionContext as unknown as Parameters<typeof interceptor.intercept>[0],
        mockCallHandler as unknown as Parameters<typeof interceptor.intercept>[1]
      );

      expect(result).toBe(mockResult);
    });
  });
});
