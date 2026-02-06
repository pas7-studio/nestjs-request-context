import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@pas7/request-context-core': path.resolve(__dirname, '../../core/src'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.{test,spec,e2e-spec}.{js,ts}'],
  },
});
