/**
 * Tests for NestJS Express request context interceptor
 */

import { describe, it, expect } from 'vitest';
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
});
