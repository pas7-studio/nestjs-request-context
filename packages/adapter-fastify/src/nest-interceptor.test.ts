/**
 * Tests for UseRequestContextFastify interceptor
 */

import { describe, it, expect } from 'vitest';
import { UseRequestContextFastify } from './nest-interceptor.js';
import type { RequestContextFastifyOptions } from './config.js';

describe('UseRequestContextFastify', () => {
  it('should return NestInterceptor', () => {
    const InterceptorClass = UseRequestContextFastify();
    const interceptor = new InterceptorClass();

    expect(interceptor).toBeDefined();
    expect(interceptor).toHaveProperty('intercept');
    expect(typeof interceptor.intercept).toBe('function');
  });

  it('should pass options to plugin', () => {
    const options: RequestContextFastifyOptions = {
      header: 'custom-header',
      addResponseHeader: false,
    };

    const InterceptorClass = UseRequestContextFastify(options);
    const interceptor = new InterceptorClass();

    expect(interceptor).toBeDefined();
  });

  it('should work with empty options', () => {
    const InterceptorClass = UseRequestContextFastify({});
    const interceptor = new InterceptorClass();

    expect(interceptor).toBeDefined();
  });

  it('should create different interceptor instances', () => {
    const InterceptorClass1 = UseRequestContextFastify({ header: 'header1' });
    const InterceptorClass2 = UseRequestContextFastify({ header: 'header2' });

    const interceptor1 = new InterceptorClass1();
    const interceptor2 = new InterceptorClass2();

    expect(interceptor1).toBeDefined();
    expect(interceptor2).toBeDefined();
    expect(interceptor1).not.toBe(interceptor2);
  });

  it('should accept custom idGenerator', () => {
    const customGenerator = () => 'custom-id-123';
    const options: RequestContextFastifyOptions = {
      idGenerator: customGenerator,
    };

    const InterceptorClass = UseRequestContextFastify(options);
    const interceptor = new InterceptorClass();

    expect(interceptor).toBeDefined();
  });

  it('should accept all options', () => {
    const options: RequestContextFastifyOptions = {
      header: 'x-trace-id',
      idGenerator: () => 'generated',
      addResponseHeader: false,
    };

    const InterceptorClass = UseRequestContextFastify(options);
    const interceptor = new InterceptorClass();

    expect(interceptor).toBeDefined();
  });
});
