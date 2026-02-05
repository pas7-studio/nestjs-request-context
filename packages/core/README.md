# @pas7/request-context-core

Core context management library with AsyncLocalStorage for request-scoped data storage.

## Features

- Type-safe store access with ContextKey<T>
- AsyncLocalStorage-based context isolation
- Snapshot & restore support
- Set policies (deny, overwrite, ignore)

## Installation

```bash
pnpm add @pas7/request-context-core
```

## Usage

```typescript
import { run, get, set, ContextKey } from '@pas7/request-context-core';

const REQUEST_ID_KEY = new ContextKey<string>('requestId');

run(
  { requestId: '123' },
  () => {
    const id = get(REQUEST_ID_KEY); // '123'
    set(REQUEST_ID_KEY, '456');
  },
);
```

## API

- `run(initial, fn)` - Execute function in context
- `get<T>(key)` - Get value from store
- `set<T>(key, value, policy?)` - Set value in store
- `has<T>(key)` - Check if key exists
- `require<T>(key)` - Get value or throw error
- `merge(data, policy?)` - Merge data into store
- `snapshot()` - Capture context snapshot
- `restore(snapshot)` - Restore context snapshot

## License

Apache-2.0
