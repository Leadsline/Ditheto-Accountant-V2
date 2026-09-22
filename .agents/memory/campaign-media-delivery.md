---
name: Campaign media delivery
description: Campaign posters use scoped private storage routes and an explicit WhatsApp handoff until a direct messaging connector exists.
---

Campaign media should remain behind role-scoped private upload and read routes; the current supported delivery path prepares a WhatsApp handoff and clearly leaves the final external send to the staff member.

**Why:** The portal has no authorized WhatsApp connector, and the existing communication flows intentionally open WhatsApp for the staff member rather than claiming a message was delivered.

**How to apply:** Keep generic client-document storage and full-access admin routes protected separately. If a direct connector is added later, replace the handoff without weakening campaign role checks.