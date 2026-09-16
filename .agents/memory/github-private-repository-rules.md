---
name: GitHub private repository rules
description: Plan-level limitation affecting branch protection and rulesets for private GitHub repositories.
---

GitHub Free does not permit branch protection or repository rulesets for private repositories. The GitHub API returns a plan-level 403 for both branch protection reads/writes and ruleset reads, even when the connected account has repository administrator permissions.

**Why:** A private repository must be upgraded to a plan that supports private-repository rules or made public before required status checks can be enforced.

**How to apply:** Before attempting to configure required checks through the GitHub integration, confirm the repository visibility and account plan. Do not change repository visibility without explicit user approval.