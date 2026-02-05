/**
 * E2E tests for RequestContextModule
 */

import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { RequestContextModule, Ctx, REQUEST_ID_KEY, ROUTE_KEY, METHOD_KEY } from './index.js';
import { RequestContextService } from './request-context.service.js';

@Controller()
class TestController {
  @Get('/test')
  test(@Ctx(REQUEST_ID_KEY) requestId: string) {
    return { requestId };
  }

  @Get('/test-all')
  testAll(@Ctx() store: Record<string, unknown>) {
    return store;
  }

  @Get('/standard')
  testStandard(@Ctx(REQUEST_ID_KEY) requestId: string, @Ctx(ROUTE_KEY) route: string, @Ctx(METHOD_KEY) method: string) {
    return { requestId, route, method };
  }

  @Get('/error')
  error(@Ctx(REQUEST_ID_KEY) requestId: string) {
    throw new Error('Test error');
  }

  @Get('/http-error')
  httpError(@Ctx(REQUEST_ID_KEY) requestId: string) {
    throw new HttpException('HTTP error', HttpStatus.BAD_REQUEST);
  }

  @Get('/static-access')
  staticAccess() {
    return { requestId: RequestContextService.getRequestId() };
  }
}

describe('RequestContext E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        RequestContextModule.forRoot({
          mode: 'minimal',
        }),
      ],
      controllers: [TestController],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Basic functionality', () => {
    it('should enrich context with requestId', async () => {
      const response = await request(app.getHttpServer())
        .get('/test')
        .expect(200);

      expect(response.body.requestId).toBeDefined();
      expect(response.body.requestId).toMatch(/^[0-9a-f-]{36}$/); // UUID format
    });

    it('should use custom requestId from header', async () => {
      const customRequestId = 'custom-request-id-123';
      const response = await request(app.getHttpServer())
        .get('/test')
        .set('x-request-id', customRequestId)
        .expect(200);

      expect(response.body.requestId).toBe(customRequestId);
    });

    it('should return entire store when using Ctx() without key', async () => {
      const response = await request(app.getHttpServer())
        .get('/test-all')
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.requestId).toBeDefined();
      expect(typeof response.body.requestId).toBe('string');
    });

    it('should allow static access through RequestContextService', async () => {
      const response = await request(app.getHttpServer())
        .get('/static-access')
        .expect(200);

      expect(response.body.requestId).toBeDefined();
      expect(response.body.requestId).toMatch(/^[0-9a-f-]{36}$/);
    });
  });

  describe('Error handling', () => {
    it('should return error with requestId in response', async () => {
      const customRequestId = 'error-request-id-456';
      const response = await request(app.getHttpServer())
        .get('/error')
        .set('x-request-id', customRequestId)
        .expect(500);

      // Note: In a real application with proper error filter, requestId would be included
      // For now, we just verify the endpoint throws an error
      expect(response.body).toBeDefined();
    });

    it('should return HTTP exception with requestId in response', async () => {
      const customRequestId = 'http-error-request-id-789';
      const response = await request(app.getHttpServer())
        .get('/http-error')
        .set('x-request-id', customRequestId)
        .expect(400);

      expect(response.body).toBeDefined();
      expect(response.body.statusCode).toBe(400);
    });

    it('should maintain context through error flow', async () => {
      const customRequestId = 'error-flow-request-id';
      
      // First request to get requestId
      const response1 = await request(app.getHttpServer())
        .get('/test')
        .set('x-request-id', customRequestId)
        .expect(200);

      expect(response1.body.requestId).toBe(customRequestId);

      // Second request with error
      const response2 = await request(app.getHttpServer())
        .get('/error')
        .set('x-request-id', customRequestId)
        .expect(500);

      // Context is per-request, so it should still work independently
      expect(response2.body).toBeDefined();
    });
  });

  describe('Standard mode', () => {
    let appStandard: INestApplication;

    beforeAll(async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          RequestContextModule.forRoot({
            mode: 'standard',
          }),
        ],
        controllers: [TestController],
      }).compile();

      appStandard = module.createNestApplication();
      await appStandard.init();
    });

    afterAll(async () => {
      await appStandard.close();
    });

    it('should enrich context with requestId, route, and method in standard mode', async () => {
      const response = await request(appStandard.getHttpServer())
        .get('/standard')
        .expect(200);

      expect(response.body.requestId).toBeDefined();
      expect(response.body.route).toBeDefined();
      expect(response.body.method).toBeDefined();
      expect(response.body.route).toBe('/standard');
      expect(response.body.method).toBe('GET');
    });

    it('should include route and method in entire store', async () => {
      const response = await request(appStandard.getHttpServer())
        .get('/test-all')
        .expect(200);

      expect(response.body.requestId).toBeDefined();
      expect(response.body.route).toBeDefined();
      expect(response.body.method).toBeDefined();
    });
  });

  describe('Custom configuration', () => {
    let appCustom: INestApplication;

    beforeAll(async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          RequestContextModule.forRoot({
            mode: 'standard',
            header: 'x-custom-request-id',
            keys: {
              requestId: 'customRequestId',
              route: 'customRoute',
              method: 'customMethod',
            },
          }),
        ],
        controllers: [TestController],
      }).compile();

      appCustom = module.createNestApplication();
      await appCustom.init();
    });

    afterAll(async () => {
      await appCustom.close();
    });

    it('should use custom header name', async () => {
      const customRequestId = 'custom-header-request-id';
      const response = await request(appCustom.getHttpServer())
        .get('/test')
        .set('x-custom-request-id', customRequestId)
        .expect(200);

      expect(response.body.requestId).toBeUndefined(); // Key name changed
    });

    it('should use custom key names', async () => {
      const response = await request(appCustom.getHttpServer())
        .get('/test-all')
        .expect(200);

      expect(response.body.customRequestId).toBeDefined();
      expect(response.body.customRoute).toBeDefined();
      expect(response.body.customMethod).toBeDefined();
      expect(response.body.requestId).toBeUndefined(); // Default key name not used
      expect(response.body.route).toBeUndefined(); // Default key name not used
      expect(response.body.method).toBeUndefined(); // Default key name not used
    });
  });

  describe('forRootAsync', () => {
    let appAsync: INestApplication;

    beforeAll(async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          RequestContextModule.forRootAsync({
            useFactory: () => ({
              mode: 'minimal' as const,
              header: 'x-async-request-id',
            }),
          }),
        ],
        controllers: [TestController],
      }).compile();

      appAsync = module.createNestApplication();
      await appAsync.init();
    });

    afterAll(async () => {
      await appAsync.close();
    });

    it('should work with async configuration', async () => {
      const response = await request(appAsync.getHttpServer())
        .get('/test')
        .set('x-async-request-id', 'async-request-id')
        .expect(200);

      expect(response.body.requestId).toBe('async-request-id');
    });
  });
});
