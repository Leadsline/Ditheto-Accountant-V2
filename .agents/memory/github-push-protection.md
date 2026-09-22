---
name: GitHub push protection and local history
description: GitHub can reject a whole branch when any reachable commit contains a credential, even if the current files are clean.
---

GitHub Push Protection scans all commits reachable from the branch being pushed, not only the current working tree. A credential-bearing configuration line must be removed from every reachable commit before the branch can be accepted.

**Why:** A repository push was rejected because an old `.replit` commit contained both a token setting and a credential embedded in a Git URL.

**How to apply:** Use a secret-safe history rewrite to remove credential-bearing configuration from the branch, verify matches without printing values, revoke the exposed credential, and push only after the reachable history is clean.