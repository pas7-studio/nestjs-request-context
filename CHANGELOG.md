# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.1.0] - 2025-01-16

### Added
- All core packages (@pas7/nestjs-request-context, adapters, testkit)
- Full documentation with SEO optimization
- GitHub Actions CI/CD workflows
- Examples for Express and Fastify
- TypeScript support with full type definitions
- AsyncLocalStorage-based context storage
- Request context middleware for Express and Fastify
- NestJS decorators and interceptors for context management
- Testkit for easy testing of request context functionality

### Fixed
- Unhandled errors in nest package context interceptor tests
- Fastify adapter AsyncLocalStorage compatibility issue
- Testkit reflector issues in E2E tests
- Various TypeScript and build configuration issues
- Context isolation tests for Express adapter
- Error handling and context preservation in adapters

### Changed
- **@pas7/nestjs-request-context** - Enhanced context interceptor with proper async handling
- **@pas7/nestjs-request-context-adapter-fastify** - Added middleware pattern for better Fastify support
- **@pas7/nestjs-request-context-adapter-express** - Improved error handling and context preservation
- **@pas7/nestjs-request-context-testkit** - Fixed reflector compatibility issues

## [Unreleased]

### Migration guide
No breaking changes in this release.

### Contributors
- Pas7 Studio Team

---
