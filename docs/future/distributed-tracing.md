# Distributed Tracing Support

## Overview

Distributed tracing is a valuable feature for modern applications that need to track requests across multiple services. This document outlines potential support for distributed tracing in `@pas7/nestjs-request-context`.

## Proposed Features

### 1. Trace Context Propagation

Support for W3C Trace Context format:

```typescript
interface TraceContext {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  sampled: boolean;
}
```

#### Implementation Options

**Option A: Auto-propagation with OpenTelemetry**

```typescript
import { TraceContextModule } from '@pas7/nestjs-request-context';
import { trace } from '@opentelemetry/api';

@Module({
  imports: [
    TraceContextModule.forRoot({
      mode: 'auto', // Auto-detect and use OpenTelemetry
    }),
  ],
})
export class AppModule {}
```

**Option B: Manual Propagation**

```typescript
import { runWithTrace } from '@pas7/nestjs-request-context';

runWithTrace(
  {
    traceId: 'abc123',
    spanId: 'def456',
  },
  async () => {
    // Your logic
  }
);
```

### 2. Integration with Popular Tracing Libraries

- OpenTelemetry
- Zipkin
- Jaeger
- DataDog
- New Relic

### 3. Automatic Trace Header Management

```typescript
@Module({
  imports: [
    RequestContextModule.forRoot({
      tracing: {
        enabled: true,
        format: 'w3c', // w3c | b3 | jaeger | zipkin
        headers: {
          traceId: 'traceparent',
          spanId: 'span-id',
        },
      },
    }),
  ],
})
export class AppModule {}
```

### 4. Trace Context API

```typescript
// Get current trace context
const trace = RequestContextService.getTraceContext();

// Start a new span
const span = RequestContextService.startSpan('operation-name');
// ... do work ...
span.end();

// Continue trace in downstream services
const traceContext = RequestContextService.getTraceContext();
fetch('http://downstream-service', {
  headers: {
    'traceparent': traceContext.toW3CFormat(),
  },
});
```

## Use Cases

1. **Microservices**: Track requests across multiple services
2. **API Gateways**: Maintain trace context through routing
3. **Background Jobs**: Propagate trace context to async operations
4. **External APIs**: Include trace context in outbound requests

## Integration Examples

### OpenTelemetry Integration

```typescript
import { context, trace } from '@opentelemetry/api';
import { run } from '@pas7/request-context-core';

// Auto-integrate with OpenTelemetry
run(
  { requestId: '123' },
  () => {
    const tracer = trace.getTracer('my-service');
    const span = tracer.startSpan('operation', {}, context.active());
    // ... work ...
    span.end();
  }
);
```

### Microservices Communication

```typescript
import { ClientProxy } from '@nestjs/microservices';
import { RequestContextService } from '@pas7/nestjs-request-context';

@Injectable()
export class OrderService {
  constructor(private client: ClientProxy) {}
  
  async createOrder(data: any) {
    // Get current trace context
    const traceContext = RequestContextService.getTraceContext();
    
    // Send to downstream service with trace context
    return this.client.send('order.create', data, {
      headers: {
        'traceparent': traceContext.toW3CFormat(),
      },
    });
  }
}
```

## Performance Considerations

- Minimal overhead for trace context storage
- Asynchronous trace propagation
- Efficient span management
- Sampling support to reduce overhead

## Future Phases

### Phase 1: Basic Trace Context (v0.2)
- Trace ID and span ID storage
- Manual trace propagation
- Basic API for trace management

### Phase 2: Auto-propagation (v0.3)
- W3C Trace Context format support
- Automatic header management
- Integration hooks for popular tracing libraries

### Phase 3: Advanced Features (v1.0)
- Span aggregation
- Trace sampling
- Integration with tracing dashboards
- Export to multiple backends

## Alternatives Considered

1. **Existing Solutions**: OpenTelemetry SDK, but requires more setup
2. **Custom Implementation**: More control, but higher maintenance
3. **Hybrid**: Best of both - use OpenTelemetry where possible, custom where needed

## Conclusion

Distributed tracing support would significantly enhance the library's value proposition, especially for microservices architectures. The phased approach allows for incremental implementation while maintaining backward compatibility.
