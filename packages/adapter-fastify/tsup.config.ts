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
  external: [
    'fastify',
    '@nestjs/platform-fastify',
    '@nestjs/common',
    '@nestjs/core',
    'reflect-metadata',
    'rxjs',
    '@pas7/request-context-core',
    '@pas7/nestjs-request-context',
  ],
});
