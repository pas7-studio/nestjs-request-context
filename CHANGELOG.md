# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.3.5] - 2025-01-XX

### Fixed
- **CRITICAL**: Fastify AsyncLocalStorage context loss - plugin now uses sync hook with `done()` callback instead of async/await
- **CRITICAL**: Memory leak in `Context.restore()` - creates new Map instead of mutating existing store
- **CRITICAL**: Express middleware async error handling - removed ineffective try-catch that swallowed errors
- Type safety in `RequestContextService` using `REQUEST_ID_KEY` constant instead of magic strings

### Added
- `Context.clear()` method for explicit context cleanup after request completion
- `Store.clear()` method to clear all entries from the store
- `Store.reset()` method to replace store with new data
- `useGlobalInterceptor` option in `forRoot()` and `forRootAsync()` to disable auto-registration of global interceptor
- Deep copy in `Context.snapshot()` using `structuredClone` to prevent mutation of nested objects

### Changed
- `NestInterceptor` in adapter packages now properly initializes context before request processing
- Improved error handling documentation in README.md
- `Context.restore()` now uses `Store.reset()` internally to avoid memory leaks

### Tests
- Added 59 new tests (249 → 308 total)
- Added memory leak tests to verify `Context.restore()` behavior
- Added deep copy snapshot tests to verify isolation
- Added `forRootAsync` options tests for `useGlobalInterceptor` feature

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
