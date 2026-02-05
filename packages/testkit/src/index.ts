/**
 * Testing utilities for NestJS request context
 *
 * @packageDocumentation
 */

// Test app factories
export { createTestAppFastify } from './create-test-app-fastify.js';
export type {
  CreateTestAppFastifyOptions,
  CreateTestAppFastifyResult,
} from './create-test-app-fastify.js';

export { createTestAppExpress } from './create-test-app-express.js';
export type {
  CreateTestAppExpressOptions,
  CreateTestAppExpressResult,
} from './create-test-app-express.js';

// Parallel request utility
export { runParallelRequests } from './run-parallel-requests.js';

// Context leak detection
export { assertNoLeak, ContextLeakError } from './assert-no-leak.js';
