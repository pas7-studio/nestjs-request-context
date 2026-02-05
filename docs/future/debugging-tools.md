# Debugging Tools

## Overview

Debugging request context issues can be challenging. This document outlines potential debugging tools and utilities to make it easier to diagnose problems.

## Proposed Features

### 1. Context Inspector

A development-mode utility to inspect and debug request contexts:

```typescript
import { ContextInspector } from '@pas7/nestjs-request-context/debug';

// In development mode
if (process.env.NODE_ENV === 'development') {
  ContextInspector.enable();
}

// Get current context info
const info = ContextInspector.getDebugInfo();
console.log(info);
/*
{
  active: true,
  requestId: 'abc123',
  store: { requestId: 'abc123', userId: 'user-456' },
  stackTrace: [...],
  timestamp: '2024-01-01T12:00:00.000Z'
}
*/
```

### 2. Context Visualization

Visual representation of context propagation:

```typescript
import { ContextVisualizer } from '@pas7/nestjs-request-context/debug';

// Visualize context tree
ContextVisualizer.visualize();
/*
Request Flow:
┌─ Context Start (abc123)
│  ├─ Set userId: user-456
│  ├─ Set role: admin
│  ├─ Async Operation 1
│  │   ├─ Context preserved (abc123)
│  │   └─ Set order: order-789
│  └─ Response
│     └─ Context preserved (abc123)
└─ Context End
*/
```

### 3. Context Leak Detection

Automated detection of context leaks:

```typescript
import { ContextLeakDetector } from '@pas7/nestjs-request-context/debug';

// Enable leak detection
ContextLeakDetector.enable({
  threshold: 1000, // Warn if context lives longer than 1 second
  sampleRate: 0.1, // Sample 10% of requests
});

// Automatic warnings
// ⚠️ Potential context leak detected for request abc123 (alive for 1.5s)
```

### 4. Performance Profiling

Profile context access patterns:

```typescript
import { ContextProfiler } from '@pas7/nestjs-request-context/debug';

// Start profiling
ContextProfiler.start();

// ... run some requests ...

// Get profile
const profile = ContextProfiler.getProfile();
console.log(profile);
/*
{
  totalRequests: 100,
  averageContextSize: 256 bytes,
  averageContextAccessTime: 0.001ms,
  hotKeys: ['requestId', 'userId', 'role'],
  coldKeys: ['customData', 'metadata']
}
*/
```

### 5. Request Tracing

Detailed trace of all context operations:

```typescript
import { RequestTracer } from '@pas7/nestjs-request-context/debug';

// Enable request tracing
RequestTracer.enable();

// Get trace for specific request
const trace = RequestTracer.getTrace('request-id-abc123');
console.log(trace);
/*
[
  { type: 'context-start', timestamp: 0, data: { requestId: 'abc123' } },
  { type: 'set', timestamp: 1, data: { key: 'userId', value: 'user-456' } },
  { type: 'get', timestamp: 2, data: { key: 'userId' } },
  { type: 'async-operation', timestamp: 3, data: { operation: 'db-query' } },
  { type: 'context-end', timestamp: 100, data: { duration: 100ms } }
]
*/
```

### 6. Integration with NestJS Debug Mode

```typescript
@Module({
  imports: [
    RequestContextModule.forRoot({
      debug: {
        enabled: process.env.NODE_ENV === 'development',
        inspector: true,
        visualizer: true,
        leakDetector: true,
        profiler: true,
        tracer: true,
      },
    }),
  ],
})
export class AppModule {}
```

## Use Cases

1. **Development**: Quickly diagnose context issues during development
2. **Testing**: Verify context propagation in tests
3. **Performance Tuning**: Identify bottlenecks in context access
4. **Production Monitoring**: Detect context leaks and performance issues

## Integration Examples

### Context Inspector in Controllers

```typescript
import { Controller, Get } from '@nestjs/common';
import { ContextInspector } from '@pas7/nestjs-request-context/debug';

@Controller()
export class DebugController {
  @Get('debug/context')
  getContext() {
    // Only available in development mode
    if (ContextInspector.isEnabled()) {
      return ContextInspector.getDebugInfo();
    }
    
    return { message: 'Debug mode is disabled' };
  }
}
```

### Context Leak Detection in Tests

```typescript
import { ContextLeakDetector } from '@pas7/nestjs-request-context/debug';

describe('Context leak detection', () => {
  beforeAll(() => {
    ContextLeakDetector.enable({
      threshold: 100,
    });
  });
  
  afterAll(() => {
    ContextLeakDetector.disable();
  });
  
  it('should not leak context', async () => {
    await run({ requestId: '123' }, async () => {
      // Test code
    });
    
    // No leak warning should be emitted
  });
});
```

## Performance Considerations

- Debug tools should be zero-overhead when disabled
- Sampling for expensive operations (leak detection, profiling)
- Lazy initialization of debug utilities
- Production-safe defaults (disabled by default)

## Future Phases

### Phase 1: Basic Debugging (v0.2)
- Context Inspector
- Request Tracing
- Development-mode integration

### Phase 2: Advanced Debugging (v0.3)
- Context Visualization
- Context Leak Detection
- Performance Profiling

### Phase 3: Integration (v1.0)
- Integration with debuggers (Chrome DevTools, VS Code)
- Trace export to external tools
- Automated issue detection

## Security Considerations

- Debug tools should be disabled in production
- Sensitive data should be filtered from debug output
- Access control for debug endpoints
- Audit logging for debug operations

## Conclusion

Debugging tools would significantly improve developer experience and help diagnose context-related issues quickly. The phased approach ensures minimal impact on performance while providing powerful debugging capabilities.
