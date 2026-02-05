/**
 * Create a test NestJS application with Express adapter and request context
 */

import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import type { ModuleMetadata } from '@nestjs/common';
import { RequestContextModule } from '@pas7/nestjs-request-context';
import type { RequestContextModuleOptions } from '@pas7/nestjs-request-context';
import { requestContextMiddleware } from '@pas7/nestjs-request-context-adapter-express';
import type { RequestContextExpressOptions } from '@pas7/nestjs-request-context-adapter-express';

/**
 * Options for creating test app with Express adapter
 */
export interface CreateTestAppExpressOptions {
  /** Module metadata for custom module configuration */
  module?: ModuleMetadata;
  /** Options for Express adapter */
  adapterOptions?: RequestContextExpressOptions;
  /** Options for RequestContextModule */
  contextModuleOptions?: RequestContextModuleOptions;
}

/**
 * Result from createTestAppExpress
 */
export interface CreateTestAppExpressResult {
  /** The NestJS application instance */
  app: INestApplication;
  /** The testing module instance */
  module: TestingModule;
  /** Function to close the application */
  close: () => Promise<void>;
}

/**
 * Create a test NestJS application with Express adapter and request context configured
 *
 * @example
 * ```typescript
 * const { app, close } = await createTestAppExpress({
 *   module: {
 *     controllers: [TestController],
 *   },
 * });
 *
 * const response = await request(app.getHttpServer())
 *   .get('/test')
 *   .expect(200);
 *
 * expect(response.body.requestId).toBeDefined();
 *
 * await close();
 * ```
 *
 * @param options - Configuration options
 * @returns Promise with app, module and close function
 */
export async function createTestAppExpress(
  options: CreateTestAppExpressOptions = {}
): Promise<CreateTestAppExpressResult> {
  const { module: moduleMetadata, adapterOptions, contextModuleOptions } = options;

  // Create testing module with RequestContextModule
  const moduleRef: TestingModule = await Test.createTestingModule({
    imports: [RequestContextModule.forRoot(contextModuleOptions)],
    ...moduleMetadata,
  }).compile();

  // Create app with default Express adapter
  const app: INestApplication = moduleRef.createNestApplication();

  // Use request context middleware on the underlying Express instance
  const expressInstance = app.getHttpAdapter().getInstance();
  expressInstance.use(requestContextMiddleware(adapterOptions));

  // Initialize app
  await app.init();

  return {
    app,
    module: moduleRef,
    close: async () => {
      await app.close();
      await moduleRef.close();
    },
  };
}
