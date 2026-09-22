import { Router, type IRouter, type Request, type Response } from "express";
import { z } from "zod";
import {
  clearAdminSessionCookie,
  credentialsConfigured,
  credentialsMatch,
  createAdminSession,
  readAdminSession,
  setAdminSessionCookie,
} from "../lib/adminSession";

const router: IRouter = Router();
const LoginBody = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.get("/auth/me", (req: Request, res: Response): void => {
  const session = readAdminSession(req);
  if (!session) {
    res.status(401).json({ authenticated: false });
    return;
  }
  res.json({
    authenticated: true,
    email: session.email,
    role: session.role,
  });
});

router.post("/auth/login", (req: Request, res: Response): void => {
  const body = LoginBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Enter a valid email address and password." });
    return;
  }
  if (!credentialsConfigured()) {
    res.status(503).json({ error: "Super Admin credentials are not configured." });
    return;
  }
  if (!credentialsMatch(body.data.email, body.data.password)) {
    res.status(401).json({ error: "Incorrect email or password." });
    return;
  }

  setAdminSessionCookie(res, createAdminSession(body.data.email.trim().toLowerCase()));
  res.json({
    authenticated: true,
    email: body.data.email.trim().toLowerCase(),
    role: "super_admin",
  });
});

router.post("/auth/logout", (_req: Request, res: Response): void => {
  clearAdminSessionCookie(res);
  res.status(204).end();
});

export default router;