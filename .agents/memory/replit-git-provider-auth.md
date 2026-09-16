---
name: Replit Git provider authentication
description: Recovery path for Git pane authentication errors when the GitHub integration API still works.
---

Replit's Git pane can show `UNAUTHENTICATED` against an HTTPS GitHub remote even when the workspace's GitHub connector successfully authenticates API requests. The supported recovery is to disconnect and reconnect GitHub under Replit account settings in Git Providers.

**Why:** The Git provider connection used by the workspace Git interface can become out of sync independently of the connector used for API operations.

**How to apply:** Do not ask the user to paste a token or create a local credential workaround. Have them reconnect GitHub in account settings, then retry the Git operation. For organization-owned repositories, also authorize Replit in GitHub third-party application settings.