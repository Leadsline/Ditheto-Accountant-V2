import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

const ODOO_CONFIG_PREFIX = "odoo:v1:";

export type OdooConfig = {
  url: string;
  database: string;
  username: string;
  password: string;
};

function encryptionKey(): Buffer {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET must be configured for integration settings.");
  return createHash("sha256").update(secret).digest();
}

export function encryptOdooConfig(config: OdooConfig): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const ciphertext = Buffer.concat([
    cipher.update(JSON.stringify(config), "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return `${ODOO_CONFIG_PREFIX}${Buffer.concat([iv, tag, ciphertext]).toString("base64url")}`;
}

export function decryptOdooConfig(value: string): OdooConfig | null {
  if (!value.startsWith(ODOO_CONFIG_PREFIX)) return null;
  try {
    const encoded = Buffer.from(value.slice(ODOO_CONFIG_PREFIX.length), "base64url");
    const iv = encoded.subarray(0, 12);
    const tag = encoded.subarray(12, 28);
    const ciphertext = encoded.subarray(28);
    const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), iv);
    decipher.setAuthTag(tag);
    return JSON.parse(
      Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8"),
    ) as OdooConfig;
  } catch {
    return null;
  }
}

export function hasOdooConfig(value: string | undefined): boolean {
  return Boolean(value?.startsWith(ODOO_CONFIG_PREFIX));
}