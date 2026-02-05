# Fastify App Example

Simple NestJS + Fastify application demonstrating @pas7/nestjs-request-context.

## Installation

```bash
pnpm install
pnpm build
```

## Running

```bash
npm start
```

## Endpoints

- `GET /` - Returns hello message with requestId
- `GET /user/:id` - Returns user info with requestId
- `GET /error` - Demonstrates error handling with context preservation

## Features Demonstrated

- RequestContextModule.forRoot with standard mode
- Fastify adapter integration
- @Ctx() decorator usage
- Context preservation in error flows
