# Changelog

## Unreleased

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
