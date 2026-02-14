/**
 * Tests for NestJS Express request context interceptor
 */

import { describe, it, expect, vi } from 'vitest';
import { UseRequestContextExpress } from './nest-interceptor.js';
import type { RequestContextExpressOptions } from './config.js';

describe('UseRequestContextExpress', () => {
  it('should return a NestInterceptor class', () => {
    const InterceptorClass = UseRequestContextExpress();
    expect(InterceptorClass).toBeDefined();
    expect(typeof InterceptorClass).toBe('function');
  });

  it('should return an instance that implements NestInterceptor', () => {
    const InterceptorClass = UseRequestContextExpress();
    const interceptor = new InterceptorClass();

    expect(interceptor).toBeDefined();
    expect(interceptor).toHaveProperty('intercept');
    expect(typeof interceptor.intercept).toBe('function');
  });

  it('should pass options to interceptor', () => {
    const options: RequestContextExpressOptions = {
      header: 'custom-header',
      addResponseHeader: false,
      idGenerator: () => 'custom-id',
    };

    const InterceptorClass = UseRequestContextExpress(options);
    const interceptor = new InterceptorClass();

    expect(interceptor).toBeDefined();
    expect(interceptor).toHaveProperty('intercept');
  });

  it('should create interceptor with default options', () => {
    const InterceptorClass = UseRequestContextExpress();
    const interceptor = new InterceptorClass();

    expect(interceptor).toBeDefined();
    expect(interceptor).toHaveProperty('intercept');
  });

  it('should create interceptor with partial options', () => {
    const options: RequestContextExpressOptions = {
      header: 'my-custom-header',
    };

    const InterceptorClass = UseRequestContextExpress(options);
    const interceptor = new InterceptorClass();

    expect(interceptor).toBeDefined();
    expect(interceptor).toHaveProperty('intercept');
  });

  it('should create different interceptor classes for different options', () => {
    const InterceptorClass1 = UseRequestContextExpress({ header: 'header-1' });
    const InterceptorClass2 = UseRequestContextExpress({ header: 'header-2' });

    // Each call creates a new class
    expect(InterceptorClass1).not.toBe(InterceptorClass2);
  });

  it('should create new instances from same class', () => {
    const InterceptorClass = UseRequestContextExpress();
    const interceptor1 = new InterceptorClass();
    const interceptor2 = new InterceptorClass();

    expect(interceptor1).not.toBe(interceptor2);
    expect(interceptor1).toBeInstanceOf(InterceptorClass);
    expect(interceptor2).toBeInstanceOf(InterceptorClass);
  });

  // ============================================
  // Interceptor Behavior Tests
  // ============================================

  it('should return Observable from intercept method', () => {
    const InterceptorClass = UseRequestContextExpress();
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
    const InterceptorClass = UseRequestContextExpress();
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
    const InterceptorClass = UseRequestContextExpress({ header: 'x-custom-id' });
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
    const InterceptorClass = UseRequestContextExpress({
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

  it('should handle requests with headers', () => {
    const InterceptorClass = UseRequestContextExpress();
    const interceptor = new InterceptorClass();

    const mockRequest = {
      headers: { 'x-request-id': 'header-value-priority' },
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
    const InterceptorClass = UseRequestContextExpress();
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
