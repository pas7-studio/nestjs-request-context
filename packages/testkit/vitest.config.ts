import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@pas7/request-context-core': path.resolve(__dirname, '../core/src'),
      '@pas7/nestjs-request-context': path.resolve(__dirname, '../nest/src'),
      '@pas7/nestjs-request-context-adapter-express': path.resolve(__dirname, '../adapter-express/src'),
      '@pas7/nestjs-request-context-adapter-fastify': path.resolve(__dirname, '../adapter-fastify/src'),
    },
  },
  test: {
    include: ['src/**/*.test.ts'],
    globals: true,
    environment: 'node',
    testTimeout: 10000,
    hookTimeout: 20000,
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/*.d.ts',
      ],
    },
  },
  esbuild: {
    tsconfigRaw: {
      compilerOptions: {
        experimentalDecorators: true,
      },
    },
  },
});
