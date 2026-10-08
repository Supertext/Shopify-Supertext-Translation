import type { LoaderFunctionArgs } from "react-router";
import { redirect, Form, useLoaderData } from "react-router";

import { login } from "../../shopify.server";

import styles from "./styles.module.css";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }

  return { showForm: Boolean(login) };
};

export default function App() {
  const { showForm } = useLoaderData<typeof loader>();

  return (
    <div className={styles.index}>
      <div className={styles.content}>
        <h1 className={styles.heading}>Supertext Translation for Shopify</h1>
        <p className={styles.text}>
          Translate your products, collections, pages and blog posts with
          Supertext AI, right from the Shopify admin.
        </p>
        {showForm && (
          <Form className={styles.form} method="post" action="/auth/login">
            <label className={styles.label}>
              <span>Shop domain</span>
              <input className={styles.input} type="text" name="shop" />
              <span>e.g: my-shop-domain.myshopify.com</span>
            </label>
            <button className={styles.button} type="submit">
              Log in
            </button>
          </Form>
        )}
        <ul className={styles.list}>
          <li>
            <strong>All your languages at once</strong>. Pick the items and the
            languages, and Supertext translates them in the background.
          </li>
          <li>
            <strong>Formatting kept</strong>. Product descriptions keep their
            headings, lists, bold text and links.
          </li>
          <li>
            <strong>Review in Shopify</strong>. Translations land in
            Shopify&apos;s own translation store, so you can check and edit them
            in Translate &amp; Adapt.
          </li>
        </ul>
      </div>
    </div>
  );
}
