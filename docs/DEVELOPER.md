# Developer guide — Supertext Translation for Shopify

## Repository layout

```
app/
  routes/
    app.tsx                 embedded admin layout and navigation
    app._index.tsx          Translate page (list, languages, start job, progress)
    app.settings.tsx        API key, form of address, connection test, version
    webhooks.*.tsx          app/uninstalled, app/scopes_update, privacy compliance
    healthz.tsx             health check for Railway
    privacy.tsx             public privacy policy (linked from the App Store listing)
    _index/, auth.*         landing and login pages from the template
  translation/
    shopify.server.ts       GraphQL Admin API calls (locales, resources, translationsRegister)
    fields.server.ts        which fields go to Supertext, and back into translation inputs
    translate.server.ts     one resource × one locale: read → Supertext → register
    process.server.ts       a whole job: every resource × every locale
    resource-types.ts       the resource types the UI offers (shared with the browser)
    language-codes.ts       Shopify locale → Supertext code (defaults, per-shop overrides)
  supertext/
    client.server.ts        Supertext AI file translation client (same as the other plugins)
    html.server.ts          packs fields into one HTML document and back
  i18n/
    en.ts, de.ts, fr.ts, it.ts  interface strings (English is the source and fallback)
    index.ts                locale from Shopify's ?locale=, translator, plural forms
    react.tsx               I18nProvider / useI18n, rich() for links inside sentences
    error.ts                LocalizedError: English message + code for the UI
  jobs.server.ts            job rows in the database, background runner
  settings.server.ts        per-shop settings, API key resolution
  crypto.server.ts          AES-256-GCM encryption of stored API keys
  version.server.ts         app version from package.json
  shopify.server.ts         Shopify app setup (auth, sessions, API version)
prisma/                     schema and migrations (PostgreSQL)
scripts/start.mjs           production start: create database, migrate, serve
test/                       Vitest unit tests with fake Shopify and fake Supertext
shopify.app.toml            app configuration: client ID, URLs, scopes, webhooks
```

## Interface languages

The app's UI is in English, German, French and Italian and follows the merchant's admin language: Shopify adds `?locale=` (e.g. `de`, `fr-CA`) when it loads an embedded app. `app/routes/app.tsx` reads it once (`localeFromRequest`, falling back to `Accept-Language`, then English) and provides it to every page through `I18nProvider`; it sets `shouldRevalidate` to false because later requests from inside the app don't carry `?locale=`. The landing and login pages read it from their own request.

- Strings live in `app/i18n/{en,de,fr,it}.ts`. `en.ts` defines the keys; the other files are typed `Messages`, so a missing key fails `npm run typecheck`, and `test/i18n.test.ts` checks that placeholders, URLs and "Supertext" are kept. **Every new or changed string gets all four languages in the same commit.** Formal address (Sie, vous, Lei), Shopify's own terms in each language (de *Kategorien*, *Blogbeiträge*; fr *boutique*; it *negozio*, *collezioni*), placeholders and URLs untranslated; French uses `\u00a0` before `? ! : ;`.
- Plurals: keys ending in `.one` / `.other`, used with `tn(key, count)` (`Intl.PluralRules`).
- Server errors shown in the UI are `LocalizedError`s (`SupertextError` is one): an English `message` for logs plus a `code` and `params` that select `error.<code>` in the message files; `detail` (Supertext's or Shopify's own text) is shown as it is. Job errors are stored with these fields in the job row, so the page translates them when it shows them. Actions return message keys, not text.

## How a translation runs

