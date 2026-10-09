import { createContext, Fragment, useContext, type ReactNode } from "react";
import {
  DEFAULT_LOCALE,
  translator,
  type Locale,
  type MessageKey,
  type MessageParams,
  type Translator,
} from "./index";

const I18nContext = createContext<Translator>(translator(DEFAULT_LOCALE));

export function I18nProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <I18nContext.Provider value={translator(locale)}>{children}</I18nContext.Provider>;
}

/** The translator for the merchant's admin language (set by the /app layout). */
export const useI18n = () => useContext(I18nContext);

/**
 * A message whose placeholders are filled with elements, e.g. a link inside a
 * sentence: rich(t, "translate.noKey.text", { settings: <s-link …>…</s-link> }).
 */
export function rich(
  i18n: Translator,
  key: MessageKey,
  elements: Record<string, ReactNode>,
  params?: MessageParams,
): ReactNode {
  return i18n
    .t(key, params)
    .split(/\{(\w+)\}/)
    .map((part, index) =>
      index % 2 === 1 ? (
        <Fragment key={index}>{part in elements ? elements[part] : `{${part}}`}</Fragment>
      ) : (
        part
      ),
    );
}

/** "No Supertext account yet? Create one … Generate your API key at …", with both links. */
export function ApiKeyHelp() {
  const i18n = useI18n();
  return (
    <>
      {rich(i18n, "apiKeyHelp.text", {
        signup: (
          <a
            href="https://www.supertext.com/person/en/account/signin"
            target="_blank"
            rel="noopener noreferrer"
          >
            {i18n.t("apiKeyHelp.signup")}
          </a>
        ),
        apiKey: (
          <a
            href="https://www.supertext.com/en/integrations/api"
            target="_blank"
            rel="noopener noreferrer"
          >
            {i18n.t("apiKeyHelp.apiKey")}
          </a>
        ),
      })}
    </>
  );
}
