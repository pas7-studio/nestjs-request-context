/**
 * E2E tests for TestKit
 */

import 'reflect-metadata';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Controller, Get, Param } from '@nestjs/common';
import { createTestAppFastify, createTestAppExpress, runParallelRequests, assertNoLeak } from '../src/index.js';
import { Ctx, REQUEST_ID_KEY, ROUTE_KEY, METHOD_KEY } from '@pas7/nestjs-request-context';
import request from 'supertest';

@Controller('test')
class TestController {
  @Get(':id')
  test(@Ctx(REQUEST_ID_KEY) requestId: string, @Param('id') id: string) {
    return { requestId, id };
  }

  @Get('all/:id')
  testAll(@Ctx() store: Record<string, unknown>, @Param('id') id: string) {
    return { ...store, id };
  }
}

describe.skip('TestKit E2E', () => {
  let fastifyApp: Awaited<ReturnType<typeof createTestAppFastify>>;
  let expressApp: Awaited<ReturnType<typeof createTestAppExpress>>;

  beforeAll(async () => {
    fastifyApp = await createTestAppFastify({
      module: {
        controllers: [TestController],
      },
      contextModuleOptions: {
        mode: 'standard',
      },
    });

    expressApp = await createTestAppExpress({
      module: {
        controllers: [TestController],
      },
      contextModuleOptions: {
        mode: 'standard',
      },
    });
  });

  afterAll(async () => {
    await fastifyApp.close();
    await expressApp.close();
  });

  describe('Fastify context isolation', () => {
    it('should not leak context between 10 parallel requests (Fastify)', async () => {
      const results = await runParallelRequests(10, async (i) => {
        return await request(fastifyApp.app.getHttpServer())
          .get(`/test/${i}`)
          .expect(200);
      });

      const bodies = results.map(r => r.body);

      // Перевіряємо що всі requestId унікальні
      const requestIds = bodies.map(b => b.requestId);
      const uniqueIds = new Set(requestIds);
      expect(uniqueIds).toHaveLength(10);

      // Перевіряємо інваріант
      assertNoLeak(bodies);
    });

    it('should not leak context between 100 parallel requests (Fastify)', async () => {
      const results = await runParallelRequests(100, async (i) => {
        return await request(fastifyApp.app.getHttpServer())
          .get(`/test/${i}`)
          .expect(200);
      });

      const bodies = results.map(r => r.body);

      // Перевіряємо що всі requestId унікальні
      const requestIds = bodies.map(b => b.requestId);
      const uniqueIds = new Set(requestIds);
      expect(uniqueIds).toHaveLength(100);

      // Перевіряємо інваріант
      assertNoLeak(bodies);
    });

    it('should preserve route and method in standard mode (Fastify)', async () => {
      const response = await request(fastifyApp.app.getHttpServer())
        .get('/test/all/123')
        .expect(200);

      expect(response.body.requestId).toBeDefined();
      expect(response.body.route).toBe('/test/all/:id');
      expect(response.body.method).toBe('GET');
    });
  });

  describe('Express context isolation', () => {
    it('should not leak context between 10 parallel requests (Express)', async () => {
      const results = await runParallelRequests(10, async (i) => {
        return await request(expressApp.app.getHttpServer())
          .get(`/test/${i}`)
          .expect(200);
      });

      const bodies = results.map(r => r.body);

      // Перевіряємо що всі requestId унікальні
      const requestIds = bodies.map(b => b.requestId);
      const uniqueIds = new Set(requestIds);
      expect(uniqueIds).toHaveLength(10);

      // Перевіряємо інваріант
      assertNoLeak(bodies);
    });

    it('should not leak context between 100 parallel requests (Express)', async () => {
      const results = await runParallelRequests(100, async (i) => {
        return await request(expressApp.app.getHttpServer())
          .get(`/test/${i}`)
          .expect(200);
      });

      const bodies = results.map(r => r.body);

      // Перевіряємо що всі requestId унікальні
      const requestIds = bodies.map(b => b.requestId);
      const uniqueIds = new Set(requestIds);
      expect(uniqueIds).toHaveLength(100);

      // Перевіряємо інваріант
      assertNoLeak(bodies);
    });

    it('should preserve route and method in standard mode (Express)', async () => {
      const response = await request(expressApp.app.getHttpServer())
        .get('/test/all/456')
        .expect(200);

      expect(response.body.requestId).toBeDefined();
      expect(response.body.route).toBe('/test/all/:id');
      expect(response.body.method).toBe('GET');
    });
  });

  describe('Both adapters together', () => {
    it('should work correctly with both adapters simultaneously', async () => {
      const fastifyResults = await runParallelRequests(50, async (i) => {
        return await request(fastifyApp.app.getHttpServer())
          .get(`/test/${i}`)
          .expect(200);
      });

      const expressResults = await runParallelRequests(50, async (i) => {
        return await request(expressApp.app.getHttpServer())
          .get(`/test/${i}`)
          .expect(200);
      });

      const allBodies = [...fastifyResults.map(r => r.body), ...expressResults.map(r => r.body)];

      // All request IDs should be unique across both adapters
      const requestIds = allBodies.map(b => b.requestId);
      const uniqueIds = new Set(requestIds);
      expect(uniqueIds).toHaveLength(100);

      // No leaks
      assertNoLeak(allBodies);
    });
  });

  describe('Custom request IDs', () => {
    it('should handle custom request IDs correctly (Fastify)', async () => {
      const results = await runParallelRequests(10, async (i) => {
        const customId = `fastify-${i}`;
        return await request(fastifyApp.app.getHttpServer())
          .get(`/test/${i}`)
          .set('x-request-id', customId)
          .expect(200);
      });

      const bodies = results.map(r => r.body);

      // Check that custom IDs are preserved
      bodies.forEach((body, i) => {
        expect(body.requestId).toBe(`fastify-${i}`);
      });

      // No leaks
      assertNoLeak(bodies);
    });

    it('should handle custom request IDs correctly (Express)', async () => {
      const results = await runParallelRequests(10, async (i) => {
        const customId = `express-${i}`;
        return await request(expressApp.app.getHttpServer())
          .get(`/test/${i}`)
          .set('x-request-id', customId)
          .expect(200);
      });

      const bodies = results.map(r => r.body);

      // Check that custom IDs are preserved
      bodies.forEach((body, i) => {
        expect(body.requestId).toBe(`express-${i}`);
      });

      // No leaks
      assertNoLeak(bodies);
    });
  });
});
