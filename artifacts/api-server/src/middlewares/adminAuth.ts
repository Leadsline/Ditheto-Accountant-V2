import type { NextFunction, Request, Response } from "express";
import { getAdminIdentity, type AdminRole } from "../lib/supabaseAuth";

export type AdminRequest = Request & {
  authUserId?: string;
  authEmail?: string;
  authRole?: AdminRole;
};

export const FULL_ACCESS_ROLES = ["super_admin", "ceo", "senior_manager"] as const;

export function hasFullAccess(role: string): boolean {
  return FULL_ACCESS_ROLES.includes(role as typeof FULL_ACCESS_ROLES[number]);
}

export function hasCampaignAccess(role: string): boolean {
  return hasFullAccess(role) || role === "marketing_staff" || role === "staff";
}

async function requireSession(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const identity = await getAdminIdentity(req, res);
    if (!identity) {
      res.status(401).json({ error: "Admin sign-in required." });
      return;
    }
    const adminRequest = req as AdminRequest;
    adminRequest.authUserId = identity.userId;
    adminRequest.authEmail = identity.email;
    adminRequest.authRole = identity.role;
    next();
  } catch (error) {
    req.log.error({ err: error }, "Supabase admin authentication failed");
    res.status(503).json({ error: "Supabase authentication is not configured." });
  }
}

export const requireStaff = requireSession;

export function requireFullAccess(req: Request, res: Response, next: NextFunction): void {
  requireSession(req, res, () => {
    if (!hasFullAccess((req as AdminRequest).authRole ?? "")) {
      res.status(403).json({ error: "Full admin access required." });
      return;
    }
    next();
  });
}

export function requireCampaignAccess(req: Request, res: Response, next: NextFunction): void {
  requireSession(req, res, () => {
    if (!hasCampaignAccess((req as AdminRequest).authRole ?? "")) {
      res.status(403).json({ error: "Campaign access required." });
      return;
    }
    next();
  });
}

export function requireSuperAdmin(req: Request, res: Response, next: NextFunction): void {
  requireSession(req, res, () => {
    if ((req as AdminRequest).authRole !== "super_admin") {
      res.status(403).json({ error: "Super Admin access required." });
      return;
    }
    next();
  });
}