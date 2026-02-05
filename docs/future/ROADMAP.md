# Roadmap

## Overview

This document outlines the planned future development of `@pas7/nestjs-request-context`.

## Version History

### v0.1.0 (Current) - MVP Release
- ✅ Core context management with AsyncLocalStorage
- ✅ NestJS integration with decorators & interceptors
- ✅ Express adapter (fully supported)
- ✅ Fastify adapter (middleware pattern, limited plugin support)
- ✅ Testkit for context validation
- ✅ 100% test coverage for core, Nest, and Express adapter
- ✅ Documentation and examples

## Planned Features

### v0.2.0 - Distributed Tracing Support
**Estimated:** Q2 2024

Features:
- Trace context propagation (trace ID, span ID)
- Manual trace propagation API
- Basic integration with OpenTelemetry
- W3C Trace Context format support

Acceptance Criteria:
- [ ] Trace context storage and retrieval
- [ ] Manual trace propagation
- [ ] Integration hooks for tracing libraries
- [ ] Documentation and examples

**Complexity:** Medium
**Impact:** High (enables microservices tracing)

### v0.3.0 - Debugging Tools
**Estimated:** Q3 2024

Features:
- Context Inspector for development
- Request Tracing
- Context Leak Detection
- Performance Profiling

Acceptance Criteria:
- [ ] Context Inspector implementation
- [ ] Leak detection with configurable threshold
- [ ] Performance profiling with sampling
- [ ] Integration with NestJS debug mode
- [ ] Documentation and examples

**Complexity:** Medium
**Impact:** High (improves developer experience)

### v0.4.0 - Enhanced Fastify Support
**Estimated:** Q3 2024

Features:
- Improved Fastify adapter with custom lifecycle wrapper
- Alternative storage mechanism for Fastify
- Full compatibility with Fastify plugins

Acceptance Criteria:
- [ ] Custom lifecycle wrapper implementation
- [ ] Alternative storage mechanism
- [ ] Full plugin support for Fastify
- [ ] E2E tests with 100+ parallel requests

**Complexity:** High
**Impact:** Medium (removes Fastify limitations)

### v0.5.0 - Advanced Context Features
**Estimated:** Q4 2024

Features:
- Context merging with conflict resolution strategies
- Context snapshotting for async operations
- Context propagation to background jobs
- Context-aware logging interceptors

Acceptance Criteria:
- [ ] Advanced merge strategies
- [ ] Snapshot & restore API
- [ ] Background job propagation
- [ ] Logging interceptors
- [ ] Documentation and examples

**Complexity:** Medium
**Impact:** Medium (adds advanced features)

### v1.0.0 - Production-Ready Release
**Estimated:** Q1 2025

Features:
- All v0.x features stabilized
- Complete TypeScript documentation
- Performance benchmarking suite
- Migration guide from v0.x
- Breaking changes documented

Acceptance Criteria:
- [ ] All features stable and tested
- [ ] Complete API documentation
- [ ] Performance benchmarks
- [ ] Migration guide
- [ ] 100% test coverage
- [ ] E2E tests for all platforms

**Complexity:** Low
**Impact:** High (stable production release)

## Future Considerations

### Potential Features (Not Planned Yet)

- **Redis-based Context**: Distribute context across multiple instances
- **GraphQL Integration**: Context propagation in GraphQL resolvers
- **WebSocket Support**: Context management for WebSocket connections
- **Context Analytics**: Analytics on context usage patterns
- **Context Security**: Encryption and access control for sensitive context data

### Dependencies on External Libraries

- OpenTelemetry SDK for distributed tracing
- Additional tracing library integrations (Zipkin, Jaeger, etc.)
- Logging library integrations (Winston, Pino, etc.)

### Performance Targets

- Context initialization: < 1ms
- Context access: < 0.1ms
- Memory overhead: < 1KB per request
- Zero impact when unused

### Community Contributions

We welcome community contributions for:
- Bug fixes
- Performance improvements
- New adapters (GraphQL, WebSocket, etc.)
- Documentation improvements
- Examples and tutorials

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for contribution guidelines.

## Change Process

This roadmap is a living document. Changes will be made based on:
- Community feedback
- Issue reports and feature requests
- Technological advancements
- Market demands

Major changes will be communicated through:
- GitHub issues
- Release notes
- Blog posts
- Community discussions

## Conclusion

The roadmap provides a clear path from the current MVP (v0.1) to a production-ready library with advanced features (v1.0). The phased approach ensures incremental improvements while maintaining stability and backward compatibility.
