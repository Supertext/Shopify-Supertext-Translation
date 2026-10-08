// Shopify locale codes → Supertext language codes. Shared by server and browser.
//
// Shopify mostly uses bare language codes ("de", "fr"), some with a region
// ("pt-BR", "zh-CN"). Supertext needs a regional code as target ("de-DE",
// "en-US"); the source is sent as the bare language ("en"). Each shop can
// override the code per language under Settings → Languages.

/** The region Supertext uses when a Shopify locale has none. */
const DEFAULT_REGION: Record<string, string> = {
  ar: "ar-SA",
  bg: "bg-BG",
  cs: "cs-CZ",
  da: "da-DK",
  de: "de-DE",
  el: "el-GR",
  en: "en-US",
  es: "es-ES",
  et: "et-EE",
  fi: "fi-FI",
  fr: "fr-FR",
  hr: "hr-HR",
  hu: "hu-HU",
  it: "it-IT",
  ja: "ja-JP",
  ko: "ko-KR",
  lt: "lt-LT",
  lv: "lv-LV",
  nb: "nb-NO",
  nl: "nl-NL",
  pl: "pl-PL",
  pt: "pt-PT",
  ro: "ro-RO",
  ru: "ru-RU",
  sk: "sk-SK",
  sl: "sl-SI",
  sr: "sr-RS",
  sv: "sv-SE",
  th: "th-TH",
  tr: "tr-TR",
  uk: "uk-UA",
  vi: "vi-VN",
  zh: "zh-CN",
};

/** "pt-br" → "pt-BR"; "de" → "de". */
export function normalizeCode(code: string): string {
  const [language, ...rest] = code.trim().replace(/_/g, "-").split("-");
  if (!language) return "";
  const region = rest.join("-");
  if (!region) return language.toLowerCase();
  return `${language.toLowerCase()}-${region.length === 2 ? region.toUpperCase() : region}`;
}

/** The suggested Supertext code for a Shopify locale. */
export function defaultSupertextCode(shopifyLocale: string): string {
  const code = normalizeCode(shopifyLocale);
  if (code.includes("-")) return code;
  return DEFAULT_REGION[code] ?? code;
}

/** The code to send for a Shopify locale: the shop's own setting, else the default. */
export function supertextCode(
  shopifyLocale: string,
  overrides: Record<string, string>,
): string {
  const own = overrides[shopifyLocale]?.trim();
  return own ? normalizeCode(own) : defaultSupertextCode(shopifyLocale);
}

/** A plausible language code: "de", "de-CH", "zh-Hant", "es-419". */
export const isValidCode = (code: string): boolean =>
  /^[a-z]{2,3}(-([A-Z]{2}|[A-Za-z]{4}|\d{3}))?$/.test(normalizeCode(code));
