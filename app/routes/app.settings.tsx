import type {
  ActionFunctionArgs,
  HeadersFunction,
  LoaderFunctionArgs,
} from "react-router";
import { Form, useActionData, useLoaderData, useNavigation } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import {
  effectiveApiKey,
  getSettings,
  removeApiKey,
  saveSettings,
  supertextClient,
  toPoliteness,
} from "../settings.server";
import { appVersion, releaseUrl } from "../version.server";
import { EncryptionKeyMissing } from "../crypto.server";
import { shopLocales } from "../translation/shopify.server";
import {
  defaultSupertextCode,
  isValidCode,
  normalizeCode,
  supertextCode,
} from "../translation/language-codes";
import type { ErrorInfo, MessageKey, MessageParams } from "../i18n";
import { errorInfo } from "../i18n/error";
import { ApiKeyHelp, useI18n } from "../i18n/react";

/** What the action reports: a UI message key, or an error from Supertext. */
type Result =
  | { ok: boolean; key: MessageKey; params?: MessageParams }
  | { ok: false; error: ErrorInfo };

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const [settings, locales] = await Promise.all([
    getSettings(session.shop),
    shopLocales(admin),
  ]);
  const version = appVersion();
  return {
    languages: locales.map((l) => ({
      locale: l.locale,
      name: l.name,
      primary: l.primary,
      code: supertextCode(l.locale, settings.languageCodes),
      suggested: defaultSupertextCode(l.locale),
    })),
    hasShopKey: settings.apiKey !== "" || settings.apiKeyUnreadable,
    apiKeyUnreadable: settings.apiKeyUnreadable,
    usesEnvironmentKey: settings.apiKey === "" && effectiveApiKey(settings) !== "",
    politeness: settings.politeness,
    version,
    releaseUrl: releaseUrl(version),
  };
};

export const action = async ({ request }: ActionFunctionArgs): Promise<Result> => {
  const { session } = await authenticate.admin(request);
  const form = await request.formData();
  const intent = form.get("intent");

  if (intent === "remove") {
    await removeApiKey(session.shop);
    return { ok: true, key: "settings.removed" };
  }

  // Language codes: keep only the ones that differ from the suggestion.
  const languageCodes: Record<string, string> = {};
  const invalid: string[] = [];
  for (const [name, value] of form.entries()) {
    if (!name.startsWith("code:")) continue;
    const locale = name.slice(5);
    const code = normalizeCode(String(value));
    if (!code || code === defaultSupertextCode(locale)) continue;
    if (!isValidCode(code)) {
      invalid.push(`${locale}: "${String(value)}"`);
      continue;
    }
    languageCodes[locale] = code;
  }

  try {
    await saveSettings(session.shop, {
      apiKey: String(form.get("apiKey") ?? ""),
      politeness: toPoliteness(form.get("politeness")),
      languageCodes,
    });
  } catch (error) {
    if (error instanceof EncryptionKeyMissing) {
      console.error(`[supertext] ${error.message}`);
      return { ok: false, key: "settings.encryptionMissing" as const };
    }
    throw error;
  }
  if (invalid.length) {
    return { ok: false, key: "settings.invalidCodes", params: { codes: invalid.join(", ") } };
  }

  if (intent === "test") {
    const settings = await getSettings(session.shop);
    if (!effectiveApiKey(settings)) {
      return { ok: false, key: "settings.noKey" };
    }
    try {
      await supertextClient(settings).validate();
      return { ok: true, key: "settings.tested" };
    } catch (error) {
      return { ok: false, error: errorInfo(error) };
    }
  }
  return { ok: true, key: "settings.saved" };
};

