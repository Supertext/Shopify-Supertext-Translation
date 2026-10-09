import type { LoaderFunctionArgs } from "react-router";
import { redirect, Form, useLoaderData } from "react-router";

import { login } from "../../shopify.server";
import { localeFromRequest, translator } from "../../i18n";

import styles from "./styles.module.css";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }

  return { showForm: Boolean(login), locale: localeFromRequest(request) };
};

export default function App() {
  const { showForm, locale } = useLoaderData<typeof loader>();
  const { t } = translator(locale);

  return (
    <div className={styles.index}>
      <div className={styles.content}>
        <h1 className={styles.heading}>{t("landing.heading")}</h1>
        <p className={styles.text}>{t("landing.intro")}</p>
        {showForm && (
          <Form className={styles.form} method="post" action="/auth/login">
            <label className={styles.label}>
              <span>{t("login.shopDomain")}</span>
              <input className={styles.input} type="text" name="shop" />
              <span>{t("login.example")}</span>
            </label>
            <button className={styles.button} type="submit">
              {t("login.submit")}
            </button>
          </Form>
        )}
        <ul className={styles.list}>
          {([1, 2, 3] as const).map((n) => (
            <li key={n}>
              <strong>{t(`landing.feature${n}.title`)}</strong>.{" "}
              {t(`landing.feature${n}.text`)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
