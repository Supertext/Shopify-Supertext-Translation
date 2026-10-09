import { useState } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Form, useActionData, useLoaderData } from "react-router";

import { login } from "../../shopify.server";
import { loginErrorMessage } from "./error.server";
import { localeFromRequest, translator } from "../../i18n";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const errors = loginErrorMessage(await login(request));

  return { errors, locale: localeFromRequest(request) };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const errors = loginErrorMessage(await login(request));

  return {
    errors,
    locale: localeFromRequest(request),
  };
};

export default function Auth() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [shop, setShop] = useState("");
  const { errors, locale } = actionData || loaderData;
  const { t } = translator(locale);

  return (
    <>
      <script src="https://cdn.shopify.com/shopifycloud/polaris.js" />
      <s-page>
        <Form method="post">
        <s-section heading={t("login.heading")}>
          <s-text-field
            name="shop"
            label={t("login.shopDomain")}
            details="example.myshopify.com"
            value={shop}
            onChange={(e) => setShop(e.currentTarget.value)}
            autocomplete="on"
            error={errors.shop ? t(errors.shop) : undefined}
          ></s-text-field>
          <s-button type="submit">{t("login.submit")}</s-button>
        </s-section>
        </Form>
      </s-page>
    </>
  );
}
