# Ditheto Accountants

Professional public website and protected admin portal for managing accounting clients, documents, communications, and future Odoo synchronization.

## Run & Operate

- `pnpm --filter @workspace/ditheto-accountants run dev` — run the website
- `pnpm --filter @workspace/api-server run dev` — run the API server
- `pnpm --filter @workspace/ditheto-accountants run typecheck` — check the website
- `pnpm --filter @workspace/api-server run typecheck` — check the API
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas after changing OpenAPI
- `pnpm --filter @workspace/db run push` — push development schema changes

## Stack

- React 19, Vite, TypeScript, Tailwind CSS and Wouter
- Super Admin email/password authentication with signed HttpOnly sessions
- Express 5 API with generated Zod request/response validation
- PostgreSQL with Drizzle ORM
- Replit App Storage for private client documents
- OpenAPI and Orval for generated React Query clients

## Where things live

- Public and admin UI: `artifacts/ditheto-accountants/src`
- API routes: `artifacts/api-server/src/routes`
- Admin access middleware: `artifacts/api-server/src/middlewares`
- Source-of-truth API contract: `lib/api-spec/openapi.yaml`
- Database schema: `lib/db/src/schema`

## Architecture decisions

- The admin portal uses the configured Super Admin email/password and a signed HttpOnly session cookie; Clerk is not used.
- Odoo configuration is restricted to Super Admin sessions and encrypts the Odoo password before storing it in integration state.
- Client files upload directly to private App Storage with short-lived signed URLs; PostgreSQL stores metadata and object paths, not file blobs.
- Odoo is modular and disabled by default. Its UI and API report `Disconnected` until an authorized connector is attached.
- Without messaging connectors, email and WhatsApp requests are logged in PostgreSQL and opened in the staff member's email app or WhatsApp for final sending.

## Product

- Public Home, Services, Quote, About, Team, and Contact pages
- Protected admin portal
- Searchable client database and detailed client profiles
- Client document library with status/category management and private uploads
- Outstanding-document request composer and communication history
- Role-based Super Admin and Staff access
- Odoo connection status and client sync foundation

## Gotchas

- Run OpenAPI code generation immediately after editing `lib/api-spec/openapi.yaml`.
- Admin API and private object routes require an authenticated admin session.
- Do not present Odoo, email, or WhatsApp delivery as connected until the relevant integration has been authorized.