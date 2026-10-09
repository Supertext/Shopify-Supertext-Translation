import type { MetaFunction } from "react-router";

/**
 * Public privacy policy of the Shopify app (linked from the App Store
 * listing). Keep it in step with what the code actually stores and sends;
 * see docs/APP_STORE.md. Draft: to be reviewed by Supertext before submission.
 */

export const meta: MetaFunction = () => [
  { title: "Privacy policy – Supertext Translation for Shopify" },
];

const UPDATED = "9 October 2026";

export default function Privacy() {
  return (
    <main style={page}>
      <h1>Privacy policy: Supertext Translation for Shopify</h1>
      <p style={{ color: "#6d7175" }}>Last updated {UPDATED}</p>

      <p>
        This policy explains what the Shopify app <strong>Supertext Translation</strong>{" "}
        (the &quot;app&quot;) does with data when a merchant installs it. The app is
        provided by Supertext (see the{" "}
        <a href="https://www.supertext.com/en/imprint">imprint</a>). The{" "}
        <a href="https://www.supertext.com/en/privacy">Supertext privacy policy</a>{" "}
        applies to the Supertext translation service itself.
      </p>

      <h2>What the app accesses</h2>
      <p>
        With the permissions the merchant approves at installation, the app
        reads the texts of products, collections, pages, blogs and blog posts,
        the shop&apos;s languages, and existing translations, and it writes
        translations. It has no access to customers, orders or payments, and it
        doesn&apos;t collect personal data of the shop&apos;s customers.
      </p>

      <h2>What the app stores</h2>
      <ul>
        <li>The shop&apos;s domain and the access token Shopify issues to the app.</li>
        <li>
          The merchant&apos;s Supertext API key, encrypted (AES-256-GCM), and the
          app settings (form of address, language codes).
        </li>
        <li>
          A list of recent translation runs: which items and languages were
          translated, counts and error messages. Not the texts themselves.
        </li>
      </ul>

      <h2>What the app sends to Supertext</h2>
      <p>
        When a merchant starts a translation, the texts of the selected items
        are sent to the Supertext AI translation API, authenticated with the
        merchant&apos;s own API key. The app deletes each file from Supertext as
        soon as the translation is downloaded. The translations are saved in
        the shop through Shopify&apos;s translation API.
      </p>

      <h2>Where the data is processed</h2>
      <p>
        The app runs on servers of Railway Corp. (United States). Supertext
        processes translations as described in its privacy policy.
      </p>

      <h2>How long data is kept, and deletion</h2>
      <p>
        When the app is uninstalled, its access token is removed right away.
        48 hours later, Shopify asks the app to delete the shop&apos;s data, and the
        app deletes the API key, the settings and the list of translation runs.
        Translations already written to the shop stay in the shop.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about privacy or this app:{" "}
        <a href="mailto:hello@supertext.com">hello@supertext.com</a> or{" "}
        <a href="https://www.supertext.com/en/contact">supertext.com/en/contact</a>.
      </p>
    </main>
  );
}

const page = {
  maxWidth: 720,
  margin: "40px auto",
  padding: "0 16px",
  font: "16px/1.55 Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  color: "#303030",
} as const;
