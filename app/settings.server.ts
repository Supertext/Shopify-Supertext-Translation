import prisma from "./db.server";
import { SupertextClient, type Politeness } from "./supertext/client.server";
import {
  decryptSecret,
  encryptionConfigured,
  encryptSecret,
  isEncrypted,
} from "./crypto.server";

export interface Settings {
  apiKey: string;
  politeness: Politeness;
  /** Shopify locale → Supertext code set by the shop; missing = the default. */
  languageCodes: Record<string, string>;
  /** A key is stored but can't be decrypted (the server's encryption key changed). */
  apiKeyUnreadable: boolean;
}

const POLITENESS = new Set<Politeness>(["default", "more", "less"]);

export const toPoliteness = (value: unknown): Politeness =>
  POLITENESS.has(value as Politeness) ? (value as Politeness) : "default";

export async function getSettings(shop: string): Promise<Settings> {
  const row = await prisma.shopSettings.findUnique({ where: { shop } });
  const stored = row?.apiKey ?? "";
  let apiKey = "";
  let apiKeyUnreadable = false;
  if (stored) {
    try {
      apiKey = decryptSecret(stored);
    } catch (error) {
      console.error(`[supertext] can't decrypt the API key of ${shop}: ${(error as Error).message}`);
      apiKeyUnreadable = true;
    }
    // Keys saved before encryption existed: encrypt them now.
    if (apiKey && !isEncrypted(stored) && encryptionConfigured()) {
      await prisma.shopSettings
        .update({ where: { shop }, data: { apiKey: encryptSecret(apiKey) } })
        .catch((error: Error) => console.error(`[supertext] re-encrypting ${shop} failed: ${error.message}`));
    }
  }
  return {
    apiKey,
    politeness: toPoliteness(row?.politeness),
    languageCodes: parseCodes(row?.languageCodes),
    apiKeyUnreadable,
  };
}

function parseCodes(json: string | undefined): Record<string, string> {
  try {
    const value = JSON.parse(json || "{}");
    return value && typeof value === "object" ? (value as Record<string, string>) : {};
  } catch {
    return {};
  }
}

/**
 * An empty `apiKey` keeps the saved key (the field never shows it). A new key
 * is stored encrypted; throws EncryptionKeyMissing if the server can't encrypt.
 */
export async function saveSettings(
  shop: string,
  input: {
    apiKey?: string;
    politeness: Politeness;
    languageCodes?: Record<string, string>;
  },
): Promise<void> {
  const plainKey = input.apiKey?.trim();
  const apiKey = plainKey ? encryptSecret(plainKey) : undefined;
  const languageCodes =
    input.languageCodes !== undefined ? JSON.stringify(input.languageCodes) : undefined;
  await prisma.shopSettings.upsert({
    where: { shop },
    create: {
      shop,
      apiKey: apiKey ?? "",
      politeness: input.politeness,
      languageCodes: languageCodes ?? "{}",
    },
    update: {
      politeness: input.politeness,
      ...(apiKey ? { apiKey } : {}),
      ...(languageCodes !== undefined ? { languageCodes } : {}),
    },
  });
}

export async function removeApiKey(shop: string): Promise<void> {
  await prisma.shopSettings.updateMany({ where: { shop }, data: { apiKey: "" } });
}

/** The key in use: the shop's own, else the SUPERTEXT_API_KEY variable. */
export const effectiveApiKey = (settings: Settings): string =>
  settings.apiKey || process.env.SUPERTEXT_API_KEY?.trim() || "";

export const supertextClient = (settings: Settings): SupertextClient =>
  new SupertextClient({
    apiKey: effectiveApiKey(settings),
    // A stand-in API for tests and screenshots; the live API otherwise.
    endpoint: process.env.SUPERTEXT_API_ENDPOINT || undefined,
  });
