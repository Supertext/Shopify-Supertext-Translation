# Changelog

## Unreleased

- Added: German, French and Italian interface. The app follows the Shopify admin language (`locale` parameter), English otherwise; errors from Supertext and Shopify are shown in that language too.
- The *Authentication failed* message now also links to the Supertext sign-up page.
- Supertext API keys are stored encrypted (AES-256-GCM). Keys saved earlier are encrypted automatically the next time they are used. If a stored key can't be read, Settings asks to enter it again.
- Translations interrupted by an app update are now marked *Interrupted by an app update* instead of staying *Translating…* forever.
- Public privacy policy page at `/privacy`.
- The start page no longer asks for a shop domain (App Store rule 2.3.1); installs start from Shopify.
- docs/APP_STORE.md: submission checklist, listing texts, reviewer instructions and screencast script.
- A **Settings** link at the top of the translate page and next to the languages, so Settings is easy to find on a phone, where the admin doesn't show the app's menu.
- Settings → Languages: the Supertext code for each shop language, pre-filled with a regional default (de → de-DE, fr → fr-FR, en → en-US, …) and editable (e.g. de-CH). Fixes translations failing with *INVALID_LANGUAGE_PAIR*, because Supertext needs a region for the target language and Shopify uses bare codes like "de". The translate page shows the code each language is sent with.
- A language Supertext refuses is now reported once per run, with a message pointing to Settings → Languages, instead of once per item.
- First version: an embedded Shopify app, **Apps → Supertext Translation**, made from Shopify's React Router template.
- Translate page: pick products, collections, pages, blog posts or blogs and the target languages, then *Translate with Supertext*. Runs in the background with progress and per-item errors under *Recent translations*.
- Translates text and HTML fields (titles, descriptions, SEO title and description, …) and writes them to Shopify's translation store with `translationsRegister`; URL handles are left alone. Existing translations are kept unless *Overwrite existing translations* is ticked; outdated ones are always translated again.
- Settings page: Supertext API key (with links to create an account and generate the key), form of address, connection test, and the app version linked to its GitHub release.
- Supertext client shared with the other plugins: retries on HTTP 429, accepts the key with or without the `Supertext-Auth-Key ` prefix, splits very large items into several documents.
- Privacy webhooks (customer data request, customer redact, shop redact).
- Dockerfile and Railway configuration; the app creates its own database on the shared Postgres server on start.
- Installation guide, user guide and developer guide; unit tests against a stand-in Shopify and Supertext.
