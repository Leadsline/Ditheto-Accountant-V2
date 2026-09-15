---
name: Post-merge setup timing
description: Timeout guidance for the automatic dependency and database setup after task merges.
---

Keep a meaningful buffer on the post-merge timeout. In this workspace, a clean dependency install followed by the idempotent schema check can take more than 20 seconds even when no schema changes are needed.

**Why:** A successful setup was killed just after the dependency step completed because the configured timeout was shorter than the normal install-plus-database-check duration.

**How to apply:** When the post-merge script remains simple and non-interactive, prefer increasing its configured timeout rather than adding unnecessary retries or changing the database command.