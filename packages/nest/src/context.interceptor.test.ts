/**
 * Tests for ContextInterceptor
 */

import { Observable, of, lastValueFrom } from 'rxjs';
import type { ExecutionContext, CallHandler } from '@nestjs/common';
import { Context } from '@pas7/request-context-core';
import { ContextInterceptor } from './context.interceptor.js';
import type { RequestContextModuleOptions } from './config.js';

describe('ContextInterceptor', () => {
  let interceptor: ContextInterceptor;
  let mockOptions: RequestContextModuleOptions;

  beforeEach(() => {
    mockOptions = {
      header: 'x-request-id',
      mode: 'minimal',
    };
    interceptor = new ContextInterceptor(mockOptions);
  });

  const createMockExecutionContext = (
    headers: Record<string, string | undefined> = {},
    url = '/test',
    method = 'GET',
    routePath?: string
  ): ExecutionContext => {
    const request = {
      headers,
      url,
      method,
      route: routePath ? { path: routePath } : undefined,
      ip: '127.0.0.1',
    };

    return {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as unknown as ExecutionContext;
  };

  describe('intercept', () => {
    it('should enrich context with requestId from header', async () => {
      const context = createMockExecutionContext({
        'x-request-id': 'test-request-id',
      });

      const next: CallHandler = {
        handle: () => {
          const currentContext = Context.current();
          expect(currentContext).toBeDefined();
          const store = currentContext?._getStore().getStore();
          expect(store?.requestId).toBe('test-request-id');
          return of({ success: true });
        },
      };

      const result$ = interceptor.intercept(context, next);
      const result = await lastValueFrom(result$);

      expect(result).toEqual({ success: true });
    });

    it('should generate requestId when header is not present', async () => {
      const context = createMockExecutionContext({});

      const next: CallHandler = {
        handle: () => {
          const currentContext = Context.current();
          expect(currentContext).toBeDefined();
          const store = currentContext?._getStore().getStore();
          expect(store?.requestId).toBeDefined();
          expect(store?.requestId).toMatch(/^[0-9a-f-]{36}$/); // UUID format
          return of({ success: true });
        },
      };

      const result$ = interceptor.intercept(context, next);
      const result = await lastValueFrom(result$);

      expect(result).toEqual({ success: true });
    });

    it('should use custom id generator if provided', async () => {
      const customGenerator = () => 'custom-generated-id';
      mockOptions.idGenerator = customGenerator;
      interceptor = new ContextInterceptor(mockOptions);

      const context = createMockExecutionContext({});

      const next: CallHandler = {
        handle: () => {
          const currentContext = Context.current();
          const store = currentContext?._getStore().getStore();
          expect(store?.requestId).toBe('custom-generated-id');
          return of({ success: true });
        },
      };

      const result$ = interceptor.intercept(context, next);
      const result = await lastValueFrom(result$);

      expect(result).toEqual({ success: true });
    });

    it('should use custom header name if provided', async () => {
      mockOptions.header = 'x-custom-request-id';
      interceptor = new ContextInterceptor(mockOptions);

      const context = createMockExecutionContext({
        'x-custom-request-id': 'custom-request-id',
      });

      const next: CallHandler = {
        handle: () => {
          const currentContext = Context.current();
          const store = currentContext?._getStore().getStore();
          expect(store?.requestId).toBe('custom-request-id');
          return of({ success: true });
        },
      };

      const result$ = interceptor.intercept(context, next);
      const result = await lastValueFrom(result$);

      expect(result).toEqual({ success: true });
    });

    it('should use custom key name for requestId if provided', async () => {
      mockOptions.keys = { requestId: 'customRequestId' };
      interceptor = new ContextInterceptor(mockOptions);

      const context = createMockExecutionContext({
        'x-request-id': 'test-request-id',
      });

      const next: CallHandler = {
        handle: () => {
          const currentContext = Context.current();
          const store = currentContext?._getStore().getStore();
          expect(store?.customRequestId).toBe('test-request-id');
          return of({ success: true });
        },
      };

      const result$ = interceptor.intercept(context, next);
      const result = await lastValueFrom(result$);

      expect(result).toEqual({ success: true });
    });

    describe('standard mode', () => {
      beforeEach(() => {
        mockOptions.mode = 'standard';
        interceptor = new ContextInterceptor(mockOptions);
      });

      it('should enrich context with route in standard mode', async () => {
        const context = createMockExecutionContext({}, '/test', 'GET', '/test');

        const next: CallHandler = {
          handle: () => {
            const currentContext = Context.current();
            const store = currentContext?._getStore().getStore();
            expect(store?.route).toBe('/test');
            return of({ success: true });
          },
        };

        const result$ = interceptor.intercept(context, next);
        const result = await lastValueFrom(result$);

        expect(result).toEqual({ success: true });
      });

      it('should enrich context with method in standard mode', async () => {
        const context = createMockExecutionContext();

        const next: CallHandler = {
          handle: () => {
            const currentContext = Context.current();
            const store = currentContext?._getStore().getStore();
            expect(store?.method).toBe('GET');
            return of({ success: true });
          },
        };

        const result$ = interceptor.intercept(context, next);
        const result = await lastValueFrom(result$);

        expect(result).toEqual({ success: true });
      });

      it('should use custom key names for route and method if provided', async () => {
        mockOptions.keys = {
          route: 'customRoute',
          method: 'customMethod',
        };
        interceptor = new ContextInterceptor(mockOptions);

        const context = createMockExecutionContext({}, '/test', 'GET', '/test');

        const next: CallHandler = {
          handle: () => {
            const currentContext = Context.current();
            const store = currentContext?._getStore().getStore();
            expect(store?.customRoute).toBe('/test');
            expect(store?.customMethod).toBe('GET');
            return of({ success: true });
          },
        };

        const result$ = interceptor.intercept(context, next);
        const result = await lastValueFrom(result$);

        expect(result).toEqual({ success: true });
      });
    });

    describe('minimal mode', () => {
      beforeEach(() => {
        mockOptions.mode = 'minimal';
        interceptor = new ContextInterceptor(mockOptions);
      });

      it('should not enrich context with route in minimal mode', async () => {
        const context = createMockExecutionContext({}, '/test', 'GET', '/test');

        const next: CallHandler = {
          handle: () => {
            const currentContext = Context.current();
            const store = currentContext?._getStore().getStore();
            expect(store?.route).toBeUndefined();
            return of({ success: true });
          },
        };

        const result$ = interceptor.intercept(context, next);
        const result = await lastValueFrom(result$);

        expect(result).toEqual({ success: true });
      });

      it('should not enrich context with method in minimal mode', async () => {
        const context = createMockExecutionContext();

        const next: CallHandler = {
          handle: () => {
            const currentContext = Context.current();
            const store = currentContext?._getStore().getStore();
            expect(store?.method).toBeUndefined();
            return of({ success: true });
          },
        };

        const result$ = interceptor.intercept(context, next);
        const result = await lastValueFrom(result$);

        expect(result).toEqual({ success: true });
      });
    });

    describe('IP address', () => {
      it('should enrich context with IP if configured', async () => {
        mockOptions.keys = { ip: 'clientIp' };
        interceptor = new ContextInterceptor(mockOptions);

        const context = createMockExecutionContext();

        const next: CallHandler = {
          handle: () => {
            const currentContext = Context.current();
            const store = currentContext?._getStore().getStore();
            expect(store?.clientIp).toBe('127.0.0.1');
            return of({ success: true });
          },
        };

        const result$ = interceptor.intercept(context, next);
        const result = await lastValueFrom(result$);

        expect(result).toEqual({ success: true });
      });

      it('should not enrich context with IP if not configured', async () => {
        const context = createMockExecutionContext();

        const next: CallHandler = {
          handle: () => {
            const currentContext = Context.current();
            const store = currentContext?._getStore().getStore();
            expect(store?.ip).toBeUndefined();
            return of({ success: true });
          },
        };

        const result$ = interceptor.intercept(context, next);
        const result = await lastValueFrom(result$);

        expect(result).toEqual({ success: true });
      });
    });

    describe('error handling', () => {
      it('should maintain context through error flow', async () => {
        const context = createMockExecutionContext({
          'x-request-id': 'test-request-id',
        });

        const next: CallHandler = {
          handle: () => {
            const currentContext = Context.current();
            expect(currentContext).toBeDefined();
            const store = currentContext?._getStore().getStore();
            expect(store?.requestId).toBe('test-request-id');
            return new Observable((subscriber) => {
              subscriber.error(new Error('Test error'));
            });
          },
        };

        const result$ = interceptor.intercept(context, next);

        await expect(lastValueFrom(result$)).rejects.toThrow('Test error');
      });
    });
  });
});
