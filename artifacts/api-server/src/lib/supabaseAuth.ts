import type { Request, Response } from "express";

const ACCESS_COOKIE = "ditheto_supabase_access_token";
const REFRESH_COOKIE = "ditheto_supabase_refresh_token";
const DEFAULT_ACCESS_MAX_AGE = 60 * 60;

export type AdminRole = "super_admin" | "staff" | "ceo" | "senior_manager" | "marketing_staff";

export type AdminIdentity = {
  userId: string;
  email: string;
  role: AdminRole;
};

type SupabaseSession = {
  access_token: string;
  refresh_token: string;
  expires_in?: number;
};

type SupabaseUser = {
  id: string;
  email?: string;
};

function getSupabaseConfig(): { url: string; anonKey: string } {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY must be configured.");
  }
  return { url, anonKey };
}

function authHeaders(anonKey: string, accessToken?: string): Record<string, string> {
  return {
    apikey: anonKey,
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    "Content-Type": "application/json",
  };
}

async function readJson(response: globalThis.Response): Promise<Record<string, unknown>> {
  try {
    return (await response.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

async function supabaseAuthRequest<T>(
  path: string,
  init: RequestInit,
): Promise<T> {
  const { url, anonKey } = getSupabaseConfig();
  const response = await fetch(`${url}/auth/v1${path}`, {
    ...init,
    headers: authHeaders(anonKey),
  });
  const body = await readJson(response);
  if (!response.ok) {
    const message = typeof body.msg === "string"
      ? body.msg
      : typeof body.message === "string"
        ? body.message
        : "Supabase authentication request failed.";
    throw new Error(message);
  }
  return body as T;
}

export async function signInWithPassword(email: string, password: string): Promise<SupabaseSession> {
  return supabaseAuthRequest<SupabaseSession>("/token?grant_type=password", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

async function refreshSession(refreshToken: string): Promise<SupabaseSession> {
  return supabaseAuthRequest<SupabaseSession>("/token?grant_type=refresh_token", {
    method: "POST",
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
}

async function getUser(accessToken: string): Promise<SupabaseUser | null> {
  const { url, anonKey } = getSupabaseConfig();
  const response = await fetch(`${url}/auth/v1/user`, {
    headers: authHeaders(anonKey, accessToken),
  });
  if (!response.ok) return null;
  return (await response.json()) as SupabaseUser;
}

async function getAdminRole(userId: string, accessToken: string): Promise<AdminRole | null> {
  const { url, anonKey } = getSupabaseConfig();
  const query = new URLSearchParams({
    user_id: `eq.${userId}`,
    select: "role",
    limit: "1",
  });
  const response = await fetch(`${url}/rest/v1/admin_users?${query.toString()}`, {
    headers: {
      ...authHeaders(anonKey, accessToken),
      Accept: "application/json",
    },
  });
  if (!response.ok) return null;
  const rows = (await response.json()) as Array<{ role?: AdminRole }>;
  const role = rows[0]?.role;
  return role ?? null;
}

function readCookie(req: Request, name: string): string | null {
  const cookie = (req.headers.cookie ?? "")
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));
  return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : null;
}

function cookieOptions(maxAge: number): string {
  const secure = process.env.NODE_ENV === "production" ? " Secure;" : "";
  return `Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge};${secure}`;
}

export function setSupabaseAuthCookies(res: Response, session: SupabaseSession): void {
  const maxAge = Math.max(60, session.expires_in ?? DEFAULT_ACCESS_MAX_AGE);
  res.setHeader("Set-Cookie", [
    `${ACCESS_COOKIE}=${encodeURIComponent(session.access_token)}; ${cookieOptions(maxAge)}`,
    `${REFRESH_COOKIE}=${encodeURIComponent(session.refresh_token)}; ${cookieOptions(60 * 60 * 24 * 30)}`,
  ]);
}

export function clearSupabaseAuthCookies(res: Response): void {
  res.setHeader("Set-Cookie", [
    `${ACCESS_COOKIE}=; ${cookieOptions(0)}`,
    `${REFRESH_COOKIE}=; ${cookieOptions(0)}`,
  ]);
}

export async function getAdminIdentity(req: Request, res?: Response): Promise<AdminIdentity | null> {
  let accessToken = readCookie(req, ACCESS_COOKIE);
  const refreshToken = readCookie(req, REFRESH_COOKIE);
  if (!accessToken) return null;

  let user = await getUser(accessToken);
  if (!user && refreshToken) {
    try {
      const refreshed = await refreshSession(refreshToken);
      accessToken = refreshed.access_token;
      user = await getUser(accessToken);
      if (res) setSupabaseAuthCookies(res, refreshed);
    } catch {
      return null;
    }
  }
  if (!user?.id || !user.email || !accessToken) return null;
  return getAdminIdentityForAccessToken(accessToken, user);
}

export async function getAdminIdentityForAccessToken(
  accessToken: string,
  user?: SupabaseUser,
): Promise<AdminIdentity | null> {
  const resolvedUser = user ?? await getUser(accessToken);
  if (!resolvedUser?.id || !resolvedUser.email) return null;

  const role = await getAdminRole(resolvedUser.id, accessToken);
  if (!role) return null;
  return { userId: resolvedUser.id, email: resolvedUser.email, role };
}

export async function sendPasswordReset(email: string, redirectTo: string): Promise<void> {
  await supabaseAuthRequest<Record<string, unknown>>("/recover", {
    method: "POST",
    body: JSON.stringify({ email, redirect_to: redirectTo }),
  });
}