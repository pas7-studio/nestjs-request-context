<!-- File: docs/future/ROADMAP.md -->
# Product Roadmap

This document describes the planned product direction for `@pas7/nestjs-request-context`.

The roadmap is version-based and intentionally does not include calendar dates.

## Guiding Direction

- Prioritize developer experience and maintainability first
- Keep runtime overhead near parity with native alternatives
- Provide practical production tooling (migration, diagnostics, observability)
- Preserve API stability and predictable upgrade paths

## v0.4 - DX Foundation

Focus: reduce adoption friction and improve day-1 usability.

Planned items:

- Migration guide from NestJS request-scoped providers
- Troubleshooting guide for common context issues
- Recommended architecture patterns for controllers/services
- Production-ready recipes: correlation ID propagation, tenant and locale context, audit logging enrichment
- Expanded testkit examples for parallel isolation checks

Success criteria:

- New users can complete setup and first working flow quickly
- Fewer support issues about missing context/middleware order
- Clear migration path for existing NestJS codebases

## v0.5 - Operational Tooling

Focus: improve visibility and confidence in production.

Planned items:

- Optional debug mode for context lifecycle diagnostics
- Typed key registry helper (for large-team consistency)
- Logging bridge examples/integrations (Pino/Winston)
- OpenTelemetry integration recipes
- Better compatibility matrix for NestJS lifecycle hooks

Success criteria:

- Faster root-cause analysis for context bugs
- Less key naming drift and key-collision risk
- Easier observability integration without custom boilerplate

## v0.6 - Platform Hardening

Focus: reliability and ecosystem readiness.

Planned items:

- Stronger Fastify guidance and validation scenarios
- Performance guardrails in CI (regression thresholds)
- Extended benchmarks against common alternatives
- Security/documentation guidance for sensitive context data
- More complete enterprise rollout checklist

Success criteria:

- Regression detection becomes automatic in CI
- Performance stays stable across releases
- Teams can adopt with a documented rollout process

## v1.0 - Stability Milestone

Focus: stable long-term contract and mature docs.

Planned items:

- API stabilization and deprecation policy
- Complete docs pass (reference + guides + migration notes)
- Clear support policy for supported Node/Nest versions
- Release quality checklist and compatibility guarantees

Success criteria:

- Predictable upgrades with minimal surprises
- Documentation is sufficient for enterprise onboarding
- Strong confidence in production usage

## Backlog Candidates

These items are valuable but not committed to a specific version:

- GraphQL and WebSocket context recipes
- Distributed context patterns for multi-instance systems
- Additional logging and tracing ecosystem adapters
- Advanced context governance (allowlist/denylist/redaction)

## Change Policy

The roadmap is a living document and may be adjusted based on:

- User feedback
- Production findings
- Ecosystem and platform changes
- Maintenance and reliability priorities
