/**
 * Tests for nest package
 */

import {
  RequestContextModule,
  RequestContextService,
  Ctx,
  ContextInterceptor,
  ContextGuard,
  REQUEST_ID_KEY,
  ROUTE_KEY,
  METHOD_KEY,
  IP_KEY,
  MODULE_OPTIONS,
} from './index.js';
import { ContextKey } from '@pas7/request-context-core';

describe('Nest Package - Public API', () => {
  describe('Exports', () => {
    it('should export RequestContextModule', () => {
      expect(RequestContextModule).toBeDefined();
    });

    it('should export RequestContextService', () => {
      expect(RequestContextService).toBeDefined();
    });

    it('should export MODULE_OPTIONS token', () => {
      expect(MODULE_OPTIONS).toBeDefined();
      expect(typeof MODULE_OPTIONS).toBe('symbol');
    });

    it('should export Ctx decorator', () => {
      expect(Ctx).toBeDefined();
      expect(typeof Ctx).toBe('function');
    });

    it('should export ContextInterceptor', () => {
      expect(ContextInterceptor).toBeDefined();
    });

    it('should export ContextGuard', () => {
      expect(ContextGuard).toBeDefined();
    });

    it('should export REQUEST_ID_KEY', () => {
      expect(REQUEST_ID_KEY).toBeDefined();
      expect(REQUEST_ID_KEY).toBeInstanceOf(ContextKey);
      expect(REQUEST_ID_KEY.name).toBe('requestId');
    });

    it('should export ROUTE_KEY', () => {
      expect(ROUTE_KEY).toBeDefined();
      expect(ROUTE_KEY).toBeInstanceOf(ContextKey);
      expect(ROUTE_KEY.name).toBe('route');
    });

    it('should export METHOD_KEY', () => {
      expect(METHOD_KEY).toBeDefined();
      expect(METHOD_KEY).toBeInstanceOf(ContextKey);
      expect(METHOD_KEY.name).toBe('method');
    });

    it('should export IP_KEY', () => {
      expect(IP_KEY).toBeDefined();
      expect(IP_KEY).toBeInstanceOf(ContextKey);
      expect(IP_KEY.name).toBe('ip');
    });
  });

  describe('RequestContextModule', () => {
    it('should have forRoot method', () => {
      expect(typeof RequestContextModule.forRoot).toBe('function');
    });

    it('should have forRootAsync method', () => {
      expect(typeof RequestContextModule.forRootAsync).toBe('function');
    });

    it('should create module with forRoot', () => {
      const moduleRef = RequestContextModule.forRoot();
      expect(moduleRef).toBeDefined();
      expect(moduleRef.module).toBe(RequestContextModule);
    });

    it('should create module with forRootAsync', () => {
      const moduleRef = RequestContextModule.forRootAsync({
        imports: [],
        inject: [],
        useFactory: () => ({}),
      });
      expect(moduleRef).toBeDefined();
      expect(moduleRef.module).toBe(RequestContextModule);
    });
  });

  describe('RequestContextService', () => {
    it('should have static get method', () => {
      expect(typeof RequestContextService.get).toBe('function');
    });

    it('should have static set method', () => {
      expect(typeof RequestContextService.set).toBe('function');
    });

    it('should have static has method', () => {
      expect(typeof RequestContextService.has).toBe('function');
    });

    it('should have static require method', () => {
      expect(typeof RequestContextService.require).toBe('function');
    });

    it('should have static getRequestId method', () => {
      expect(typeof RequestContextService.getRequestId).toBe('function');
    });

    it('should have static getRoute method', () => {
      expect(typeof RequestContextService.getRoute).toBe('function');
    });

    it('should have static getMethod method', () => {
      expect(typeof RequestContextService.getMethod).toBe('function');
    });
  });

  describe('Keys', () => {
    it('should have unique keys', () => {
      expect(REQUEST_ID_KEY).not.toBe(ROUTE_KEY);
      expect(ROUTE_KEY).not.toBe(METHOD_KEY);
      expect(METHOD_KEY).not.toBe(IP_KEY);
    });
  });
});
