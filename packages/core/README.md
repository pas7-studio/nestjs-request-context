# @pas7/request-context-core

Framework-agnostic request context primitives built on AsyncLocalStorage.

## When to use

Use this package if you need request context outside NestJS abstractions, or when building custom integrations.

## Installation

```bash
pnpm add @pas7/request-context-core
```

## Quick example

```ts
import { ContextKey, get, run, set } from '@pas7/request-context-core';

const REQUEST_ID = new ContextKey<string>('requestId');

run({ requestId: 'req-1' }, () => {
  const id = get(REQUEST_ID);
  set(REQUEST_ID, `${id}-next`);
});
```

## Main API

- `Context`, `ContextKey`
- `run`, `get`, `set`, `has`, `require`, `merge`
- `snapshot`, `restore`
- `KeyExistsError`, `ContextMissingError`, `ContextNotActiveError`, `ContextKeyCollisionError`

## Related

- Root docs: `README.md`
- Changelog: `CHANGELOG.md`
- NestJS module: `@pas7/nestjs-request-context`

## About

Developed by **PAS7** - [https://pas7.com.ua/](https://pas7.com.ua/)

- 📖 Article: [NestJS Request Context with ALS](https://pas7.com.ua/blog/en/nestjs-request-context-als-2026)
- 📧 Contact: [https://pas7.com.ua/contact](https://pas7.com.ua/contact)

## License

Apache-2.0
