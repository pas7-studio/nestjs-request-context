# @pas7/nestjs-request-context

NestJS integration for @pas7/request-context-core with decorators & interceptors.

## Features

- RequestContextModule for easy configuration
- @Ctx() decorator for controller parameters
- ContextInterceptor for context enrichment
- ContextGuard for context validation
- Static service for context access

## Installation

```bash
pnpm add @pas7/nestjs-request-context
```

## Quickstart

```typescript
import { Module } from '@nestjs/common';
import { RequestContextModule } from '@pas7/nestjs-request-context';

@Module({
  imports: [
    RequestContextModule.forRoot(),
  ],
  controllers: [YourController],
})
export class AppModule {}
```

## Usage

```typescript
import { Controller, Get } from '@nestjs/common';
import { Ctx } from '@pas7/nestjs-request-context';
import { REQUEST_ID_KEY } from '@pas7/nestjs-request-context';

@Controller()
export class YourController {
  @Get()
  hello(@Ctx(REQUEST_ID_KEY) requestId: string) {
    return { requestId };
  }
}
```

## API

### RequestContextModule.forRoot(options?)

```typescript
interface RequestContextModuleOptions {
  header?: string;
  idGenerator?: () => string;
  mode?: 'minimal' | 'standard';
  keys?: {
    requestId?: string;
    route?: string;
    method?: string;
    ip?: string;
  };
}
```

### @Ctx(key?)

Decorator to inject context:
- `@Ctx()` - Returns full store
- `@Ctx(REQUEST_ID_KEY)` - Returns typed value

### RequestContextService

Static service:
```typescript
RequestContextService.get<T>(key: ContextKey<T>): T | undefined;
RequestContextService.set<T>(key: ContextKey<T>, value: T): void;
RequestContextService.getRequestId(): string | undefined;
```

## License

Apache-2.0
