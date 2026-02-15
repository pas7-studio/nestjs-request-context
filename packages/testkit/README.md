# @pas7/nestjs-request-context-testkit

Test utilities for validating request-context isolation and concurrency behavior.

## When to use

Use this package in integration/e2e tests to assert there is no context leak across parallel requests.

## Installation

```bash
pnpm add -D @pas7/nestjs-request-context-testkit
```

## Quick example

```ts
import {
  assertNoLeak,
  createTestAppFastify,
  runParallelRequests,
} from '@pas7/nestjs-request-context-testkit';

const testApp = await createTestAppFastify({
  module: { controllers: [TestController] },
});

const responses = await runParallelRequests(50, (i) =>
  request(testApp.app.getHttpServer()).get(`/test/${i}`).expect(200)
);

assertNoLeak(responses.map((r) => r.body));
```

## Exports

- `createTestAppFastify`
- `createTestAppExpress`
- `runParallelRequests`
- `assertNoLeak`
- `ContextLeakError`

## Related

- Root docs: `README.md`
- Changelog: `CHANGELOG.md`
- Main package: `@pas7/nestjs-request-context`

## About

Developed by **PAS7** - [https://pas7.com.ua/](https://pas7.com.ua/)

- 📖 Article: [NestJS Request Context with ALS](https://pas7.com.ua/blog/en/nestjs-request-context-als-2026)
- 📧 Contact: [https://pas7.com.ua/contact](https://pas7.com.ua/contact)

## License

Apache-2.0
