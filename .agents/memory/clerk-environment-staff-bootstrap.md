---
name: Clerk environment staff bootstrap
description: How to initialize secure staff access when development and production Clerk instances share one application database.
---

Treat each Clerk issuer as a separate identity environment when initializing the first portal owner. A global “staff table is empty” check is incorrect when development and production share the same application database because their Clerk user IDs do not match.

**Why:** Development staff rows made the shared table non-empty, which prevented the first production user from receiving portal ownership even though no production identity had been initialized.

**How to apply:** Claim one immutable initialization marker per Clerk issuer and assign Super Admin only to the authenticated user who atomically creates that marker. Require explicit staff provisioning for every later user in that issuer.