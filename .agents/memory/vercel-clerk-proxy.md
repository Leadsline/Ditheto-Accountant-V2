---
name: Vercel Clerk proxy
description: Clerk proxy behavior for the externally hosted Vercel deployment.
---

For an external Clerk Production instance configured in proxy-domain mode, the frontend, Express middleware, and Vercel function route must use the exact proxy URL registered on the Clerk domain. For this portal that path is `/__clerk`, not `/api/__clerk`.

**Why:** A mismatched proxy URL makes Clerk return `host_invalid`. Disabling the proxy is not a valid fallback for this instance because its live key resolves through a custom `clerk.*.vercel.app` host that cannot complete TLS, leaving the auth page blank.

**How to apply:** Keep `/__clerk` enabled for `pk_live_…` builds and verify `/__clerk/v1/client` plus `/__clerk/v1/environment` return 200 on the canonical alias. Development `pk_test_…` builds should continue using their direct frontend API.

Vercel's canonical `CLERK_PUBLISHABLE_KEY` can itself still be configured with a `pk_test_…` value. Removing a stale `VITE_CLERK_PUBLISHABLE_KEY` override is not sufficient unless the replacement value is verified as live.

**Why:** A rebuilt bundle can be healthy and render sign-in while still showing Clerk's Development mode when the linked Vercel production environment contains development credentials.

**How to apply:** Inspect the compiled public bundle for the active key environment and confirm the live alias in a real browser before declaring production sign-in ready; configure Clerk Production credentials, proxy URL, and allowed origins separately from the source fallback.