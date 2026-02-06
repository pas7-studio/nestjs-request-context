import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@pas7/request-context-core': path.resolve(__dirname, '../core/src'),
      '@pas7/nestjs-request-context': path.resolve(__dirname, '../nest/src'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.test.ts', '**/*.spec.ts', '**/*.e2e-spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/*.e2e-spec.ts',
        '**/*.d.ts',
      ],
    },
  },
});
