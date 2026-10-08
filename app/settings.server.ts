import prisma from "./db.server";
import { SupertextClient, type Politeness } from "./supertext/client.server";

export interface Settings {
  apiKey: string;
  politeness: Politeness;
}

const POLITENESS = new Set<Politeness>(["default", "more", "less"]);

export const toPoliteness = (value: unknown): Politeness =>
  POLITENESS.has(value as Politeness) ? (value as Politeness) : "default";

export async function getSettings(shop: string): Promise<Settings> {
  const row = await prisma.shopSettings.findUnique({ where: { shop } });
  return {
    apiKey: row?.apiKey ?? "",
    politeness: toPoliteness(row?.politeness),
  };
}

/** An empty `apiKey` keeps the saved key (the field never shows it). */
export async function saveSettings(
  shop: string,
  input: { apiKey?: string; politeness: Politeness },
): Promise<void> {
  const apiKey = input.apiKey?.trim();
  await prisma.shopSettings.upsert({
    where: { shop },
    create: { shop, apiKey: apiKey ?? "", politeness: input.politeness },
    update: {
      politeness: input.politeness,
      ...(apiKey ? { apiKey } : {}),
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
