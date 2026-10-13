import type { SegmentInput } from "../supertext/client.server";
import { LocalizedError } from "../i18n/error";
import { selectFields, toTranslations } from "./fields.server";
import {
  registerTranslations,
  resourceForLocale,
  type AdminClient,
} from "./shopify.server";

/**
 * Translates keyed texts into `locale` and returns them by key: the Supertext
 * SDK's `translateTexts` in production (it packs them into as few documents
 * as possible, translates and reads them back).
 */
export type TranslateTexts = (
  segments: Map<string, SegmentInput>,
  locale: string,
) => Promise<Map<string, string>>;

export interface ResourceResult {
  written: number;
  skipped: number;
}

/**
 * Translates one resource into one locale and writes the result to Shopify:
 * read fields and existing translations → Supertext (one key per field) →
 * translationsRegister.
 */
export async function translateResource(
  admin: AdminClient,
  translate: TranslateTexts,
  resourceId: string,
  locale: string,
  overwrite: boolean,
): Promise<ResourceResult> {
  const resource = await resourceForLocale(admin, resourceId, locale);
  if (!resource) throw new LocalizedError("The item no longer exists.", "itemGone");

  const selection = selectFields(
    resource.content,
    resource.translations,
    overwrite,
  );
  if (selection.segments.length === 0) {
    return { written: 0, skipped: selection.skipped };
  }

  // The field's position is its key; field keys like "body_html" can repeat across resources.
  const result = await translate(
    new Map(selection.segments.map((segment, index) => [String(index), segment])),
    locale,
  );
  const translated = new Map<number, string>();
  for (const [key, value] of result) translated.set(Number(key), value);

  const inputs = toTranslations(selection, translated, locale);
  if (inputs.length < selection.segments.length) {
    throw new LocalizedError(
      `Supertext returned ${inputs.length} of ${selection.segments.length} fields.`,
      "incomplete",
      { returned: inputs.length, expected: selection.segments.length },
    );
  }
  await registerTranslations(admin, resourceId, inputs);
  return { written: inputs.length, skipped: selection.skipped };
}
