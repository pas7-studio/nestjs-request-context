/**
 * Assert that contexts are isolated between requests (no leak)
 */

/**
 * Error thrown when context leak is detected
 */
export class ContextLeakError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ContextLeakError';
  }
}

/**
 * Assert that contexts do not leak between requests
 *
 * This is useful for E2E tests to verify that each request has its own
 * isolated context and that request IDs are unique across requests.
 *
 * @example
 * ```typescript
 * const results = await runParallelRequests(100, async (i) => {
 *   return await request(app.getHttpServer())
 *     .get(`/test/${i}`)
 *     .expect(200);
 * });
 *
 * const contexts = results.map(r => r.body);
 * assertNoLeak(contexts);
 * ```
 *
 * @param actual - Array of result objects (each should have a requestId property)
 * @throws ContextLeakError if duplicate request IDs are found
 */
export function assertNoLeak(actual: Record<string, unknown>[]): void {
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