1. The Translate page lists items with `translatableResources(resourceType: …)` and the languages with `shopLocales`.
2. *Translate with Supertext* posts the selected resource IDs and locales. The action creates a `TranslationJob` row and starts the job in the same process (`jobs.server.ts`), then returns at once.
3. The job gets the shop's offline Admin API session (`unauthenticated.admin(shop)`) and, for each resource and each locale, one after the other:
   - reads `translatableResource(resourceId)` with `translatableContent { key value digest type }` and `translations(locale) { key value outdated }`;
   - selects fields (`fields.server.ts`): types `STRING`, `SINGLE_LINE_TEXT_FIELD`, `MULTI_LINE_TEXT_FIELD` as escaped plain text; `HTML`, `INLINE_RICH_TEXT` as markup; skips `handle`, empty values and other types (JSON, URLs, file references); skips fields with a current translation unless *overwrite*; outdated translations are always redone;
   - builds one HTML document with one `<div data-st-id="N">` per field (a whole field per element, as the shared rich-text rule requires), split into several documents above 900,000 characters;
   - translates it with Supertext: source = the shop's primary locale (sent as the bare language, e.g. `en`), target = the locale's **Supertext code** (`translation/language-codes.ts`): the shop's own setting, else Shopify's code if it has a region (`pt-BR`), else a regional default (`de` → `de-DE`, `fr` → `fr-FR`, `en` → `en-US`). Supertext rejects bare targets like `de` with `INVALID_LANGUAGE_PAIR`; the client turns that into a message pointing to Settings → Languages, and the job reports it once per language and skips that language;
   - writes the fields with `translationsRegister`, passing each field's `translatableContentDigest`. If Supertext returns fewer fields than sent, nothing is written for that item.
4. Progress (`completed`, `written`, `skipped`, `errors`) is saved after every pair; the page polls every 2 seconds while a job runs. Authentication and limit errors stop the job, other errors only skip the item.

## Shopify API

- Admin GraphQL API version `2026-10` (`ApiVersion.October26`, webhooks in `shopify.app.toml`).
- Scopes: `read_products` (products, collections), `read_content` (pages, blogs, articles), `read_locales`, `read_translations`, `write_translations`. Change them in `shopify.app.toml` and `SCOPES` together.
- Distribution is `AppStore` in `shopify.server.ts` (works for custom-distribution installs as well).
- Since January 2026, apps can no longer be created in a store's own admin: the app is created in the **Dev Dashboard** (dev.shopify.com). Client ID `d001de0fc4c060b4b044489f7992553a` (public, in `shopify.app.toml`); the client secret is only in Railway (`SHOPIFY_API_SECRET`).

## Supertext API protocol

AI file translation API v1 at `https://api.supertext.com/v1/`, same as the WordPress plugin:

1. `POST translate/ai/file` (multipart): `file` (type exactly `text/html`), `target_lang`, `source_lang` (primary subtag only), optional `politeness` (`more`/`less`) → `{ file_id }`.
2. `GET translate/ai/file/{id}/status` every 2 s until `done` (`error`, `limit_exceeded`, `deleted` stop; timeout 3 minutes).
3. `GET translate/ai/file/{id}/translation` → the translated HTML.
4. `DELETE translate/ai/file/{id}`, always.

Header `Authorization: Supertext-Auth-Key <key>` (a pasted prefix is stripped). HTTP 429 is retried up to 4 times (`Retry-After`, else 1/2/4/8 s with jitter). `GET features` validates the key (*Save and test connection*).

The API key is the shop's own (Settings, stored encrypted in `ShopSettings`; keys saved before encryption existed are encrypted on first read), else the `SUPERTEXT_API_KEY` variable. `SUPERTEXT_API_ENDPOINT` points the app at a stand-in API.

## Local development

