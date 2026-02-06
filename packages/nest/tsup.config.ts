import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  splitting: false,
  sourcemap: true,
  shims: true,
  target: 'node20',
  external: ['@nestjs/common', '@nestjs/core', 'reflect-metadata', 'rxjs', '@pas7/request-context-core'],
  tsconfig: './tsconfig.json',
});
