# @pas7/nestjs-request-context-testkit

Testing utilities for @pas7/nestjs-request-context.

## Features

- createTestAppFastify() - Create Fastify test app
- createTestAppExpress() - Create Express test app
- runParallelRequests() - Run parallel requests
- assertNoLeak() - Validate context isolation

## Installation

```bash
pnpm add -D @pas7/nestjs-request-context-testkit
```

## Usage

```typescript
import { createTestAppFastify, runParallelRequests, assertNoLeak } from '@pas7/nestjs-request-context-testkit';

describe('Context isolation', () => {
  let app: NestApplication;

  beforeAll(async () => {
    const testApp = await createTestAppFastify({
      module: {
        controllers: [TestController],
      },
    });
    app = testApp.app;
  });

  it('should not leak context between 100 parallel requests', async () => {
    const results = await runParallelRequests(100, async (i) => {
      return await request(app.getHttpServer())
        .get(`/test/${i}`)
        .expect(200);
    });

    assertNoLeak(results.map((r) => r.body));
  });
});
```

## API

### createTestAppFastify(options?)
Creates NestApplication with FastifyAdapter and context.

### createTestAppExpress(options?)
Creates NestApplication with ExpressAdapter and context.

### runParallelRequests(n, handler)
Runs n parallel requests and returns results in order.

### assertNoLeak(results)
Validates that contexts don't leak between requests.

## License

Apache-2.0
