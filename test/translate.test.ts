import { describe, expect, it } from "vitest";
import {
  selectFields,
  titleOf,
  type ContentItem,
  type ExistingTranslation,
} from "../app/translation/fields.server";
import { chunkSegments, translateResource } from "../app/translation/translate.server";
import { processJob } from "../app/translation/process.server";
import type { AdminClient } from "../app/translation/shopify.server";

const product: ContentItem[] = [
  { key: "title", value: "Swiss chocolate", digest: "d-title", locale: "en", type: "SINGLE_LINE_TEXT_FIELD" },
  { key: "body_html", value: "<p>Made in <b>Zurich</b>, see <a href=\"/pages/about\">our story</a>.</p>", digest: "d-body", locale: "en", type: "HTML" },
  { key: "handle", value: "swiss-chocolate", digest: "d-handle", locale: "en", type: "URI" },
  { key: "product_type", value: "", digest: "d-type", locale: "en", type: "STRING" },
  { key: "meta_description", value: "Line one\nLine two", digest: "d-meta", locale: "en", type: "MULTI_LINE_TEXT_FIELD" },
  { key: "some_json", value: "{\"a\":1}", digest: "d-json", locale: "en", type: "JSON" },
];

/** A Shopify admin with one product that records registered translations. */
function fakeAdmin(translations: ExistingTranslation[] = []) {
  const registered: { id: string; translations: { key: string; value: string; locale: string; translatableContentDigest: string }[] }[] = [];
  const admin: AdminClient = {
    async graphql(query, options) {
      const vars = options?.variables ?? {};
      if (query.includes("translatableResource(")) {
        if (vars.id === "gid://shopify/Product/404") {
          return Response.json({ data: { translatableResource: null } });
        }
        return Response.json({
          data: { translatableResource: { translatableContent: product, translations } },
        });
      }
      if (query.includes("translationsRegister")) {
        registered.push({ id: vars.id as string, translations: vars.translations as never });
        return Response.json({ data: { translationsRegister: { userErrors: [] } } });
      }
      throw new Error(`unexpected query: ${query}`);
    },
  };
  return { admin, registered };
}

/** A stand-in Supertext: prefixes each segment's text with the locale. */
const fakeTranslate = async (html: string, locale: string) =>
  html.replace(/(<div data-st-id="\d+">)([\s\S]*?)(<\/div>)/g, (_m, open, inner, close) =>
    `${open}${inner.replace(/>([^<]+)</g, `>[${locale}] $1<`).replace(/^([^<]+)/, `[${locale}] $1`)}${close}`,
  );

describe("selectFields", () => {
  it("sends text and HTML fields, skips handles, empty values and unsupported types", () => {
    const selection = selectFields(product, [], false);
    expect(selection.fields.map((f) => f.key)).toEqual(["title", "body_html", "meta_description"]);
    expect(selection.segments.map((s) => s.html)).toEqual([false, true, false]);
  });

  it("keeps current translations unless asked to overwrite, but retranslates outdated ones", () => {
    const existing = [
      { key: "title", value: "Schweizer Schokolade", outdated: false },
      { key: "body_html", value: "<p>alt</p>", outdated: true },
    ];
    const kept = selectFields(product, existing, false);
    expect(kept.fields.map((f) => f.key)).toEqual(["body_html", "meta_description"]);
    expect(kept.skipped).toBe(1);
    expect(selectFields(product, existing, true).fields).toHaveLength(3);
  });

  it("finds a title for lists", () => {
    expect(titleOf(product)).toBe("Swiss chocolate");
    expect(titleOf([])).toBe("(untitled)");
  });
});

