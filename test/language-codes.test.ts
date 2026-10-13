import { describe, expect, it } from "vitest";
import {
  defaultSupertextCode,
  isValidCode,
  normalizeCode,
  supertextCode,
} from "../app/translation/language-codes";
import { localizeError, SupertextError } from "../app/supertext/client.server";
import { fakeSupertext } from "./fake-supertext";

describe("language codes", () => {
  it("adds a region to bare Shopify locales", () => {
    expect(defaultSupertextCode("de")).toBe("de-DE");
    expect(defaultSupertextCode("fr")).toBe("fr-FR");
    expect(defaultSupertextCode("en")).toBe("en-US");
  });

  it("keeps a region Shopify already has", () => {
    expect(defaultSupertextCode("pt-BR")).toBe("pt-BR");
    expect(defaultSupertextCode("zh-tw")).toBe("zh-TW");
  });

  it("uses the shop's own code first", () => {
    expect(supertextCode("de", { de: "de-ch" })).toBe("de-CH");
    expect(supertextCode("fr", { de: "de-CH" })).toBe("fr-FR");
    expect(supertextCode("de", { de: "  " })).toBe("de-DE");
  });

  it("normalizes and validates codes", () => {
    expect(normalizeCode("EN_us")).toBe("en-US");
    expect(isValidCode("de-CH")).toBe(true);
    expect(isValidCode("es-419")).toBe(true);
    expect(isValidCode("German")).toBe(false);
  });
});

describe("Supertext errors from the SDK", () => {
  it("explains INVALID_LANGUAGE_PAIR and points to the setting", async () => {
    const { client } = fakeSupertext(undefined, {
      status: 400,
      body: '{"error_code":"INVALID_LANGUAGE_PAIR","message":"…","source_lang":"en","target_lang":"de","politeness":null}',
    });
    const error = localizeError(await client.translateHtml("<p>x</p>", "de").catch((e: unknown) => e)) as {
      message: string;
      code: string;
      params: Record<string, string>;
      detail?: string;
    };
    expect(error.code).toBe("languagePair");
    expect(error.params).toEqual({ source: "en", target: "de" });
    expect(error.message).toContain("Settings → Languages");
    expect(error.detail).toBeUndefined();
  });

  it("maps every SDK error code to a message the app has", async () => {
    const { en } = await import("../app/i18n/en");
    const codes = ["missing_api_key", "authentication_failure", "invalid_language_pair", "not_found", "payload_too_large",
      "too_many_requests", "service_unavailable", "unexpected_status", "transport_error", "no_file_id",
      "translation_error", "quota_exceeded", "file_deleted", "timeout", "incomplete_response"] as const;
    for (const code of codes) {
      const mapped = localizeError(new SupertextError(code)) as { code: string };
      expect(`error.${mapped.code}` in en, code).toBe(true);
    }
  });

  it("adds the account and API key links to authentication errors", () => {
    const mapped = localizeError(new SupertextError("authentication_failure", { status: 401 })) as Error;
    expect(mapped.message).toContain("https://www.supertext.com/en/integrations/api");
  });
});
