/**
 * Run multiple requests in parallel and preserve order
 */

/**
 * Run n parallel requests using the provided handler
 *
 * This is useful for testing context isolation - it ensures that all requests
 * are executed in parallel and the results are returned in the same order.
 *
 * @example
 * ```typescript
 * const results = await runParallelRequests(10, async (i) => {
 *   return await request(app.getHttpServer())
 *     .get(`/test/${i}`)
 *     .expect(200);
 * });
 *
 * expect(results).toHaveLength(10);
 * ```
 *
 * @param n - Number of parallel requests to run
 * @param handler - Function to execute for each request, receives index (0...n-1)
 * @returns Promise with array of results in the same order as requests
 */
export async function runParallelRequests<T>(
  n: number,
  handler: (index: number) => Promise<T>,
): Promise<T[]> {
  // Create an array of promises, one for each request
  const promises = Array.from({ length: n }, (_, i) => handler(i));

  // Wait for all promises to complete
  return Promise.all(promises);
}
