---
name: API error envelopes
description: Error-response handling for the admin portal across the Replit proxy and Express API
---

Treat API error bodies as untrusted text at the browser boundary: read the body once, attempt JSON parsing, and fall back to a useful plain-text message. Keep an Express error middleware after the router so unexpected failures still return a JSON error envelope.

**Why:** A Replit-proxied request can surface a plain-text server error even when normal API responses are JSON. Calling `response.json()` unconditionally turns the useful server failure into an opaque `Unexpected token` client error.

**How to apply:** Use the tolerant parser for admin login and password-reset requests, and preserve JSON error handling for normal responses. Verify both a real login and an unexpected request error after changing the API boundary.