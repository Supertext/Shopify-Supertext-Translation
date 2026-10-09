# Working on this repository

Part of Supertext's translation plugins project: Supertext AI translation for the top open source CMS, plus PIM systems (Akeneo, AtroPIM, Pimcore) and e-commerce systems (Shopify). Each system has its own repo named `Supertext/<System>-Supertext-Translation`.

This repo is a **Shopify app** (Shopify's React Router template): an embedded admin page hosted on Railway, talking to Shopify through the GraphQL Admin API. See `docs/DEVELOPER.md`.

## Documentation rule (always)

Every plugin repo keeps three guides, and **every change that affects behaviour, settings, installation or the code structure updates them in the same commit**:

| File | Audience | Must cover |
| --- | --- | --- |
| `docs/INSTALLATION.md` | Administrators | Requirements, install/update/uninstall, API key, language setup, all settings, troubleshooting |
| `docs/USER_GUIDE.md` | Editors | How to translate and review in the CMS's own UI, what is and isn't translated, what errors mean |
| `docs/DEVELOPER.md` | Developers | Architecture, Supertext API protocol, local setup, tests, CI/deploy, releasing, known limitations/roadmap |

Also: `README.md` stays a short overview linking the three guides, and `CHANGELOG.md` gets an entry under *Unreleased* for every user-visible change. Before finishing any task, check the docs still match the code.

## Supertext account and API key links (always)

Everywhere an administrator enters or is told about the API key — the settings field's help text, the "no API key" / "authentication failed" messages, `docs/INSTALLATION.md`, `README.md` and the demo's `.env.example` — show both links (same as the WordPress plugin):

- Create a Supertext account (or log in): https://www.supertext.com/person/en/account/signin
- Generate the AI API key: https://www.supertext.com/en/integrations/api (supertext.com → Integrations → API; requires the **Admin** role)

Wording: "No Supertext account yet? Create one at supertext.com. Generate your API key at supertext.com → Integrations → API (requires the Admin role)." In the UI, links open in a new tab (`target="_blank" rel="noopener"`); where the CMS shows plain text only, use the bare URLs.

## UI languages (always)

The plugin's own UI (buttons, panels, dialogs, settings, permissions, messages) is available in English, German, French and Italian through the CMS's own translation mechanism, so it follows the user's back-end language. New or changed strings get all four languages in the same commit. Formal address (Sie, vous, Lei), the CMS's own terms in each language, "Supertext", placeholders and URLs never translated.

Here: Shopify passes the admin language as `?locale=`; strings live in `app/i18n/{en,de,fr,it}.ts` (typed, so a missing key fails `npm run typecheck`; `test/i18n.test.ts` checks placeholders and URLs). Server errors shown in the UI are `LocalizedError`s with a `code` (`error.<code>`); actions return message keys, not English text. See `docs/DEVELOPER.md` → *Interface languages*.

## Plugin version on the settings screen (always)

Where the CMS doesn't show the plugin's version itself, the plugin's own settings or status screen does. It is read at runtime from the official version source (here `package.json`), never a second hardcoded copy, and links to the GitHub release when it is an X.Y.Z version.

## Plugin list (always)

`README.md` ends with the shared list of all Supertext plugins, between the `<!-- supertext-plugins:start -->` and `<!-- supertext-plugins:end -->` markers. It is identical in every Supertext plugin repo: when a plugin is added, renamed or its description changes, update the list in **all** repos. The project's `plugin-conventions.md` holds the current block. The e-commerce table (Shopify, PrestaShop) is added to the shared list by the PrestaShop work; until then this repo carries the CMS and PIM tables only.

## Releases (always)

`.github/workflows/release.yml` publishes a GitHub release only when the version is officially bumped: a new `## X.Y.Z — YYYY-MM-DD` section at the top of `CHANGELOG.md`, below an empty *Unreleased*, with `package.json` (the workflow's `VERSION_FILES`) carrying the same number. Then it tags `vX.Y.Z` and creates the release with that CHANGELOG section as notes (0.x as pre-releases). Pushes without a new version release nothing. Never tag or create releases by hand. A Shopify app has no installable file: `shopify app deploy` publishes the app configuration, Railway deploys the code.

## Repo setup (always)

Every Supertext plugin repo has, and a new one gets from the start:

- `LICENSE` matching the license its manifest declares (`composer.json`, `package.json`, `pyproject.toml`, `.csproj`, plugin header).
- `SECURITY.md`: report vulnerabilities privately through GitHub's private vulnerability reporting or support@supertext.com, never in public issues.
- `.github/dependabot.yml`: weekly updates for its package ecosystem and GitHub Actions, minor and patch updates grouped into one pull request.
- On GitHub: the About box filled in (one-sentence description, website https://www.supertext.com, topics), `main` protected against force-pushes and deletion, Wiki and Projects off, Dependabot alerts and private vulnerability reporting on, and the Supertext social preview image.
- A row in the plugin list (see *Plugin list*) and in the org profile (`Supertext/.github` → `profile/README.md`).

Claude sessions can't change GitHub repo settings (HTTP 403): add a new repo to Remy's setup script (`set-github-about`) instead of trying.

## Demo accounts rule (always)

The demo shop is a Shopify development store, so the CMS-style `DEMO_*` accounts are Shopify staff accounts and are set up by hand in the store (see `docs/DEVELOPER.md` → *Demo*). Values never go in the repo, in chat or in logs.

## Screenshots rule (always)

The user guide and installation guide include screenshots of the real UI, taken from the demo store by a committed script against a stand-in API that returns real translations, stored in `docs/images/`, small, with alt text, and regenerated whenever the UI they show changes. No secrets, no customer data, no local URLs.

## Shared Supertext protocol

AI file translation API v1, same as the WordPress plugin: POST HTML file → poll status → GET translation → DELETE. Details in `docs/DEVELOPER.md`. Never commit API keys or the Shopify client secret; use environment variables (`SUPERTEXT_API_KEY`, `SHOPIFY_API_SECRET`) or the app's settings.

- **Auth header:** `Authorization: Supertext-Auth-Key <key>`. Strip a pasted `Supertext-Auth-Key ` prefix and always send exactly one.
- **Rate limit:** HTTP 429 `RATE_LIMIT_EXCEEDED`; retry up to 4 times (`Retry-After`, else 1/2/4/8 s with jitter). Translate languages one after the other.
- **Rich text:** each element carrying `data-st-id` is translated on its own. Send a whole field (or paragraph) as **one** `data-st-id` element with formatting and links as inline tags; never one per formatted run.

## Railway lessons

- Railway builds from a `git archive` snapshot: never `export-ignore` anything the Dockerfile copies.
- Railway's GitHub access: https://github.com/organizations/Supertext/settings/installations → Railway → Configure; after a change, reconnect the service's source once.
- Postgres is shared; this app uses its own database on it (`SHOPIFY_DB_NAME`, default `shopify_supertext`).
