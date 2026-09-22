---
name: Supabase missing-object responses
description: Supabase Storage's response shape for missing objects and the required application mapping
---

Supabase Storage may return HTTP 400 for a missing object while the JSON body identifies `statusCode: 404` and `code: "NoSuchKey"`. Treat that response as an application-level 404, not a Storage outage.

**Why:** The public object endpoint otherwise converted normal missing assets into HTTP 500 responses, making absent media look like a broken Supabase configuration.

**How to apply:** When wrapping Supabase Storage download or HEAD requests, inspect the nested error payload for the missing-object markers while preserving HTTP 500 for other 400 responses.