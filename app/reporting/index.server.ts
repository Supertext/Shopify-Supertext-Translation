// The app's Commando Center glue (reporting.ts) wired to the database and the settings:
// the reporter's state lives in ShopSettings.reporterState, one per shop.
import prisma from "../db.server";
import { effectiveApiKey, getSettings } from "../settings.server";
import { apiVersion } from "../shopify.server";
import { appVersion } from "../version.server";
import { ShopReporting } from "./reporting";

export { PLUGIN_NAME, ShopReporting, siteUrl } from "./reporting";
export type { ApiKeyCheck } from "./reporting";

export const reporting = new ShopReporting({
  appVersion: appVersion() ?? "0.0.0",
  shopifyApiVersion: String(apiVersion),
  supertextBaseUrl: process.env.SUPERTEXT_API_ENDPOINT || undefined,
  log: (message) => console.debug(message),
  async settings(shop) {
    const settings = await getSettings(shop);
    return { apiKey: effectiveApiKey(settings), versionReports: settings.versionReports };
  },
  async loadState(shop) {
    const row = await prisma.shopSettings.findUnique({
      where: { shop },
      select: { reporterState: true },
    });
    return row?.reporterState ?? "";
  },
  async saveState(shop, state) {
    const reporterState = JSON.stringify(state);
    await prisma.shopSettings.upsert({
      where: { shop },
      create: { shop, reporterState },
      update: { reporterState },
    });
  },
});
