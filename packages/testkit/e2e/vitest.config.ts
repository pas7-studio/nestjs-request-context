import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@pas7/request-context-core': path.resolve(__dirname, '../../core/dist/index.js'),
      '@pas7/nestjs-request-context': path.resolve(__dirname, '../../nest/dist/index.js'),
      '@pas7/nestjs-request-context-adapter-express': path.resolve(__dirname, '../../adapter-express/dist/index.js'),
      '@pas7/nestjs-request-context-adapter-fastify': path.resolve(__dirname, '../../adapter-fastify/dist/index.js'),
    },
  },
  test: {
    environment: 'node',
    include: ['e2e/testkit.e2e-spec.ts'],
    testTimeout: 30000,
    hookTimeout: 60000,
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
  },
  esbuild: {
    tsconfigRaw: {
      compilerOptions: {
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
      },
    },
  },
});
