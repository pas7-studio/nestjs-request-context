import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: false, // Temporarily disabled due to TypeScript resolution issues with .js extensions
  clean: true,
  splitting: false,
  sourcemap: true,
  shims: true,
  target: 'node20',
  external: [],
  noExternal: ['create-test-app-fastify.ts', 'create-test-app-express.ts', 'run-parallel-requests.ts', 'assert-no-leak.ts'],
});
