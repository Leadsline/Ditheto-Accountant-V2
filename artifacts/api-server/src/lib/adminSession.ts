import { createHmac, timingSafeEqual } from "node:crypto";
import type { Request, Response } from "express";

const COOKIE_NAME = "ditheto_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

export type AdminSession = {
  email: string;
  role: "super_admin";
  expiresAt: number;
};

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET must be configured for admin sessions.");
  }
  return secret;
}

function encode(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function decode(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(payload: string): string {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("base64url");
}

export function createAdminSession(email: string): string {
  const session: AdminSession = {
    email,
    role: "super_admin",
    expiresAt: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const payload = encode(JSON.stringify(session));
  return `${payload}.${sign(payload)}`;
}

export function readAdminSession(req: Request): AdminSession | null {
  const header = req.headers.cookie ?? "";
  const cookie = header
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE_NAME}=`));
  if (!cookie) return null;

  const value = cookie.slice(COOKIE_NAME.length + 1);
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return null;

  try {
    const expected = sign(payload);
    const actualBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expected);
    if (
      actualBuffer.length !== expectedBuffer.length ||
      !timingSafeEqual(actualBuffer, expectedBuffer)
    ) {
      return null;
    }
    const session = JSON.parse(decode(payload)) as AdminSession;
    if (
      session.role !== "super_admin" ||
      !session.email ||
      !Number.isFinite(session.expiresAt) ||
      session.expiresAt <= Math.floor(Date.now() / 1000)
    ) {
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function setAdminSessionCookie(res: Response, token: string): void {
  const secure = process.env.NODE_ENV === "production" ? " Secure;" : "";
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS};${secure}`,
  );
}

export function clearAdminSessionCookie(res: Response): void {
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0;`,
  );
}

export function credentialsConfigured(): boolean {
  return Boolean(
    process.env.DITHETO_SUPER_ADMIN_EMAIL &&
      process.env.DITHETO_SUPER_ADMIN_PASSWORD
  );
}

export function credentialsMatch(email: string, password: string): boolean {
  const configuredEmail = process.env.DITHETO_SUPER_ADMIN_EMAIL?.trim().toLowerCase();
  const configuredPassword = process.env.DITHETO_SUPER_ADMIN_PASSWORD;
  if (!configuredEmail || !configuredPassword) return false;

  const emailMatches = email.trim().toLowerCase() === configuredEmail;
  const actual = Buffer.from(password);
  const expected = Buffer.from(configuredPassword);
  const passwordMatches =
    actual.length === expected.length && timingSafeEqual(actual, expected);
  return emailMatches && passwordMatches;
}

export { COOKIE_NAME };