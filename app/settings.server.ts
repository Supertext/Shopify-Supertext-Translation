import prisma from "./db.server";
import { SupertextClient, type Politeness } from "./supertext/client.server";

export interface Settings {
  apiKey: string;
  politeness: Politeness;
  /** Shopify locale → Supertext code set by the shop; missing = the default. */
  languageCodes: Record<string, string>;
}

const POLITENESS = new Set<Politeness>(["default", "more", "less"]);

export const toPoliteness = (value: unknown): Politeness =>
  POLITENESS.has(value as Politeness) ? (value as Politeness) : "default";

export async function getSettings(shop: string): Promise<Settings> {
  const row = await prisma.shopSettings.findUnique({ where: { shop } });
  return {
    apiKey: row?.apiKey ?? "",
    politeness: toPoliteness(row?.politeness),
    languageCodes: parseCodes(row?.languageCodes),
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

/** An empty `apiKey` keeps the saved key (the field never shows it). */
export async function saveSettings(
  shop: string,
  input: {
    apiKey?: string;
    politeness: Politeness;
    languageCodes?: Record<string, string>;
  },
): Promise<void> {
  const apiKey = input.apiKey?.trim();
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
