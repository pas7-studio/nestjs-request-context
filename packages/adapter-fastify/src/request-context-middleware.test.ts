/**
 * Tests for NestJS request context middleware
 */

import { describe, it, expect } from 'vitest';
import { get } from '@pas7/request-context-core';
import { REQUEST_ID_KEY } from '@pas7/nestjs-request-context';
import { requestContextMiddleware } from './request-context-middleware.js';

describe('requestContextMiddleware (NestJS)', () => {
  it('should create middleware class', () => {
    const MiddlewareClass = requestContextMiddleware();
    expect(MiddlewareClass).toBeDefined();
    expect(typeof MiddlewareClass).toBe('function');
  });

  it('should create middleware instance', () => {
    const MiddlewareClass = requestContextMiddleware();
    const middleware = new MiddlewareClass();
    expect(middleware).toBeDefined();
    expect(middleware).toHaveProperty('use');
    expect(typeof middleware.use).toBe('function');
  });

  it('should create different middleware instances with different options', () => {
    const MiddlewareClass1 = requestContextMiddleware({ header: 'header1' });
    const MiddlewareClass2 = requestContextMiddleware({ header: 'header2' });

    const middleware1 = new MiddlewareClass1();
    const middleware2 = new MiddlewareClass2();

    expect(middleware1).toBeDefined();
    expect(middleware2).toBeDefined();
    expect(middleware1).not.toBe(middleware2);
  });

  it('should accept custom idGenerator', () => {
    const customGenerator = () => 'custom-id-123';
    const options = {
      idGenerator: customGenerator,
    };

    const MiddlewareClass = requestContextMiddleware(options);
    const middleware = new MiddlewareClass();

    expect(middleware).toBeDefined();
  });

  it('should accept addResponseHeader option', () => {
    const options = {
      addResponseHeader: false,
    };

    const MiddlewareClass = requestContextMiddleware(options);
    const middleware = new MiddlewareClass();

    expect(middleware).toBeDefined();
  });

  it('should accept custom header option', () => {
    const options = {
      header: 'x-custom-request-id',
    };

    const MiddlewareClass = requestContextMiddleware(options);
    const middleware = new MiddlewareClass();

    expect(middleware).toBeDefined();
  });

  it('should have use method with correct signature', () => {
    const MiddlewareClass = requestContextMiddleware();
    const middleware = new MiddlewareClass();

    expect(middleware.use).toBeDefined();
    expect(middleware.use.length).toBe(3); // req, res, next
  });
});