Requirements: Node.js 22.12+, a PostgreSQL database, the [Shopify CLI](https://shopify.dev/docs/apps/tools/cli) and access to the app in the Dev Dashboard.

```bash
npm install
cp .env.example .env          # DATABASE_URL at minimum
npx prisma migrate deploy
npm run dev                   # shopify app dev: tunnel, install on a dev store
```

`shopify app dev` asks you to log in, picks the app (*Supertext Translation*) and a development store, and temporarily points the app's URLs at a tunnel.

## Tests

```bash
npm test            # Vitest: Supertext client, HTML round trip, field selection, translation flow, job loop
npm run typecheck
npm run build
```

The tests use a fake Admin API client and a fake Supertext, so they need neither a store nor a database.

## Hosting (Railway)

The backend runs on Railway (project *supertext-cms-demos*, service **Shopify**, EU region Amsterdam, like the shared Postgres; the privacy policy names the region) from this repo's `Dockerfile` (`railway.json`, health check `/healthz`). Every push to `main` deploys. If pushes stop deploying, check that Railway's GitHub app has access to this repo (https://github.com/organizations/Supertext/settings/installations → Railway → Configure), then reconnect the service's source once.

| Variable | Value |
| --- | --- |
| `SHOPIFY_API_KEY` | the client ID |
| `SHOPIFY_API_SECRET` | the client secret (Dev Dashboard → app → Settings) |
| `SHOPIFY_APP_URL` | the service's public URL, e.g. `https://shopify-production-d86d.up.railway.app` |
| `SCOPES` | as in `shopify.app.toml` |
| `DATABASE_URL` | the shared Postgres service's URL |
| `SHOPIFY_DB_NAME` | `shopify_supertext` (created on first start) |
| `SUPERTEXT_API_KEY` | optional default key (the demo store) |
| `SUPERTEXT_KEY_ENCRYPTION_KEY` | random string of at least 32 characters (e.g. `openssl rand -base64 48`). Encrypts the shops' Supertext API keys (AES-256-GCM, `app/crypto.server.ts`). Required: without it, keys can't be saved. If it changes, stored keys can't be read any more and shops are asked to enter theirs again; so never rotate it casually. |

`scripts/start.mjs` creates `SHOPIFY_DB_NAME` on the Postgres server if needed, runs `prisma migrate deploy` and starts `react-router-serve`. When the URL changes, update `application_url` and `redirect_urls` in `shopify.app.toml` and deploy the configuration (next section).

## Deploying the app configuration

URLs, scopes and webhooks are app configuration in Shopify, separate from the code. After changing `shopify.app.toml`:

```bash
npx shopify app deploy        # creates a new app version from shopify.app.toml
```

Without the CLI, create a new version in the Dev Dashboard (app → Versions → Create version) with the same URL, redirect URLs and scopes.

## Demo

The demo is a Shopify **development store** (free, from a Shopify developer account), not a container: Shopify hosts the store, Railway only the app backend.

Setting it up (once, by hand, because development stores can't be created or seeded from outside):

1. Dev Dashboard → **Dev stores** → create *supertext-demo*.
2. Settings → Languages: add German and French (published or not).
3. Add a few sample products, a page and a blog post in English.
4. Settings → Users: add staff accounts for Supertext staff (full permissions) and an editor-level account with *Apps* permission for tests and screenshots. Passwords stay in Keeper, never in the repo or chat.
5. Install the app from the Dev Dashboard (app → Install app → the dev store), and enter the API key under Settings, or set `SUPERTEXT_API_KEY` on Railway.

## Releasing

`package.json` holds the version (the release workflow's `VERSION_FILES`); the settings page reads it at runtime.

1. Move the *Unreleased* entries in `CHANGELOG.md` under a new `## X.Y.Z — YYYY-MM-DD` heading, leaving *Unreleased* empty.
2. Set the same version in `package.json` (and `package-lock.json`, via `npm version X.Y.Z --no-git-tag-version`).
3. Push to `main`. `.github/workflows/release.yml` tags `vX.Y.Z` and creates the GitHub release with the changelog section; 0.x versions are pre-releases.
4. Railway deploys the code on the same push; run `npx shopify app deploy` if `shopify.app.toml` changed.

Never tag or create releases by hand.

## Known limitations / roadmap

- Jobs run inside the web process. A restart (every deploy) stops running jobs; on start, `scripts/start.mjs` marks them *failed* with "Interrupted by an app update", and the merchant starts them again (finished items are kept). A queue that resumes them comes later.
- Only products, collections, pages, blog posts and blogs. Next: product options and values, metafields, metaobjects, menus, shop policies, theme texts.
- JSON rich-text fields (metafields of type rich text) and URL handles aren't translated.
- Up to 50 items per run (one page of the list); selecting across pages and "translate everything" come later.
- An admin action on the product and collection pages (*Translate with Supertext* in the **More actions** menu) would save a trip to the app.
- Not in the App Store yet: see [APP_STORE.md](APP_STORE.md) for the submission checklist, listing texts and reviewer instructions.
- The demo store is set up by hand; screenshots for the guides follow once it exists.
