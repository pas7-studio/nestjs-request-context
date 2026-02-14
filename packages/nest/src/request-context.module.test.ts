/**
 * Tests for RequestContextModule
 */

import { RequestContextModule, MODULE_OPTIONS } from './request-context.module.js';
import { RequestContextService } from './request-context.service.js';
import { ContextInterceptor } from './context.interceptor.js';
import { ContextGuard } from './context.guard.js';

describe('RequestContextModule', () => {
  describe('forRoot', () => {
    it('should create a dynamic module with default options', () => {
      const moduleRef = RequestContextModule.forRoot();

      expect(moduleRef.module).toBe(RequestContextModule);
      expect(moduleRef.global).toBe(true);
      expect(moduleRef.exports).toEqual([RequestContextService]);
      expect(moduleRef.providers).toBeDefined();
      expect(moduleRef.providers).toHaveLength(5);
    });

    it('should create a dynamic module with custom options', () => {
      const options = {
        mode: 'standard' as const,
        header: 'x-custom-request-id',
        keys: {
          requestId: 'customRequestId',
          route: 'customRoute',
          method: 'customMethod',
          ip: 'clientIp',
        },
      };

      const moduleRef = RequestContextModule.forRoot(options);

      expect(moduleRef.module).toBe(RequestContextModule);
      expect(moduleRef.global).toBe(true);
      expect(moduleRef.exports).toEqual([RequestContextService]);
    });

    it('should register MODULE_OPTIONS provider with default options', async () => {
      const moduleRef = RequestContextModule.forRoot();

      // Cannot actually compile without a controller, but we can test structure
      const optionsProvider = moduleRef.providers.find(
        (p) => typeof p === 'object' && p !== null && 'provide' in p && typeof p.provide === 'symbol'
      );
      expect(optionsProvider).toBeDefined();
      expect(optionsProvider).toEqual(
        expect.objectContaining({
          useValue: {},
        })
      );
    });

    it('should register MODULE_OPTIONS provider with custom options', () => {
      const options = {
        mode: 'standard' as const,
        header: 'x-custom-request-id',
      };

      const moduleRef = RequestContextModule.forRoot(options);

      const optionsProvider = moduleRef.providers.find(
        (p) => typeof p === 'object' && p !== null && 'provide' in p && typeof p.provide === 'symbol'
      );
      expect(optionsProvider).toBeDefined();
      expect(optionsProvider).toEqual(
        expect.objectContaining({
          useValue: options,
        })
      );
    });

    it('should register RequestContextService as a provider', () => {
      const moduleRef = RequestContextModule.forRoot();

      expect(moduleRef.providers).toContain(RequestContextService);
    });

    it('should register ContextInterceptor as a provider', () => {
      const moduleRef = RequestContextModule.forRoot();

      expect(moduleRef.providers).toContain(ContextInterceptor);
    });

    it('should register ContextGuard as a provider', () => {
      const moduleRef = RequestContextModule.forRoot();

      expect(moduleRef.providers).toContain(ContextGuard);
    });

    it('should register APP_INTERCEPTOR provider', () => {
      const moduleRef = RequestContextModule.forRoot();

      expect(moduleRef.providers).toContainEqual(
        expect.objectContaining({
          provide: 'APP_INTERCEPTOR',
          useClass: ContextInterceptor,
        })
      );
    });

    it('should export RequestContextService', () => {
      const moduleRef = RequestContextModule.forRoot();

      expect(moduleRef.exports).toContain(RequestContextService);
    });

    it('should be global module', () => {
      const moduleRef = RequestContextModule.forRoot();

      expect(moduleRef.global).toBe(true);
    });
  });

  describe('forRootAsync', () => {
    it('should create a dynamic module with async configuration', () => {
      const asyncOptions = {
        imports: [],
        inject: [],
        useFactory: () => ({
          mode: 'standard' as const,
          header: 'x-custom-request-id',
        }),
      };

      const moduleRef = RequestContextModule.forRootAsync(asyncOptions);

      expect(moduleRef.module).toBe(RequestContextModule);
      expect(moduleRef.global).toBe(true);
      expect(moduleRef.exports).toEqual([RequestContextService]);
      expect(moduleRef.imports).toEqual(asyncOptions.imports);
    });

    it('should register MODULE_OPTIONS provider with useFactory', () => {
      const asyncOptions = {
        imports: [],
        inject: [],
        useFactory: () => ({
          mode: 'standard' as const,
        }),
      };

      const moduleRef = RequestContextModule.forRootAsync(asyncOptions);

      const optionsProvider = moduleRef.providers.find(
        (p) => typeof p === 'object' && p !== null && 'provide' in p && typeof p.provide === 'symbol'
      );
      expect(optionsProvider).toBeDefined();
      expect(optionsProvider).toEqual(
        expect.objectContaining({
          useFactory: asyncOptions.useFactory,
          inject: asyncOptions.inject,
        })
      );
    });

    it('should include imports from async options', () => {
      const asyncOptions = {
        imports: [{ module: 'TestModule' }],
        inject: [],
        useFactory: () => ({}),
      };

      const moduleRef = RequestContextModule.forRootAsync(asyncOptions);

      expect(moduleRef.imports).toEqual(asyncOptions.imports);
    });

    it('should include inject from async options', () => {
      const asyncOptions = {
        imports: [],
        inject: ['TestService'],
        useFactory: () => ({}),
      };

      const moduleRef = RequestContextModule.forRootAsync(asyncOptions);

      expect(moduleRef.providers).toContainEqual(
        expect.objectContaining({
          inject: asyncOptions.inject,
        })
      );
    });

    it('should register all required providers', () => {
      const asyncOptions = {
        imports: [],
        inject: [],
        useFactory: () => ({}),
      };

      const moduleRef = RequestContextModule.forRootAsync(asyncOptions);

      expect(moduleRef.providers).toHaveLength(5);
      expect(moduleRef.providers).toContain(RequestContextService);
      expect(moduleRef.providers).toContain(ContextInterceptor);
      expect(moduleRef.providers).toContain(ContextGuard);
      expect(moduleRef.providers).toContainEqual(
        expect.objectContaining({
          provide: 'APP_INTERCEPTOR',
        })
      );
    });

    // ============================================
    // useGlobalInterceptor Tests
    // ============================================

    it('should register APP_INTERCEPTOR when useGlobalInterceptor is true (default)', () => {
      const asyncOptions = {
        imports: [],
        inject: [],
        useFactory: () => ({ useGlobalInterceptor: true }),
      };

      const moduleRef = RequestContextModule.forRootAsync(asyncOptions);

      // forRootAsync always registers APP_INTERCEPTOR with useFactory in current implementation
      const appInterceptorProvider = moduleRef.providers.find(
        (p) =>
          typeof p === 'object' &&
          p !== null &&
          'provide' in p &&
          p.provide === 'APP_INTERCEPTOR'
      );

      expect(appInterceptorProvider).toBeDefined();
      // forRootAsync uses useClass pattern (current implementation)
      expect(appInterceptorProvider).toEqual(
        expect.objectContaining({
          provide: 'APP_INTERCEPTOR',
          useClass: ContextInterceptor,
        })
      );
    });

    it('should register APP_INTERCEPTOR when useGlobalInterceptor is not specified (default behavior)', () => {
      const asyncOptions = {
        imports: [],
        inject: [],
        useFactory: () => ({}), // No useGlobalInterceptor specified
      };

      const moduleRef = RequestContextModule.forRootAsync(asyncOptions);

      const appInterceptorProvider = moduleRef.providers.find(
        (p) =>
          typeof p === 'object' &&
          p !== null &&
          'provide' in p &&
          p.provide === 'APP_INTERCEPTOR'
      );

      expect(appInterceptorProvider).toBeDefined();
    });

    it('should register APP_INTERCEPTOR provider even when useGlobalInterceptor is false', () => {
      const asyncOptions = {
        imports: [],
        inject: [],
        useFactory: () => ({ useGlobalInterceptor: false }),
      };

      const moduleRef = RequestContextModule.forRootAsync(asyncOptions);

      // Current implementation always registers APP_INTERCEPTOR (with useClass)
      const appInterceptorProvider = moduleRef.providers.find(
        (p) =>
          typeof p === 'object' &&
          p !== null &&
          'provide' in p &&
          p.provide === 'APP_INTERCEPTOR'
      );

      expect(appInterceptorProvider).toBeDefined();
      // forRootAsync uses useClass pattern (current implementation)
      expect(appInterceptorProvider).toEqual(
        expect.objectContaining({
          provide: 'APP_INTERCEPTOR',
          useClass: ContextInterceptor,
        })
      );
    });

    it('should have ContextInterceptor available as provider', () => {
      const asyncOptions = {
        imports: [],
        inject: [],
        useFactory: () => ({ useGlobalInterceptor: true }),
      };

      const moduleRef = RequestContextModule.forRootAsync(asyncOptions);

      // ContextInterceptor is registered as a provider
      expect(moduleRef.providers).toContain(ContextInterceptor);
    });

    it('should have ContextGuard available as provider', () => {
      const asyncOptions = {
        imports: [],
        inject: [],
        useFactory: () => ({ useGlobalInterceptor: true }),
      };

      const moduleRef = RequestContextModule.forRootAsync(asyncOptions);

      // ContextGuard is registered as a provider
      expect(moduleRef.providers).toContain(ContextGuard);
    });

    it('should register APP_INTERCEPTOR with useClass pattern', () => {
      const asyncOptions = {
        imports: [],
        inject: [],
        useFactory: () => ({}),
      };

      const moduleRef = RequestContextModule.forRootAsync(asyncOptions);

      // forRootAsync uses useClass pattern (current implementation)
      expect(moduleRef.providers).toContainEqual(
        expect.objectContaining({
          provide: 'APP_INTERCEPTOR',
          useClass: ContextInterceptor,
        })
      );
    });
  });

  // ============================================
  // forRoot useGlobalInterceptor Tests
  // ============================================

  describe('forRoot useGlobalInterceptor', () => {
    it('should register APP_INTERCEPTOR by default (useGlobalInterceptor: true)', () => {
      const moduleRef = RequestContextModule.forRoot();

      expect(moduleRef.providers).toContainEqual(
        expect.objectContaining({
          provide: 'APP_INTERCEPTOR',
          useClass: ContextInterceptor,
        })
      );
    });

    it('should register APP_INTERCEPTOR when useGlobalInterceptor is explicitly true', () => {
      const moduleRef = RequestContextModule.forRoot({ useGlobalInterceptor: true });

      expect(moduleRef.providers).toContainEqual(
        expect.objectContaining({
          provide: 'APP_INTERCEPTOR',
          useClass: ContextInterceptor,
        })
      );
    });

    it('should NOT register APP_INTERCEPTOR when useGlobalInterceptor is false', () => {
      const moduleRef = RequestContextModule.forRoot({ useGlobalInterceptor: false });

      const appInterceptor = moduleRef.providers.find(
        (p) =>
          typeof p === 'object' &&
          p !== null &&
          'provide' in p &&
          p.provide === 'APP_INTERCEPTOR'
      );

      expect(appInterceptor).toBeUndefined();
    });

    it('should NOT register ContextInterceptor and ContextGuard when useGlobalInterceptor is false', () => {
      const moduleRef = RequestContextModule.forRoot({ useGlobalInterceptor: false });

      // Should NOT contain ContextInterceptor or ContextGuard
      expect(moduleRef.providers).not.toContain(ContextInterceptor);
      expect(moduleRef.providers).not.toContain(ContextGuard);
    });

    it('should still register RequestContextService when useGlobalInterceptor is false', () => {
      const moduleRef = RequestContextModule.forRoot({ useGlobalInterceptor: false });

      expect(moduleRef.providers).toContain(RequestContextService);
      expect(moduleRef.exports).toContain(RequestContextService);
    });

    it('should have fewer providers when useGlobalInterceptor is false', () => {
      const moduleWithInterceptor = RequestContextModule.forRoot({ useGlobalInterceptor: true });
      const moduleWithoutInterceptor = RequestContextModule.forRoot({ useGlobalInterceptor: false });

      expect(moduleWithoutInterceptor.providers.length).toBeLessThan(
        moduleWithInterceptor.providers.length
      );
    });
  });
});
