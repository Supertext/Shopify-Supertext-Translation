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

const SIGNIN_URL = "https://www.supertext.com/person/en/account/signin";
const API_KEY_URL = "https://www.supertext.com/en/integrations/api";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const settings = await getSettings(session.shop);
  const version = appVersion();
  return {
    hasShopKey: settings.apiKey !== "",
    usesEnvironmentKey: settings.apiKey === "" && effectiveApiKey(settings) !== "",
    politeness: settings.politeness,
    version,
    releaseUrl: releaseUrl(version),
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const form = await request.formData();
  const intent = form.get("intent");

  if (intent === "remove") {
    await removeApiKey(session.shop);
    return { ok: true, message: "The API key was removed." };
  }

  await saveSettings(session.shop, {
    apiKey: String(form.get("apiKey") ?? ""),
    politeness: toPoliteness(form.get("politeness")),
  });

  if (intent === "test") {
    const settings = await getSettings(session.shop);
    if (!effectiveApiKey(settings)) {
      return { ok: false, message: "No Supertext API key yet." };
    }
    try {
      await supertextClient(settings).validate();
      return { ok: true, message: "Saved. Supertext accepted the API key." };
    } catch (error) {
      return { ok: false, message: (error as Error).message };
    }
  }
  return { ok: true, message: "Settings saved." };
};

export default function Settings() {
  const data = useLoaderData<typeof loader>();
  const result = useActionData<typeof action>();
  const busy = useNavigation().state === "submitting";

  return (
    <s-page heading="Supertext settings">
      {result && (
        <s-banner tone={result.ok ? "success" : "critical"}>
          <s-paragraph>{result.message}</s-paragraph>
        </s-banner>
      )}

      <Form method="post">
        <s-section heading="Supertext API key">
          <label htmlFor="apiKey" style={{ display: "block", fontWeight: 600 }}>
            API key
          </label>
          <input
            id="apiKey"
            name="apiKey"
            type="password"
            autoComplete="off"
            placeholder={
              data.hasShopKey
                ? "A key is saved. Enter a new one to replace it."
                : data.usesEnvironmentKey
                  ? "Using the key set on the server."
                  : "Paste your Supertext API key"
            }
            style={inputStyle}
          />
          <s-paragraph>
            No Supertext account yet?{" "}
            <a href={SIGNIN_URL} target="_blank" rel="noopener noreferrer">
              Create one at supertext.com
            </a>
            . Generate your API key at{" "}
            <a href={API_KEY_URL} target="_blank" rel="noopener noreferrer">
              supertext.com → Integrations → API
            </a>{" "}
            (requires the Admin role).
          </s-paragraph>
        </s-section>

        <s-section heading="Translation style">
          <label htmlFor="politeness" style={{ display: "block", fontWeight: 600 }}>
            Form of address
          </label>
          <select
            id="politeness"
            name="politeness"
            defaultValue={data.politeness}
            style={inputStyle}
          >
            <option value="default">Let Supertext decide</option>
            <option value="more">Formal (e.g. German “Sie”)</option>
            <option value="less">Informal (e.g. German “du”)</option>
          </select>
        </s-section>

        <s-section>
          <s-stack direction="inline" gap="base">
            <button type="submit" name="intent" value="save" disabled={busy} style={primary}>
              Save
            </button>
            <button type="submit" name="intent" value="test" disabled={busy} style={secondary}>
              Save and test connection
            </button>
            {data.hasShopKey && (
              <button type="submit" name="intent" value="remove" disabled={busy} style={secondary}>
                Remove API key
              </button>
            )}
          </s-stack>
        </s-section>
      </Form>

      <s-section slot="aside" heading="About">
        <s-paragraph>
          Supertext Translation{" "}
          {data.version ? (
            data.releaseUrl ? (
              <a href={data.releaseUrl} target="_blank" rel="noopener noreferrer">
                version {data.version}
              </a>
            ) : (
              `version ${data.version}`
            )
          ) : (
            "(version unknown)"
          )}
        </s-paragraph>
        <s-paragraph>
          Translations are written to Shopify&apos;s own translation store, so
          you can review and edit them in Shopify&apos;s Translate &amp; Adapt
          app.
        </s-paragraph>
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
