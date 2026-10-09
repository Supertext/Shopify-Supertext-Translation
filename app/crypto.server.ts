import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

/**
 * Encrypts secrets stored in the database (the shops' Supertext API keys)
 * with AES-256-GCM. The key comes from SUPERTEXT_KEY_ENCRYPTION_KEY (any long
 * random string; SHA-256 turns it into the 32-byte key), which lives only in
 * the hosting platform's variables.
 *
 * Stored format: "enc:v1:<iv>:<tag>:<ciphertext>" (base64url parts).
 * Values without the prefix are legacy plaintext and are re-encrypted on read.
 */

const PREFIX = "enc:v1:";

export class EncryptionKeyMissing extends Error {
  constructor() {
    super(
      "SUPERTEXT_KEY_ENCRYPTION_KEY is not set on the server, so API keys can't be stored safely.",
    );
    this.name = "EncryptionKeyMissing";
  }
}

const keyFrom = (secret: string): Buffer => createHash("sha256").update(secret, "utf8").digest();

function currentKey(secret = process.env.SUPERTEXT_KEY_ENCRYPTION_KEY): Buffer {
  if (!secret || secret.trim().length < 32) throw new EncryptionKeyMissing();
  return keyFrom(secret.trim());
}

export const isEncrypted = (value: string): boolean => value.startsWith(PREFIX);

export function encryptSecret(plain: string, secret?: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", currentKey(secret), iv);
  const data = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return PREFIX + [iv, tag, data].map((b) => b.toString("base64url")).join(":");
}

/** Plaintext of a stored value; legacy plaintext is returned as is. */
export function decryptSecret(stored: string, secret?: string): string {
  if (!isEncrypted(stored)) return stored;
  const [iv, tag, data] = stored.slice(PREFIX.length).split(":").map((p) => Buffer.from(p, "base64url"));
  if (!iv || !tag || !data) throw new Error("The stored API key is damaged.");
  const decipher = createDecipheriv("aes-256-gcm", currentKey(secret), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
}

/** True when the server can encrypt (the variable is set and long enough). */
export function encryptionConfigured(): boolean {
  try {
    currentKey();
    return true;
  } catch {
    return false;
  }
}
