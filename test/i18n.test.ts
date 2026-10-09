import { describe, expect, it } from "vitest";
import { en } from "../app/i18n/en";
import {
  LOCALES,
  MESSAGES,
  localeFromRequest,
  resolveLocale,
  translator,
} from "../app/i18n";
import { SupertextClient } from "../app/supertext/client.server";
import { errorInfo } from "../app/i18n/error";

const placeholders = (text: string) => [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
const urls = (text: string) => [...text.matchAll(/https:\/\/\S+?(?=[\s;)]|\.?$|\. )/g)].map((m) => m[0]).sort();

describe("message files", () => {
  for (const locale of LOCALES) {
    const messages = MESSAGES[locale];

    it(`${locale} has exactly the English keys`, () => {
      expect(Object.keys(messages).sort()).toEqual(Object.keys(en).sort());
    });

    it(`${locale} keeps placeholders, URLs and "Supertext"`, () => {
      for (const [key, english] of Object.entries(en)) {
        const text = messages[key as keyof typeof en];
        expect(text.trim(), key).not.toBe("");
        expect(placeholders(text), key).toEqual(placeholders(english));
        expect(urls(text), key).toEqual(urls(english));
        if (english.includes("Supertext")) expect(text, key).toContain("Supertext");
      }
    });
  }

  it("keeps the agreed wording of the main action", () => {
    expect(MESSAGES.de["translate.submit"]).toBe("Mit Supertext übersetzen");
    expect(MESSAGES.fr["translate.submit"]).toBe("Traduire avec Supertext");
    expect(MESSAGES.it["translate.submit"]).toBe("Traduci con Supertext");
  });
});

describe("locale", () => {
  it("uses Shopify's locale parameter, then Accept-Language, then English", () => {
    expect(localeFromRequest(new Request("https://app.test/app?locale=de-CH"))).toBe("de");
    expect(
      localeFromRequest(
        new Request("https://app.test/app?locale=ja", { headers: { "accept-language": "ja, it-CH;q=0.8" } }),
      ),
    ).toBe("it");
    expect(localeFromRequest(new Request("https://app.test/app"))).toBe("en");
    expect(resolveLocale("pt-BR", "fr")).toBe("fr");
  });
});

describe("translator", () => {
  it("fills placeholders and picks plural forms", () => {
    const fr = translator("fr");
    expect(fr.t("job.running", { completed: 1, total: 4 })).toBe("Traduction en cours… 1 sur 4");
    expect(fr.tn("job.written", 1)).toBe("1 champ traduit");
    expect(fr.tn("job.written", 3)).toBe("3 champs traduits");
    expect(translator("de").tn("translate.submitCount", 2)).toBe("2 Elemente mit Supertext übersetzen");
  });

  it("translates errors from the server and keeps Supertext's own detail", async () => {
    const client = new SupertextClient({
      apiKey: "bad",
      fetch: async () => new Response("bad key", { status: 401 }),
    });
    const info = errorInfo(await client.validate().catch((error) => error));
    expect(info.code).toBe("auth");
    expect(translator("de").error(info)).toMatch(/^Authentifizierung fehlgeschlagen\..*\(bad key\)$/);
    expect(translator("it").error({ message: "Something else" })).toBe("Something else");
  });
});
