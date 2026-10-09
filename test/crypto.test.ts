import { describe, expect, it } from "vitest";
import {
  decryptSecret,
  EncryptionKeyMissing,
  encryptSecret,
  isEncrypted,
} from "../app/crypto.server";

const SECRET = "a-long-random-test-secret-that-is-at-least-32-chars";

describe("API key encryption", () => {
  it("round-trips and never stores the plaintext", () => {
    const stored = encryptSecret("Supertext-Key-123+/=", SECRET);
    expect(isEncrypted(stored)).toBe(true);
    expect(stored).not.toContain("Supertext-Key-123");
    expect(decryptSecret(stored, SECRET)).toBe("Supertext-Key-123+/=");
  });

  it("uses a new IV every time", () => {
    expect(encryptSecret("same", SECRET)).not.toBe(encryptSecret("same", SECRET));
  });

  it("returns legacy plaintext values as they are", () => {
    expect(decryptSecret("old-plain-key", SECRET)).toBe("old-plain-key");
  });

  it("fails with another server key or a tampered value", () => {
    const stored = encryptSecret("key", SECRET);
    expect(() => decryptSecret(stored, SECRET.replace("a", "b"))).toThrow();
    const tampered = stored.slice(0, -2) + (stored.endsWith("A") ? "BB" : "AA");
    expect(() => decryptSecret(tampered, SECRET)).toThrow();
  });

  it("refuses to encrypt without a long enough server key", () => {
    expect(() => encryptSecret("key", "")).toThrow(EncryptionKeyMissing);
    expect(() => encryptSecret("key", "short")).toThrow(EncryptionKeyMissing);
  });
});
