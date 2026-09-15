import { getAuth } from "@clerk/express";
import { count, eq } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";
import { db, staffUsersTable, type StaffUser } from "@workspace/db";

export type AdminRequest = Request & {
  staffUser?: StaffUser;
  authUserId?: string;
};

export const FULL_ACCESS_ROLES = ["super_admin", "ceo", "senior_manager"] as const;
export type StaffRole = typeof FULL_ACCESS_ROLES[number] | "marketing_staff";

export function hasFullAccess(role: string): boolean {
  return FULL_ACCESS_ROLES.includes(role as typeof FULL_ACCESS_ROLES[number]);
}

async function resolveStaffUser(req: Request): Promise<StaffUser | null> {
  const auth = getAuth(req);
  const userId = auth.userId;
  if (!userId) return null;

  const [existing] = await db
    .select()
    .from(staffUsersTable)
    .where(eq(staffUsersTable.clerkUserId, userId))
    .limit(1);
  if (existing) return existing;

  // The first authenticated staff account owns the initial portal setup.
  // Later accounts must be provisioned by a Super Admin through the protected endpoint.
  const [{ count: staffCount }] = await db
    .select({ count: count() })
    .from(staffUsersTable);
  if (Number(staffCount) !== 0) return null;

  const [bootstrapped] = await db
    .insert(staffUsersTable)
    .values({ clerkUserId: userId, role: "super_admin" })
    .returning();
  return bootstrapped ?? null;
}

export async function requireStaff(req: Request, res: Response, next: NextFunction): Promise<void> {
  const staffUser = await resolveStaffUser(req);
  if (!staffUser) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  const adminReq = req as AdminRequest;
  adminReq.staffUser = staffUser;
  adminReq.authUserId = staffUser.clerkUserId;
  next();
}

export async function requireFullAccess(req: Request, res: Response, next: NextFunction): Promise<void> {
  const staffUser = await resolveStaffUser(req);
  if (!staffUser) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  if (!hasFullAccess(staffUser.role)) {
    res.status(403).json({ error: "Full portal access required" });
    return;
  }
  const adminReq = req as AdminRequest;
  adminReq.staffUser = staffUser;
  adminReq.authUserId = staffUser.clerkUserId;
  next();
}

export const requireSuperAdmin = requireFullAccess;