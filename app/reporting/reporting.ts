/**
 * Version reports to the Supertext Commando Center and the automatic API key
 * check (Commando-Center-Supertext-Translation → docs/DEVELOPER.md → Report
 * protocol). The protocol is the Supertext SDK's (`InstallationReporter`);
 * this file only gives it what the app knows about one shop: its address, the
 * app and Shopify API versions, the key in use and a place for the reporter's
 * state (`ShopSettings.reporterState`, see index.server.ts).
 *
 * A hosted app: no ping endpoint, no callback URL. Nothing here ever throws
 * into a request, a save or a translation, and the API key is never logged.
 *
 * No database or Shopify imports, so the tests run it with fakes.
 */
import {
  InstallationReporter,
  reporterState,
  reportsEnabled,
  type ApiKeyCheck,
  type ReporterOptions,
  type ReporterResult,
  type ReporterState,
} from "../../vendor/supertext-sdk/v1/index";

export type { ApiKeyCheck, ReporterResult, ReporterState };

/** The GitHub repository name: the center reads the latest release from it. */
export const PLUGIN_NAME = "Shopify-Supertext-Translation";

export interface ShopReportingDeps {
  /** The app version (package.json). */
  appVersion: string;
  /** The Shopify Admin API version the app uses (e.g. "2026-10"). */
  shopifyApiVersion: string;
  /** The shop's key in use and its "Send version information to Supertext" setting. */
  settings(shop: string): Promise<{ apiKey: string; versionReports: boolean }>;
  /** The stored reporter state (JSON text or anything; broken values count as empty). */
  loadState(shop: string): Promise<unknown>;
  saveState(shop: string, state: ReporterState): Promise<void>;
  /** The stand-in API for the key check (SUPERTEXT_API_ENDPOINT); the live API otherwise. */
  supertextBaseUrl?: string;
  log?: (message: string) => void;
  /** Tests: fetch, report URL, clock and client options for the SDK reporter. */
  reporterOverrides?: Partial<ReporterOptions>;
}

type Action =
  | { kind: "afterSettingsSaved" }
  | { kind: "testConnection" }
  | { kind: "onRequest" }
  | { kind: "authenticationFailed"; httpStatus: number };

/** The shop's address as the center identifies the installation: https://<shop>.myshopify.com. */
export const siteUrl = (shop: string): string => `https://${shop.trim().toLowerCase()}`;

export class ShopReporting {
  private readonly queues = new Map<string, Promise<unknown>>();
  private readonly background = new Set<Promise<unknown>>();

  constructor(private readonly deps: ShopReportingDeps) {}

  /** Whether reports are on for these settings (SUPERTEXT_VERSION_REPORTS wins). */
  static enabled(setting: boolean): boolean {
    return reportsEnabled(setting);
  }

  /** After a settings save: checks the key, reports `installed` or `settings_saved`. */
  afterSettingsSaved(shop: string): Promise<ReporterResult | null> {
    return this.run(shop, { kind: "afterSettingsSaved" });
  }

  /** "Test connection": checks the key, reports a changed status. */
  testConnection(shop: string): Promise<ReporterResult | null> {
    return this.run(shop, { kind: "testConnection" });
  }

  /** A translation was rejected with 401/403: the key is invalid (reported once). */
  authenticationFailed(shop: string, httpStatus = 401): Promise<ReporterResult | null> {
    return this.run(shop, { kind: "authenticationFailed", httpStatus });
  }

  /** On the app's admin pages and after jobs: in the background, never awaited by the page. */
  onRequestInBackground(shop: string): void {
    const task = this.run(shop, { kind: "onRequest" });
    this.background.add(task);
    void task.finally(() => this.background.delete(task));
  }

  /** The latest key check of a shop, for the settings page (null if none yet). */
  async lastCheck(shop: string): Promise<ApiKeyCheck | null> {
    try {
      return reporterState(await this.deps.loadState(shop)).keyCheck;
    } catch {
      return null;
    }
  }

  /** Tests: waits for background runs. */
  async idle(): Promise<void> {
    while (this.background.size) await Promise.all([...this.background]);
  }

  reporter(enabled: boolean, shop: string): InstallationReporter {
    return new InstallationReporter({
      enabled,
      siteUrl: siteUrl(shop),
      plugin: { name: PLUGIN_NAME, version: this.deps.appVersion },
      system: { name: "Shopify", version: this.deps.shopifyApiVersion },
      callbackUrl: null,
      clientOptions: {
        ...(this.deps.supertextBaseUrl ? { baseUrl: this.deps.supertextBaseUrl } : {}),
        userAgent: `${PLUGIN_NAME}/${this.deps.appVersion}`,
      },
      ...this.deps.reporterOverrides,
    });
  }

  /** One action per shop at a time, so two requests don't report twice. Never throws. */
  private run(shop: string, action: Action): Promise<ReporterResult | null> {
    const previous = this.queues.get(shop) ?? Promise.resolve();
    const task = previous.then(() => this.execute(shop, action));
    const settled = task.catch(() => null);
    this.queues.set(shop, settled);
    void settled.finally(() => {
      if (this.queues.get(shop) === settled) this.queues.delete(shop);
    });
    return settled;
  }

  private async execute(shop: string, action: Action): Promise<ReporterResult | null> {
    try {
      const settings = await this.deps.settings(shop);
      const reporter = this.reporter(ShopReporting.enabled(settings.versionReports), shop);
      const stored = await this.deps.loadState(shop);
      const state = reporterState(stored);
      const key = settings.apiKey;
      let result: ReporterResult;
      switch (action.kind) {
        case "afterSettingsSaved":
          result = await reporter.afterSettingsSaved(state, key);
          break;
        case "testConnection":
          result = await reporter.testConnection(state, key);
          break;
        case "authenticationFailed":
          result = await reporter.authenticationFailed(state, key, action.httpStatus);
          break;
        default:
          result = await reporter.onRequest(state, key);
      }
      if (JSON.stringify(result.state) !== JSON.stringify(state) || typeof stored !== "string" || stored === "") {
        await this.deps.saveState(shop, result.state);
      }
      return result;
    } catch (error) {
      this.deps.log?.(`[supertext] version report for ${shop} skipped: ${(error as Error).message}`);
      return null;
    }
  }
}
