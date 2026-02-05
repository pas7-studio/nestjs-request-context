/**
 * Unit tests for createTestAppFastify
 */

import 'reflect-metadata';
import { describe, it, expect, afterEach } from 'vitest';
import { Controller, Get } from '@nestjs/common';
import { createTestAppFastify } from './create-test-app-fastify.js';
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

describe.skip('createTestAppFastify', () => {
  let result: Awaited<ReturnType<typeof createTestAppFastify>>;

  afterEach(async () => {
    if (result) {
      await result.close();
    }
  });

  describe('Basic functionality', () => {
    it('should create NestApplication with FastifyAdapter', async () => {
      result = await createTestAppFastify({
        module: {
          controllers: [TestController],
        },
      });

      expect(result.app).toBeDefined();
      expect(result.module).toBeDefined();
      expect(result.close).toBeDefined();
    });

    it('should create app without custom module', async () => {
      result = await createTestAppFastify();

      expect(result.app).toBeDefined();
      expect(result.module).toBeDefined();
    });
  });

  describe('Request context', () => {
    it('should have requestId in response', async () => {
      result = await createTestAppFastify({
        module: {
          controllers: [TestController],
        },
      });

      const response = await request(result.app.getHttpServer()).get('/test').expect(200);

      expect(response.body.requestId).toBeDefined();
      expect(typeof response.body.requestId).toBe('string');
    });

    it('should use custom requestId from header', async () => {
      result = await createTestAppFastify({
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
      result = await createTestAppFastify({
        module: {
          controllers: [TestController],
        },
      });

      const response = await request(result.app.getHttpServer()).get('/test/async').expect(200);

      expect(response.body.requestId).toBeDefined();
      expect(typeof response.body.requestId).toBe('string');
    });

    it('should add requestId to response header', async () => {
      result = await createTestAppFastify({
        module: {
          controllers: [TestController],
        },
      });

      const response = await request(result.app.getHttpServer()).get('/test').expect(200);

      expect(response.headers['x-request-id']).toBeDefined();
      expect(typeof response.headers['x-request-id']).toBe('string');
    });

    it('should match response header with request body requestId', async () => {
      result = await createTestAppFastify({
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
      result = await createTestAppFastify();

      await expect(result.close()).resolves.not.toThrow();
    });

    it('should close app after making requests', async () => {
      result = await createTestAppFastify({
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