export default function Settings() {
  const i18n = useI18n();
  const { t } = i18n;
  const data = useLoaderData<typeof loader>();
  const result = useActionData<typeof action>();
  const busy = useNavigation().state === "submitting";

  return (
    <s-page heading={t("settings.heading")}>
      {data.apiKeyUnreadable && (
        <s-banner tone="warning" heading={t("settings.keyUnreadable.heading")}>
          <s-paragraph>{t("settings.keyUnreadable.text")}</s-paragraph>
        </s-banner>
      )}
      {result && (
        <s-banner tone={result.ok ? "success" : "critical"}>
          <s-paragraph>
            {"error" in result ? i18n.error(result.error) : t(result.key, result.params)}
          </s-paragraph>
        </s-banner>
      )}

      <Form method="post">
        <s-section heading={t("settings.apiKey.heading")}>
          <label htmlFor="apiKey" style={{ display: "block", fontWeight: 600 }}>
            {t("settings.apiKey.label")}
          </label>
          <input
            id="apiKey"
            name="apiKey"
            type="password"
            autoComplete="off"
            placeholder={
              data.hasShopKey
                ? t("settings.apiKey.placeholderSaved")
                : data.usesEnvironmentKey
                  ? t("settings.apiKey.placeholderServer")
                  : t("settings.apiKey.placeholder")
            }
            style={inputStyle}
          />
          <s-paragraph>
            <ApiKeyHelp />
          </s-paragraph>
        </s-section>

        <s-section heading={t("settings.languages.heading")}>
          <s-paragraph>{t("settings.languages.text")}</s-paragraph>
          {data.languages.map((l) => (
            <div key={l.locale} style={{ margin: "8px 0" }}>
              <label htmlFor={`code-${l.locale}`} style={{ display: "block", fontWeight: 600 }}>
                {l.name} ({l.locale}){l.primary ? t("settings.languages.default") : ""}
              </label>
              <input
                id={`code-${l.locale}`}
                name={`code:${l.locale}`}
                defaultValue={l.code}
                placeholder={l.suggested}
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                style={{ ...inputStyle, maxWidth: 200, margin: "4px 0 0" }}
              />
            </div>
          ))}
        </s-section>

        <s-section heading={t("settings.style.heading")}>
          <label htmlFor="politeness" style={{ display: "block", fontWeight: 600 }}>
            {t("settings.style.label")}
          </label>
          <select
            id="politeness"
            name="politeness"
            defaultValue={data.politeness}
            style={inputStyle}
          >
            <option value="default">{t("settings.style.default")}</option>
            <option value="more">{t("settings.style.more")}</option>
            <option value="less">{t("settings.style.less")}</option>
          </select>
        </s-section>

        <s-section>
          <s-stack direction="inline" gap="base">
            <button type="submit" name="intent" value="save" disabled={busy} style={primary}>
              {t("settings.save")}
            </button>
            <button type="submit" name="intent" value="test" disabled={busy} style={secondary}>
              {t("settings.saveAndTest")}
            </button>
            {data.hasShopKey && (
              <button type="submit" name="intent" value="remove" disabled={busy} style={secondary}>
                {t("settings.removeKey")}
              </button>
            )}
          </s-stack>
        </s-section>
      </Form>

      <s-section slot="aside" heading={t("settings.about.heading")}>
        <s-paragraph>
          Supertext Translation{" "}
          {data.version ? (
            data.releaseUrl ? (
              <a href={data.releaseUrl} target="_blank" rel="noopener noreferrer">
                {t("settings.about.version", { version: data.version })}
              </a>
            ) : (
              t("settings.about.version", { version: data.version })
            )
          ) : (
            t("settings.about.versionUnknown")
          )}
        </s-paragraph>
        <s-paragraph>{t("settings.about.text")}</s-paragraph>
      </s-section>
    </s-page>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  maxWidth: 480,
  boxSizing: "border-box",
  margin: "6px 0 10px",
  padding: "8px 10px",
  border: "1px solid #8a8a8a",
  borderRadius: 8,
  font: "inherit",
} as const;

const primary = {
  background: "#303030",
  color: "#fff",
  border: 0,
  borderRadius: 8,
  padding: "8px 14px",
  font: "inherit",
  fontWeight: 600,
  cursor: "pointer",
} as const;

const secondary = {
  ...primary,
  background: "#fff",
  color: "#303030",
  border: "1px solid #8a8a8a",
} as const;

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
