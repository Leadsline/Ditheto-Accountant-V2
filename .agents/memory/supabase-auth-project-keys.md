---
name: Supabase Auth project keys
description: Project-specific Supabase Auth key and RLS constraints for this workspace
---

Use the active Ditheto Supabase project's publishable key for password sign-in, user lookup, and password recovery. Keep admin role reads scoped by an authenticated user's own `user_id`; do not fall back to a service-role key that belongs to a different Supabase project.

**Why:** The workspace has had multiple Supabase connections and environment keys, and a service-role key or connector can return 401 when it targets a different project. The active project exposes a valid publishable key, while RLS can safely permit each authenticated user to read only their own role.

**How to apply:** Before changing Supabase Auth, confirm `SUPABASE_URL` and its publishable key refer to the same active project, then verify login, `/api/auth/me`, and one protected admin route end to end.