import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

process.env.DATABASE_URL ??= "postgresql://role-matrix-check.invalid/database";

const middlewareModulePath = "../../artifacts/api-server/src/middlewares/adminAuth";
const {
  FULL_ACCESS_ROLES,
  createRequireFullAccess,
  createRequireStaff,
  hasFullAccess,
} = await import(middlewareModulePath);

type StaffUser = {
  id: number;
  clerkUserId: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
};

type ResponseLike = {
  status: (code: number) => ResponseLike;
  json: (body: unknown) => ResponseLike;
};

type Middleware = (
  req: Record<string, unknown>,
  res: ResponseLike,
  next: () => void,
) => Promise<void>;

type MiddlewareResult = {
  statusCode: number;
  body: unknown;
  nextCalled: boolean;
};

function staffUser(role: string): StaffUser {
  return {
    id: 1,
    clerkUserId: `role-matrix-${role}`,
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

async function runMiddleware(
  middleware: Middleware,
): Promise<MiddlewareResult> {
  const result: MiddlewareResult = {
    statusCode: 200,
    body: undefined,
    nextCalled: false,
  };
  const response = {
    status(code: number) {
      result.statusCode = code;
      return response;
    },
    json(body: unknown) {
      result.body = body;
      return response;
    },
  };

  await middleware({}, response, (() => {
    result.nextCalled = true;
  }));

  return result;
}

async function checkRoleBehavior(): Promise<void> {
  const fullAccess = createRequireFullAccess(async () => null);
  const staffAccess = createRequireStaff(async () => null);

  for (const role of FULL_ACCESS_ROLES) {
    const result = await runMiddleware(
      createRequireFullAccess(async () => staffUser(role)),
    );
    assert.equal(result.statusCode, 200, `${role} must retain full portal access`);
    assert.equal(result.nextCalled, true, `${role} must reach full-access routes`);
    assert.equal(hasFullAccess(role), true, `${role} must be in the full-access matrix`);
  }

  const marketing = staffUser("marketing_staff");
  const campaignResult = await runMiddleware(
    createRequireStaff(async () => marketing),
  );
  assert.equal(campaignResult.statusCode, 200, "Marketing Staff must retain campaign access");
  assert.equal(campaignResult.nextCalled, true, "Marketing Staff must reach staff routes");

  const marketingPrivateResult = await runMiddleware(
    createRequireFullAccess(async () => marketing),
  );
  assert.equal(marketingPrivateResult.statusCode, 403, "Marketing Staff must be denied private admin routes");
  assert.equal(marketingPrivateResult.nextCalled, false, "Marketing Staff must not reach private handlers");
  assert.equal(hasFullAccess("marketing_staff"), false, "Marketing Staff must not be in the full-access matrix");

  for (const [label, middleware] of [
    ["admin", staffAccess],
    ["document", fullAccess],
    ["team photo", fullAccess],
  ] as const) {
    const result = await runMiddleware(middleware);
    assert.equal(result.statusCode, 401, `Signed-out ${label} requests must be rejected`);
    assert.equal(result.nextCalled, false, `Signed-out ${label} requests must not reach handlers`);
  }
}

function checkProtectedRouteBindings(): void {
  const apiRoot = resolve(
    dirname(fileURLToPath(import.meta.url)),
    "../../artifacts/api-server/src/routes",
  );
  const routeBindings = [
    {
      label: "admin management",
      file: "admin.ts",
      route: 'router.get("/admin/clients", requireFullAccess',
    },
    {
      label: "document downloads",
      file: "storage.ts",
      route: "router.get('/storage/objects/*path', requireFullAccess",
    },
    {
      label: "team-photo downloads",
      file: "team.ts",
      route: 'router.get("/team-members/:teamMemberId/photo", requireFullAccess',
    },
    {
      label: "campaign role lookup",
      file: "admin.ts",
      route: 'router.get("/admin/me", requireStaff',
    },
  ];

  for (const binding of routeBindings) {
    const source = readFileSync(resolve(apiRoot, binding.file), "utf8");
    assert.ok(
      source.includes(binding.route),
      `${binding.label} route must retain its expected authorization middleware`,
    );
  }
}

await checkRoleBehavior();
checkProtectedRouteBindings();
console.log("Role matrix check passed: full-access roles, marketing-only access, signed-out rejection, and route bindings are intact.");