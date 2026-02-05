/**
 * Create a test NestJS application with Fastify adapter and request context
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import type { ModuleMetadata } from '@nestjs/common';
import { RequestContextModule } from '@pas7/nestjs-request-context';
import type { RequestContextModuleOptions } from '@pas7/nestjs-request-context';
import { requestContextPlugin } from '@pas7/nestjs-request-context-adapter-fastify';
import type { RequestContextFastifyOptions } from '@pas7/nestjs-request-context-adapter-fastify';

/**
 * Options for creating test app with Fastify adapter
 */
export interface CreateTestAppFastifyOptions {
  /** Module metadata for custom module configuration */
  module?: ModuleMetadata;
  /** Options for Fastify adapter */
  adapterOptions?: RequestContextFastifyOptions;
  /** Options for RequestContextModule */
  contextModuleOptions?: RequestContextModuleOptions;
}

/**
 * Result from createTestAppFastify
 */
export interface CreateTestAppFastifyResult {
  /** The NestJS application instance */
  app: INestApplication;
  /** The testing module instance */
  module: TestingModule;
  /** Function to close the application */
  close: () => Promise<void>;
}

/**
 * Create a test NestJS application with Fastify adapter and request context configured
 *
 * @example
 * ```typescript
 * const { app, close } = await createTestAppFastify({
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
export async function createTestAppFastify(
  options: CreateTestAppFastifyOptions = {},
): Promise<CreateTestAppFastifyResult> {
  const {
    module: moduleMetadata,
    adapterOptions,
    contextModuleOptions,
  } = options;

  // Create testing module with RequestContextModule
  const moduleRef: TestingModule = await Test.createTestingModule({
    imports: [RequestContextModule.forRoot(contextModuleOptions)],
    ...moduleMetadata,
  }).compile();

  // Create app with Fastify adapter using NestFactory
  const app = await NestFactory.create(moduleRef, new FastifyAdapter());

  // Register request context plugin on underlying Fastify instance
  const fastifyInstance = app.getHttpAdapter().getInstance();
  await fastifyInstance.register(requestContextPlugin, adapterOptions);

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
