/**
 * Tests for RequestContextModule
 */

import { Test, TestingModule } from '@nestjs/testing';
import { RequestContextModule } from './request-context.module.js';
import { RequestContextService, MODULE_OPTIONS } from './request-context.service.js';
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
      const moduleBuilder = Test.createTestingModule({
        imports: [moduleRef],
      });

      // Cannot actually compile without a controller, but we can test the structure
      expect(moduleRef.providers).toContainEqual(
        expect.objectContaining({
          provide: MODULE_OPTIONS,
          useValue: {},
        }),
      );
    });

    it('should register MODULE_OPTIONS provider with custom options', () => {
      const options = {
        mode: 'standard' as const,
        header: 'x-custom-request-id',
      };

      const moduleRef = RequestContextModule.forRoot(options);
      
      expect(moduleRef.providers).toContainEqual(
        expect.objectContaining({
          provide: MODULE_OPTIONS,
          useValue: options,
        }),
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
        }),
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
      
      expect(moduleRef.providers).toContainEqual(
        expect.objectContaining({
          provide: MODULE_OPTIONS,
          useFactory: asyncOptions.useFactory,
          inject: asyncOptions.inject,
        }),
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
        }),
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
        }),
      );
    });
  });
});
