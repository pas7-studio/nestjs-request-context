/**
 * Critical context isolation tests for Express adapter
 * Tests that 100 parallel requests don't leak context between each other
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import express from 'express';
import { get } from '@pas7/request-context-core';
import { REQUEST_ID_KEY } from '@pas7/nestjs-request-context';
import { requestContextMiddleware } from '@pas7/nestjs-request-context-adapter-express';
import request from 'supertest';

/**
 * Run multiple requests in parallel and preserve order
 */
async function runParallelRequests<T>(
  n: number,
  handler: (index: number) => Promise<T>,
): Promise<T[]> {
  // Create an array of promises, one for each request
  const promises = Array.from({ length: n }, (_, i) => handler(i));

  // Wait for all promises to complete
  return Promise.all(promises);
}

/**
 * Error thrown when context leak is detected
 */
class ContextLeakError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ContextLeakError';
  }
}

/**
 * Assert that contexts do not leak between requests
 */
function assertNoLeak(actual: Record<string, unknown>[]): void {
  const requestIds = actual.map((item, index) => {
    const requestId = item.requestId as string | undefined | null;

    if (requestId === undefined || requestId === null) {
      throw new ContextLeakError(
        `Result at index ${index} is missing requestId property`,
      );
    }

    return requestId;
  });

  const uniqueIds = new Set(requestIds);

  if (uniqueIds.size !== requestIds.length) {
    // Find duplicates
    const duplicates = requestIds.filter(
      (id, index) => requestIds.indexOf(id) !== index,
    );
    const uniqueDuplicates = [...new Set(duplicates)];

    throw new ContextLeakError(
      `Context leak detected: duplicate request IDs found: ${uniqueDuplicates.join(', ')}`,
    );
  }
}
import request from 'supertest';

describe('Express Context Isolation E2E', () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    app.use(requestContextMiddleware());

    app.get('/test/:id', (req, res) => {
      const requestId = get(REQUEST_ID_KEY);
      const id = req.params.id;
      res.json({ id, requestId });
    });

    app.get('/full/:id', (req, res) => {
      const store = { requestId: get(REQUEST_ID_KEY) } as Record<string, unknown>;
      const id = req.params.id;
      res.json({ id, requestId: store.requestId });
    });
  });

  afterAll(() => {
    // Cleanup if needed
  });

  it('should handle single request correctly', async () => {
    const response = await request(app).get('/test/1').expect(200);

    expect(response.body).toHaveProperty('requestId');
    expect(response.body.id).toBe('1');
    expect(typeof response.body.requestId).toBe('string');
  });

  it('should generate unique requestIds for 10 parallel requests', async () => {
    const results = await runParallelRequests(10, async (i) => {
      return await request(app).get(`/test/${i}`).expect(200);
    });

    const requestIds = results.map((r) => r.body.requestId);
    const uniqueIds = new Set(requestIds);

    // Всі requestId повинні бути унікальними
    expect(uniqueIds).toHaveLength(10);

    // Перевірка інваріанту - немає leak
    assertNoLeak(results.map((r) => r.body));
  });

  it('should generate unique requestIds for 100 parallel requests', async () => {
    const results = await runParallelRequests(100, async (i) => {
      return await request(app).get(`/test/${i}`).expect(200);
    });

    const requestIds = results.map((r) => r.body.requestId);
    const uniqueIds = new Set(requestIds);

    // Всі requestId повинні бути унікальними
    expect(uniqueIds).toHaveLength(100);

    // Перевірка інваріанту - немає leak
    assertNoLeak(results.map((r) => r.body));

    // Додатково перевірити, що кожен ID має коректний формат (UUID)
    requestIds.forEach((id) => {
      expect(id).toMatch(/^[0-9a-f-]{36}$/); // UUID format
    });
  });

  it('should preserve full context in 100 parallel requests', async () => {
    const results = await runParallelRequests(100, async (i) => {
      return await request(app).get(`/full/${i}`).expect(200);
    });

    const requestIds = results.map((r) => r.body.requestId);
    const uniqueIds = new Set(requestIds);

    // Всі requestId повинні бути унікальними
    expect(uniqueIds).toHaveLength(100);

    // Перевірка інваріанту - немає leak
    assertNoLeak(results.map((r) => r.body));
  });

  it('should handle custom requestId from header', async () => {
    const customRequestId = 'custom-test-id-123';

    const response = await request(app)
      .get('/test/1')
      .set('x-request-id', customRequestId)
      .expect(200);

    expect(response.body.requestId).toBe(customRequestId);
  });

  it('should use unique requestIds when custom header provided', async () => {
    const results = await runParallelRequests(50, async (i) => {
      return await request(app)
        .get(`/test/${i}`)
        .set('x-request-id', `custom-${i}`)
        .expect(200);
    });

    const requestIds = results.map((r) => r.body.requestId);

    // Всі requestId повинні бути унікальними
    expect(new Set(requestIds)).toHaveLength(50);

    // Перевірити, що custom IDs використовуються
    expect(requestIds[0]).toBe('custom-0');
    expect(requestIds[49]).toBe('custom-49');

    // Перевірка інваріанту - немає leak
    assertNoLeak(results.map((r) => r.body));
  });
});
