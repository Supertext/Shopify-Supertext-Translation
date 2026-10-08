import { describe, expect, it } from "vitest";
import {
  defaultSupertextCode,
  isValidCode,
  normalizeCode,
  supertextCode,
} from "../app/translation/language-codes";
import { languagePairError } from "../app/supertext/client.server";

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

describe("languagePairError", () => {
  it("explains INVALID_LANGUAGE_PAIR and points to the setting", () => {
    const message = languagePairError(
      '{"error_code":"INVALID_LANGUAGE_PAIR","message":"…","source_lang":"en","target_lang":"de","politeness":null}',
    );
    expect(message).toContain('from "en" into "de"');
    expect(message).toContain("Settings → Languages");
    expect(languagePairError('{"error_code":"OTHER"}')).toBeNull();
  });
});
