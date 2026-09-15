---
name: Vercel Clerk proxy
description: Clerk proxy behavior for the externally hosted Vercel deployment.
---

When the Vercel build contains a development Clerk publishable key (`pk_test_…`), bypass the `/api/__clerk` proxy and let Clerk use its direct development frontend API. Clerk rejects a development key when it is sent through the production proxy host with `host_invalid`.

**Why:** The externally hosted Vercel project can retain Replit development environment variables even though Vercel reports `production`; Replit-managed production publishing swaps keys automatically, but Vercel does not.

**How to apply:** Keep the proxy enabled for `pk_live_…` keys. Treat the direct development path as a compatibility bridge until Vercel is configured with the production Clerk key and secret.