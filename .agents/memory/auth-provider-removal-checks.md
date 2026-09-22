---
name: Auth-provider removal checks
description: Durable verification guidance when removing a third-party authentication provider from a monorepo.
---

When removing an authentication provider, verify both source/configuration references and dependency resolution. A successful typecheck is not enough: compiled assets, environment examples, Vercel routing, lockfile importers, generated API code, and old auth-dependent UI can retain the provider.

**Why:** Provider removal can appear complete while a stale production key guard, proxy route, package importer, or generated client still reintroduces the dependency during deployment.

**How to apply:** Finish with a case-insensitive repository scan that excludes only generated build output and unrelated user-provided assets, then run a frozen-lockfile production build and exercise the public route plus API health endpoint.