import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@pas7/request-context-core': path.resolve(__dirname, '../../core/src'),
      '@pas7/nestjs-request-context': path.resolve(__dirname, '../../nest/src'),
      '@pas7/nestjs-request-context-adapter-fastify': path.resolve(__dirname, '../src'),
    },
  },
  test: {
    include: ['**/*.e2e-spec.ts'],
    exclude: ['**/node_modules/**', '**/dist/**'],
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
