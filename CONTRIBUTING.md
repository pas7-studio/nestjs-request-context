# Contributing to @pas7/nestjs-request-context

Thank you for your interest in contributing!

## Development Setup

### Prerequisites

- Node.js >= 20 (recommended 22)
- pnpm package manager

### Installation

```bash
git clone <repo>
cd nestjs-request-context
pnpm install
```

### Project Structure

```
.
├─ packages/
│  ├─ core/                 # Core context management
│  ├─ nest/                 # NestJS integration
│  ├─ adapter-fastify/      # Fastify adapter
│  ├─ adapter-express/      # Express adapter
│  └─ testkit/              # Testing utilities
├─ examples/
│  ├─ fastify-app/          # Fastify example
│  └─ express-app/          # Express example
└─ .github/workflows/       # CI/CD
```

### Building

```bash
pnpm build          # Build all packages
cd packages/core && pnpm build  # Build specific package
```

### Testing

```bash
pnpm test           # Run all tests
pnpm test:unit      # Run unit tests
pnpm test:e2e       # Run E2E tests
```

### Linting & Formatting

```bash
pnpm lint           # Run ESLint
pnpm format         # Run Prettier
```

## Code Style

- Use TypeScript with `strict: true`
- No `any` types allowed
- Use ContextKey<T> for typed store access
- Follow existing code patterns
- Write tests for all changes

## Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: fix bug
docs: update documentation
test: add tests
refactor: refactor code
```

## Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run `pnpm lint` and `pnpm test`
6. Submit a pull request

## License

By contributing, you agree that your contributions will be licensed under the Apache-2.0 license.
