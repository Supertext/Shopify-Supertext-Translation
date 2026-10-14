// Shopify locale codes → Supertext language codes. Shared by server and browser.
//
// No guessing (Supertext SDK `Languages`, v1): the shop's own mapping
// (Settings → Languages, one mapping for targets and the source) wins, else a
// Shopify locale that equals a Supertext code (apart from case and `_`/`-`),
// else the SDK error `unsupported_language` and nothing is sent. There are no
// default regions: Shopify's bare `de` must be mapped (e.g. to `de-CH`).
import {
  Languages,
  TARGET_LANGUAGES,
  type LanguageMapping,
} from "../../vendor/supertext-sdk/v1/index";

export { TARGET_LANGUAGES };
export type { LanguageMapping };

/** The target code to send for a Shopify locale; throws SupertextError("unsupported_language"). */
export const supertextTarget = (shopifyLocale: string, mapping: LanguageMapping): string =>
  Languages.target(shopifyLocale, mapping);

/** The source code to send for the shop's primary locale; throws SupertextError("unsupported_language"). */
export const supertextSource = (shopifyLocale: string, mapping: LanguageMapping): string =>
  Languages.source(shopifyLocale, mapping);

/** The target code for a locale, or null while it isn't mapped (for display). */
export function resolvedTarget(shopifyLocale: string, mapping: LanguageMapping): string | null {
  try {
    return supertextTarget(shopifyLocale, mapping);
  } catch {
    return null;
  }
}

/** The source code for a locale, or null while it isn't mapped (for display). */
export function resolvedSource(shopifyLocale: string, mapping: LanguageMapping): string | null {
  try {
    return supertextSource(shopifyLocale, mapping) || null;
  } catch {
    return null;
  }
}

/**
 * A code typed into the settings in Supertext's own spelling ("de_ch" → "de-CH"),
 * or null if Supertext doesn't offer it. The primary language also accepts a
 * bare source code ("en").
 */
export function canonicalCode(code: string, primary = false): string | null {
  const target = Languages.matchTarget(code);
  if (target) return target;
  if (primary && Languages.isSupportedSource(code)) return Languages.matchSource(code);
  return null;
}

/** Whether formal/informal can be sent for this target code (false for unknown codes). */
export const supportsPoliteness = (targetCode: string): boolean =>
  Languages.supportsPoliteness(targetCode) === true;

/** The formal/informal setting to send for a target: only where Supertext offers it, else the default. */
export const politenessFor = <P extends string>(politeness: P | "default", targetCode: string): P | "default" =>
  supportsPoliteness(targetCode) ? politeness : "default";
