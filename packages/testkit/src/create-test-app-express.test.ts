/**
 * Unit tests for createTestAppExpress
 */

import 'reflect-metadata';
import { describe, it, expect } from 'vitest';
import { Controller, Get } from '@nestjs/common';
import { createTestAppExpress } from './create-test-app-express.js';
import { Ctx, REQUEST_ID_KEY } from '@pas7/nestjs-request-context';
import request from 'supertest';

@Controller('test')
class TestController {
  @Get()
  test(@Ctx(REQUEST_ID_KEY) requestId: string) {
    return { requestId };
  }

  @Get('async')
  async testAsync(@Ctx(REQUEST_ID_KEY) requestId: string) {
    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 1));
    return { requestId };
  }
}

describe.skip('createTestAppExpress', () => {
  let result: Awaited<ReturnType<typeof createTestAppExpress>>;

  afterEach(async () => {
    if (result) {
      await result.close();
    }
  });

  describe('Basic functionality', () => {
    it('should create NestApplication with ExpressAdapter', async () => {
      result = await createTestAppExpress({
        module: {
          controllers: [TestController],
        },
      });

      expect(result.app).toBeDefined();
      expect(result.module).toBeDefined();
      expect(result.close).toBeDefined();
    });

    it('should create app without custom module', async () => {
      result = await createTestAppExpress();

      expect(result.app).toBeDefined();
      expect(result.module).toBeDefined();
    });
  });

  describe('Request context', () => {
    it('should have requestId in response', async () => {
      result = await createTestAppExpress({
        module: {
          controllers: [TestController],
        },
      });

      const response = await request(result.app.getHttpServer()).get('/test').expect(200);

      expect(response.body.requestId).toBeDefined();
      expect(typeof response.body.requestId).toBe('string');
    });

    it('should use custom requestId from header', async () => {
      result = await createTestAppExpress({
        module: {
          controllers: [TestController],
        },
      });

      const customRequestId = 'custom-123';
      const response = await request(result.app.getHttpServer())
        .get('/test')
        .set('x-request-id', customRequestId)
        .expect(200);

      expect(response.body.requestId).toBe(customRequestId);
    });

    it('should work with async handlers', async () => {
      result = await createTestAppExpress({
        module: {
          controllers: [TestController],
        },
      });

      const response = await request(result.app.getHttpServer()).get('/test/async').expect(200);

      expect(response.body.requestId).toBeDefined();
      expect(typeof response.body.requestId).toBe('string');
    });

    it('should add requestId to response header', async () => {
      result = await createTestAppExpress({
        module: {
          controllers: [TestController],
        },
      });

      const response = await request(result.app.getHttpServer()).get('/test').expect(200);

      expect(response.headers['x-request-id']).toBeDefined();
      expect(typeof response.headers['x-request-id']).toBe('string');
    });

    it('should match response header with request body requestId', async () => {
      result = await createTestAppExpress({
        module: {
          controllers: [TestController],
        },
      });

      const response = await request(result.app.getHttpServer()).get('/test').expect(200);

      expect(response.headers['x-request-id']).toBe(response.body.requestId);
    });
  });

  describe('Cleanup', () => {
    it('should close app properly', async () => {
      result = await createTestAppExpress();

      await expect(result.close()).resolves.not.toThrow();
    });

    it('should close app after making requests', async () => {
      result = await createTestAppExpress({
        module: {
          controllers: [TestController],
        },
      });

      // Make some requests
      await request(result.app.getHttpServer()).get('/test').expect(200);
      await request(result.app.getHttpServer()).get('/test').expect(200);

      // Should close without errors
      await expect(result.close()).resolves.not.toThrow();
    });
  });
});