describe("translateResource", () => {
  it("translates the fields and registers them with their digests", async () => {
    const { admin, registered } = fakeAdmin();
    const result = await translateResource(admin, fakeTranslate, "gid://shopify/Product/1", "de", false);

    expect(result).toEqual({ written: 3, skipped: 0 });
    const byKey = Object.fromEntries(registered[0].translations.map((t) => [t.key, t]));
    expect(byKey.title).toMatchObject({ value: "[de] Swiss chocolate", locale: "de", translatableContentDigest: "d-title" });
    // Markup and links survive, line breaks in plain text too.
    expect(byKey.body_html.value).toContain('<a href="/pages/about">');
    expect(byKey.body_html.value).toContain("<b>[de] Zurich</b>");
    expect(byKey.meta_description.value).toBe("[de] Line one\nLine two");
  });

  it("does nothing when everything is already translated", async () => {
    const { admin, registered } = fakeAdmin([
      { key: "title", value: "x", outdated: false },
      { key: "body_html", value: "x", outdated: false },
      { key: "meta_description", value: "x", outdated: false },
    ]);
    let calls = 0;
    const result = await translateResource(admin, async (h) => (calls++, h), "gid://shopify/Product/1", "fr", false);
    expect(result).toEqual({ written: 0, skipped: 3 });
    expect(calls).toBe(0);
    expect(registered).toHaveLength(0);
  });

  it("refuses to write a partial result", async () => {
    const { admin, registered } = fakeAdmin();
    await expect(
      translateResource(admin, async () => '<div data-st-id="0">Nur Titel</div>', "gid://shopify/Product/1", "de", false),
    ).rejects.toThrow(/returned 1 of 3/);
    expect(registered).toHaveLength(0);
  });
});

describe("chunkSegments", () => {
  it("keeps documents under the size limit and preserves the order", () => {
    const segments = Array.from({ length: 5 }, (_, i) => ({ text: "x".repeat(60) + i, html: false }));
    const chunks = chunkSegments(segments, 250);
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.flatMap((c) => c.segments)).toEqual(segments);
    expect(chunks.map((c) => c.offset)).toEqual(chunks.map((_c, i) => chunks.slice(0, i).reduce((n, c) => n + c.segments.length, 0)));
  });
});

describe("processJob", () => {
  it("goes through every item and language and reports per-item errors", async () => {
    const { admin, registered } = fakeAdmin();
    const updates: number[] = [];
    const result = await processJob(
      admin,
      fakeTranslate,
      { resourceIds: ["gid://shopify/Product/1", "gid://shopify/Product/404"], locales: ["de", "fr"], overwrite: false },
      async (p) => void updates.push(p.completed),
    );
    expect(result.written).toBe(6);
    expect(result.errors).toEqual([
      { resource: "gid://shopify/Product/404", locale: "de", message: "The item no longer exists." },
      { resource: "gid://shopify/Product/404", locale: "fr", message: "The item no longer exists." },
    ]);
    expect(updates).toEqual([1, 2, 3, 4]);
    expect(registered.map((r) => r.translations[0].locale)).toEqual(["de", "fr"]);
  });

  it("stops at once when the API key is rejected", async () => {
    const { admin } = fakeAdmin();
    let calls = 0;
    const result = await processJob(
      admin,
      async () => {
        calls++;
        throw new Error("Authentication failed. Please check the Supertext API key.");
      },
      { resourceIds: ["a", "b", "c"], locales: ["de", "fr"], overwrite: false },
      async () => undefined,
    );
    expect(calls).toBe(1);
    expect(result.completed).toBe(6);
    expect(result.errors).toHaveLength(1);
  });
});

describe("refused languages", () => {
  it("reports a language Supertext refuses once and skips it for the other items", async () => {
    const { admin, registered } = fakeAdmin();
    const calls: string[] = [];
    const result = await processJob(
      admin,
      async (html, locale) => {
        calls.push(locale);
        if (locale === "de") throw new Error('Supertext doesn\'t translate from "en" into "de". Set the Supertext code …');
        return fakeTranslate(html, locale);
      },
      { resourceIds: ["gid://shopify/Product/1", "gid://shopify/Product/2"], locales: ["de", "fr"], overwrite: false },
      async () => undefined,
    );
    expect(calls).toEqual(["de", "fr", "fr"]);
    expect(result.errors).toHaveLength(1);
    expect(result.completed).toBe(4);
    expect(registered).toHaveLength(2);
  });
});
