import { createClient } from "../app/supertext/client.server";
import type { TranslateTexts } from "../app/translation/translate.server";

/** Prefixes each segment's text with the locale, like the SDK repo's stand-in API. */
export const prefixSegments = (html: string, locale: string) =>
  html.replace(/(<div data-st-id="\d+">)([\s\S]*?)(<\/div>)/g, (_m, open, inner, close) =>
    `${open}${inner.replace(/>([^<]+)</g, `>[${locale}] $1<`).replace(/^([^<]+)/, `[${locale}] $1`)}${close}`,
  );

/**
 * A Supertext API in memory, behind the real bundled SDK client: upload,
 * status, download and delete, translating with `transform`. Records the
 * requests so tests can check what the SDK sent.
 */
export function fakeSupertext(
  transform: (html: string, targetLang: string) => string = prefixSegments,
  options: { status?: number; body?: string } = {},
) {
  const files = new Map<string, string>();
  const requests: { method: string; path: string; targetLang?: string; sourceLang?: string }[] = [];
  const fetch = async (url: string, init: RequestInit) => {
    const path = url.replace("https://api.test/v1/", "");
    const method = init.method ?? "GET";
    if (options.status) {
      requests.push({ method, path });
      return new Response(options.body ?? "", { status: options.status });
    }
    if (method === "POST") {
      const body = new TextDecoder().decode(init.body as ArrayBuffer);
      const field = (name: string) => body.match(new RegExp(`name="${name}"\\r\\n\\r\\n([^\\r]*)`))?.[1];
      const html = body.slice(body.indexOf("<!DOCTYPE html>"), body.lastIndexOf("</html>") + 7);
      const targetLang = field("target_lang") ?? "";
      requests.push({ method, path, targetLang, sourceLang: field("source_lang") });
      const id = `f${files.size + 1}`;
      files.set(id, transform(html, targetLang));
      return Response.json({ file_id: id });
    }
    requests.push({ method, path });
    const id = path.split("/")[3] ?? "";
    if (path.endsWith("/status")) return Response.json({ status: "done" });
    if (path.endsWith("/translation")) return new Response(files.get(id) ?? "");
    return Response.json({});
  };
  const client = createClient({ apiKey: "test-key", baseUrl: "https://api.test/v1/", fetch, pollIntervalMs: 0, sleep: async () => undefined });
  /** Translates through the real SDK; the target code is the Shopify locale (as jobs.server passes after mapping). */
  const translate: TranslateTexts = (segments, locale) => client.translateTexts(segments, locale);
  return { client, translate, requests };
}
