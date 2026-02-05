/**
 * Unit tests for runParallelRequests
 */

import { describe, it, expect, vi } from 'vitest';
import { runParallelRequests } from './run-parallel-requests.js';

describe('runParallelRequests', () => {
  describe('Basic functionality', () => {
    it('should run n parallel requests', async () => {
      const results = await runParallelRequests(10, async (i) => {
        return i * 2;
      });

      expect(results).toHaveLength(10);
      expect(results).toEqual([0, 2, 4, 6, 8, 10, 12, 14, 16, 18]);
    });

    it('should run 1 request', async () => {
      const results = await runParallelRequests(1, async (i) => {
        return i + 100;
      });

      expect(results).toHaveLength(1);
      expect(results).toEqual([100]);
    });

    it('should run 0 requests', async () => {
      const results = await runParallelRequests(0, async (i) => {
        return i;
      });

      expect(results).toHaveLength(0);
      expect(results).toEqual([]);
    });
  });

  describe('Order preservation', () => {
    it('should preserve order when requests complete at different times', async () => {
      const results = await runParallelRequests(5, async (i) => {
        // Random delay to simulate different completion times
        await new Promise((resolve) => setTimeout(resolve, Math.random() * 10));
        return i;
      });

      expect(results).toEqual([0, 1, 2, 3, 4]);
    });

    it('should preserve order with async operations', async () => {
      const callOrder: number[] = [];

      const results = await runParallelRequests(3, async (i) => {
        callOrder.push(i);
        await new Promise((resolve) => setTimeout(resolve, 5 - i)); // Reverse order
        return i * 10;
      });

      // Results should be in original order, not completion order
      expect(results).toEqual([0, 10, 20]);
    });
  });

  describe('Handler execution', () => {
    it('should pass correct index to handler', async () => {
      const indices: number[] = [];

      await runParallelRequests(5, async (i) => {
        indices.push(i);
        return i;
      });

      expect(indices).toEqual([0, 1, 2, 3, 4]);
    });

    it('should call handler for each request', async () => {
      const handler = vi.fn(async (i: number) => i * 2);

      await runParallelRequests(3, handler);

      expect(handler).toHaveBeenCalledTimes(3);
      expect(handler).toHaveBeenCalledWith(0);
      expect(handler).toHaveBeenCalledWith(1);
      expect(handler).toHaveBeenCalledWith(2);
    });

    it('should support different return types', async () => {
      interface MyType {
        id: number;
        value: string;
      }

      const results = await runParallelRequests<MyType>(3, async (i) => {
        return {
          id: i,
          value: `test-${i}`,
        };
      });

      expect(results).toHaveLength(3);
      expect(results).toEqual([
        { id: 0, value: 'test-0' },
        { id: 1, value: 'test-1' },
        { id: 2, value: 'test-2' },
      ]);
    });
  });

  describe('Error handling', () => {
    it('should propagate errors from handler', async () => {
      await expect(
        runParallelRequests(3, async (i) => {
          if (i === 1) {
            throw new Error('Test error');
          }
          return i;
        })
      ).rejects.toThrow('Test error');
    });

    it('should propagate errors from multiple handlers', async () => {
      await expect(
        runParallelRequests(5, async (i) => {
          if (i === 2 || i === 3) {
            throw new Error(`Error at ${i}`);
          }
          return i;
        })
      ).rejects.toThrow();
    });
  });

  describe('Parallelism', () => {
    it('should execute requests in parallel', async () => {
      const startTimes: number[] = [];
      const endTimes: number[] = [];

      await runParallelRequests(3, async (i) => {
        startTimes.push(Date.now());
        await new Promise((resolve) => setTimeout(resolve, 20));
        endTimes.push(Date.now());
        return i;
      });

      // Check that all started before the first finished
      const firstEnd = Math.min(...endTimes);
      const lastStart = Math.max(...startTimes);
      expect(lastStart).toBeLessThanOrEqual(firstEnd + 10); // Allow small margin
    });

    it('should handle large number of parallel requests', async () => {
      const results = await runParallelRequests(100, async (i) => {
        return i;
      });

      expect(results).toHaveLength(100);
      // Check a few random indices
      expect(results[0]).toBe(0);
      expect(results[50]).toBe(50);
      expect(results[99]).toBe(99);
    });
  });
});
