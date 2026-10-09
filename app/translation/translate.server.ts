import {
  buildDocument,
  parseDocument,
  type Segment,
} from "../supertext/html.server";
import { MAX_DOCUMENT_CHARACTERS } from "../supertext/client.server";
import { LocalizedError } from "../i18n/error";
import { selectFields, toTranslations } from "./fields.server";
import {
  registerTranslations,
  resourceForLocale,
  type AdminClient,
} from "./shopify.server";

/** Translates one HTML document into `locale` (the Supertext client in production). */
export type TranslateDocument = (html: string, locale: string) => Promise<string>;

export interface ResourceResult {
  written: number;
  skipped: number;
}

/**
 * Translates one resource into one locale and writes the result to Shopify:
 * read fields and existing translations → one HTML document per chunk →
 * Supertext → translationsRegister.
 */
export async function translateResource(
  admin: AdminClient,
  translate: TranslateDocument,
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

  const translated = new Map<number, string>();
  for (const chunk of chunkSegments(selection.segments)) {
    const html = await translate(buildDocument(chunk.segments), locale);
    for (const [index, value] of parseDocument(html, chunk.segments)) {
      translated.set(chunk.offset + index, value);
    }
  }

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

/** Splits segments so each document stays below Supertext's size limit. */
export function chunkSegments(
  segments: Segment[],
  limit = MAX_DOCUMENT_CHARACTERS,
): { offset: number; segments: Segment[] }[] {
  const chunks: { offset: number; segments: Segment[] }[] = [];
  let current: Segment[] = [];
  let offset = 0;
  let size = 0;
  segments.forEach((segment, index) => {
    const length = segment.text.length + 40;
    if (current.length && size + length > limit) {
      chunks.push({ offset, segments: current });
      current = [];
      offset = index;
      size = 0;
    }
    current.push(segment);
    size += length;
  });
  if (current.length) chunks.push({ offset, segments: current });
  return chunks;
}
