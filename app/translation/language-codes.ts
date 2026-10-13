// Shopify locale codes → Supertext language codes. Shared by server and browser.
//
// Shopify mostly uses bare language codes ("de", "fr"), some with a region
// ("pt-BR", "zh-CN"). Supertext needs a regional code as target ("de-DE",
// "en-US"); the source is sent as the bare language ("en"). Each shop can
// override the code per language under Settings → Languages.
//
// The rules and default regions come from the bundled Supertext SDK.
import {
  isValid,
  normalize,
  target,
} from "../../vendor/supertext-sdk/language-codes";

/** "pt-br" → "pt-BR"; "de" → "de". */
export const normalizeCode = (code: string): string => normalize(code);

/** The suggested Supertext code for a Shopify locale ("de" → "de-DE"). */
export const defaultSupertextCode = (shopifyLocale: string): string => target(shopifyLocale);

/** The code to send for a Shopify locale: the shop's own setting, else the default. */
export const supertextCode = (
  shopifyLocale: string,
  overrides: Record<string, string>,
): string => target(shopifyLocale, overrides);

/** A plausible language code: "de", "de-CH", "zh-Hant-TW", "es-419". */
export const isValidCode = (code: string): boolean => isValid(code);
