import { Router, type IRouter, type Request, type Response } from "express";
import {
  clearSupabaseAuthCookies,
  getAdminIdentity,
  getAdminIdentityForAccessToken,
  sendPasswordReset,
  setSupabaseAuthCookies,
  signInWithPassword,
  updatePassword,
} from "../lib/supabaseAuth";

const router: IRouter = Router();

router.get("/auth/me", (req: Request, res: Response): void => {
  void getAdminIdentity(req, res)
    .then((identity) => {
      if (!identity) {
        res.status(401).json({ authenticated: false });
        return;
      }
      res.json({ authenticated: true, email: identity.email, role: identity.role });
    })
    .catch((error) => {
      req.log.error({ err: error }, "Supabase auth session lookup failed");
      res.status(503).json({ error: "Supabase authentication is not configured." });
    });
});

router.post("/auth/login", (req: Request, res: Response): void => {
  const email = typeof req.body?.email === "string" ? req.body.email : "";
  const password = typeof req.body?.password === "string" ? req.body.password : "";
  if (!email.includes("@") || !password) {
    res.status(400).json({ error: "Enter a valid email address and password." });
    return;
  }
  void signInWithPassword(email.trim().toLowerCase(), password)
    .then(async (session) => {
      setSupabaseAuthCookies(res, session);
      const identity = await getAdminIdentityForAccessToken(session.access_token);
      if (!identity) {
        clearSupabaseAuthCookies(res);
        res.status(403).json({ error: "This Supabase account is not authorized for the admin portal." });
        return;
      }
      res.json({ authenticated: true, email: identity.email, role: identity.role });
    })
    .catch(() => {
      res.status(401).json({ error: "Incorrect email or password." });
    });
});

router.post("/auth/forgot-password", (req: Request, res: Response): void => {
  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
  if (!email.includes("@")) {
    res.status(400).json({ error: "Enter a valid email address." });
    return;
  }
  const forwardedProtocol = req.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const forwardedHost = req.get("x-forwarded-host")?.split(",")[0]?.trim();
  const origin = `${forwardedProtocol ?? req.protocol}://${forwardedHost ?? req.get("host")}`;
  void sendPasswordReset(email, `${origin}/sign-in`)
    .then(() => {
      res.json({ message: "If that email is registered, a password reset link has been sent." });
    })
    .catch((error) => {
      req.log.error({ err: error }, "Supabase password reset request failed");
      res.status(503).json({ error: "Password reset is temporarily unavailable." });
    });
});

router.post("/auth/update-password", (req: Request, res: Response): void => {
  const accessToken = typeof req.body?.accessToken === "string" ? req.body.accessToken : "";
  const password = typeof req.body?.password === "string" ? req.body.password : "";
  if (!accessToken || password.length < 8) {
    res.status(400).json({ error: "Your new password must be at least 8 characters long." });
    return;
  }
  void updatePassword(accessToken, password)
    .then(() => {
      res.json({ message: "Your password has been updated." });
    })
    .catch((error) => {
      req.log.error({ err: error }, "Supabase password update failed");
      res.status(400).json({ error: "This password reset link is invalid or has expired." });
    });
});

router.post("/auth/logout", (_req: Request, res: Response): void => {
  clearSupabaseAuthCookies(res);
  res.status(204).end();
});

export default router;