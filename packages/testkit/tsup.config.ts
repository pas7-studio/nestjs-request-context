import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: false,
  clean: true,
  splitting: false,
  sourcemap: true,
  shims: true,
  target: 'node20',
  external: [
    // NestJS packages
    '@nestjs/common',
    '@nestjs/core',
    '@nestjs/platform-express',
    '@nestjs/platform-fastify',
    '@nestjs/testing',
    '@nestjs/microservices',
    '@nestjs/websockets',
    '@nestjs/websockets/socket-module',
    '@nestjs/microservices/microservices-module',
    // Fastify
    'fastify',
    '@fastify/static',
    // Validation
    'class-validator',
    'class-transformer',
    // Express
    'express',
    // Core packages
    '@pas7/request-context-core',
    '@pas7/nestjs-request-context',
    '@pas7/nestjs-request-context-adapter-express',
    '@pas7/nestjs-request-context-adapter-fastify',
  ],
  noExternal: ['create-test-app-fastify.ts', 'create-test-app-express.ts', 'run-parallel-requests.ts', 'assert-no-leak.ts'],
});
