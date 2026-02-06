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
  external: [
    'express',
    '@nestjs/platform-express',
    '@nestjs/common',
    '@nestjs/core',
    'reflect-metadata',
    'rxjs',
    '@pas7/request-context-core',
    '@pas7/nestjs-request-context',
  ],
  tsconfig: './tsconfig.json',
  tsconfigResolvePaths: true,
});
