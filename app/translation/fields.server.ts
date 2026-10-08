import type { Segment } from "../supertext/html.server";

/** One translatable field as Shopify returns it (`translatableContent`). */
export interface ContentItem {
  key: string;
  value: string | null;
  digest: string | null;
  locale: string;
  type: string;
}

/** A translation Shopify already holds for the target locale. */
export interface ExistingTranslation {
  key: string;
  value: string | null;
  outdated: boolean;
}

/** Input for Shopify's `translationsRegister` mutation. */
export interface TranslationInput {
  key: string;
  value: string;
  locale: string;
  translatableContentDigest: string;
}

/** Field types sent as plain text (escaped, line breaks kept). */
const PLAIN_TYPES = new Set([
  "STRING",
  "SINGLE_LINE_TEXT_FIELD",
  "MULTI_LINE_TEXT_FIELD",
]);

/** Field types that already are HTML and go to Supertext as markup. */
const HTML_TYPES = new Set(["HTML", "INLINE_RICH_TEXT"]);

/**
 * Keys never translated. The handle is the URL slug: changing it per
 * language needs redirects and slug rules, so merchants set it themselves.
 */
const SKIPPED_KEYS = new Set(["handle"]);

export interface Selection {
  segments: Segment[];
  /** Same order as `segments`. */
  fields: { key: string; digest: string }[];
  /** Fields left alone because a current translation exists. */
  skipped: number;
}

/**
 * Picks the fields of one resource to send to Supertext.
 *
 * Without `overwrite`, a field that already has a translation is kept, unless
 * Shopify marks it outdated (the source changed after it was translated).
 */
export function selectFields(
  content: ContentItem[],
  existing: ExistingTranslation[],
  overwrite: boolean,
): Selection {
  const current = new Map(
    existing
      .filter((t) => t.value && t.value.trim() !== "" && !t.outdated)
      .map((t) => [t.key, t]),
  );
  const selection: Selection = { segments: [], fields: [], skipped: 0 };
  for (const item of content) {
    const html = HTML_TYPES.has(item.type);
    if (!html && !PLAIN_TYPES.has(item.type)) continue;
    if (SKIPPED_KEYS.has(item.key) || !item.digest) continue;
    if (!item.value || item.value.trim() === "") continue;
    if (!overwrite && current.has(item.key)) {
      selection.skipped++;
      continue;
    }
    selection.segments.push({ text: item.value, html });
    selection.fields.push({ key: item.key, digest: item.digest });
  }
  return selection;
}

/** Turns the parsed Supertext result back into Shopify translation inputs. */
export function toTranslations(
  selection: Selection,
  translated: Map<number, string>,
  locale: string,
): TranslationInput[] {
  const inputs: TranslationInput[] = [];
  selection.fields.forEach((field, index) => {
    const value = translated.get(index);
    if (value === undefined || value.trim() === "") return;
    inputs.push({
      key: field.key,
      value,
      locale,
      translatableContentDigest: field.digest,
    });
  });
  return inputs;
}

/** The value of a resource's `title` (or `name`) field, for lists. */
export function titleOf(content: ContentItem[]): string {
  const item =
    content.find((c) => c.key === "title") ??
    content.find((c) => c.key === "name");
  return item?.value?.trim() || "(untitled)";
}
