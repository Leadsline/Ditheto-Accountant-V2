---
name: Drizzle push schema drift
description: Development schema pushes can stop on an interactive team_members uniqueness/truncation prompt.
---

The development database currently has schema drift that makes `drizzle-kit push` ask whether to truncate existing `team_members` rows before applying a uniqueness change.

**Why:** A non-interactive workspace check cannot answer that destructive prompt safely, and truncating the published roster would be unacceptable.

**How to apply:** Treat this prompt as a migration review point. Do not force or truncate the table; inspect the intended schema change and use the project’s documented database migration path.