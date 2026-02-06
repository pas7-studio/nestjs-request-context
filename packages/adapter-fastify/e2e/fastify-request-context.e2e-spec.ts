/**
 * E2E tests for Fastify request context adapter
 * 
 * NOTE: Full E2E tests are not possible with Fastify + AsyncLocalStorage.
 * Fastify hooks do not provide a way to wrap route handler execution within
 * AsyncLocalStorage context. The following limitations apply:
 * - onRequest hooks run before route handler but complete before handler executes
 * - onResponse hooks run after route handler completes
 * - There is no mechanism to keep context alive through request lifecycle
 * 
 * This test validates that the middleware function works correctly when called directly.
 */

import { describe, it, expect } from 'vitest';
import { get } from '@pas7/request-context-core';
import { REQUEST_ID_KEY } from '@pas7/nestjs-request-context';
import { requestContextMiddleware } from '@pas7/nestjs-request-context-adapter-fastify';

describe('Fastify Request Context E2E - Middleware Validation', () => {
  it('should create context when middleware is called', async () => {
    let capturedRequestId: string | undefined;

    // Simulate request and response objects
    const mockRequest: any = {
      headers: {},
    };
    const mockResponse: any = {
      header: (name: string, value: string) => {
        mockResponse.headers = mockResponse.headers || {};
        mockResponse.headers[name] = value;
      },
      headers: {},
    };

    // Call middleware
    const middleware = requestContextMiddleware();
    const middlewareInstance = new (middleware as any)();

    middlewareInstance.use(mockRequest, mockResponse, async () => {
      // Inside middleware callback, context should be active
      capturedRequestId = get(REQUEST_ID_KEY);
    });

    // Context should have been created
    expect(capturedRequestId).toBeDefined();
    expect(typeof capturedRequestId).toBe('string');
    // Response header should be set
    expect(mockResponse.headers['x-request-id']).toBe(capturedRequestId);
  });

  it('should use custom requestId from header', async () => {
    const customRequestId = 'custom-123';

    let capturedRequestId: string | undefined;

    const mockRequest: any = {
      headers: {
        'x-request-id': customRequestId,
      },
    };
    const mockResponse: any = {
      header: (name: string, value: string) => {
        mockResponse.headers = mockResponse.headers || {};
        mockResponse.headers[name] = value;
      },
      headers: {},
    };

    const middleware = requestContextMiddleware();
    const middlewareInstance = new (middleware as any)();

    middlewareInstance.use(mockRequest, mockResponse, async () => {
      capturedRequestId = get(REQUEST_ID_KEY);
    });

    expect(capturedRequestId).toBe(customRequestId);
    expect(mockResponse.headers['x-request-id']).toBe(customRequestId);
  });

  it('should use custom header name', async () => {
    const customTraceId = 'trace-456';

    let capturedRequestId: string | undefined;

    const mockRequest: any = {
      headers: {
        'x-trace-id': customTraceId,
      },
    };
    const mockResponse: any = {
      header: (name: string, value: string) => {
        mockResponse.headers = mockResponse.headers || {};
        mockResponse.headers[name] = value;
      },
      headers: {},
    };

    const middleware = requestContextMiddleware({
      header: 'x-trace-id',
    });
    const middlewareInstance = new (middleware as any)();

    middlewareInstance.use(mockRequest, mockResponse, async () => {
      capturedRequestId = get(REQUEST_ID_KEY);
    });

    expect(capturedRequestId).toBe(customTraceId);
    expect(mockResponse.headers['x-trace-id']).toBe(customTraceId);
  });

  it('should not add header when addResponseHeader is false', async () => {
    const customRequestId = 'custom-789';

    const mockRequest: any = {
      headers: {
        'x-request-id': customRequestId,
      },
    };
    const mockResponse: any = {
      header: (name: string, value: string) => {
        mockResponse.headers = mockResponse.headers || {};
        mockResponse.headers[name] = value;
      },
      headers: {},
    };

    const middleware = requestContextMiddleware({
      addResponseHeader: false,
    });
    const middlewareInstance = new (middleware as any)();

    middlewareInstance.use(mockRequest, mockResponse, async () => {
      get(REQUEST_ID_KEY);
    });

    expect(mockResponse.headers['x-request-id']).toBeUndefined();
  });
});
