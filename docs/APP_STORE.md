# App Store submission — Supertext Translation for Shopify

Everything needed to submit the app for Shopify's review: what the app already does for the requirements, the listing texts, the reviewer instructions, and the steps only a person with the accounts can do.

Requirement numbers refer to Shopify's [App Store requirements](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements). Check the field limits in the submission form; Shopify changes them now and then.

## Distribution

Choose **Public distribution** in the Dev Dashboard (app → Distribution). The choice can't be changed later. A public app can be listed in the App Store or kept **unlisted** (installed only through its link); both need review before they install on real stores.

## Requirements the app already meets

| Requirement | How |
| --- | --- |
| 1.1.1 Session tokens, no third-party cookies | Shopify's React Router template (App Bridge, session tokens, token exchange) |
| 2.2.3 Latest App Bridge | `AppProvider` loads `app-bridge.js` from Shopify's CDN |
| 2.2.4 GraphQL Admin API only | All Shopify calls are GraphQL (`app/translation/shopify.server.ts`) |
| 2.3.1 No manual shop-domain entry | The landing page has no domain form; installs start from Shopify |
| 2.3.2–2.3.4 OAuth first, also after reinstall | Template auth on every `/app` route; `app/uninstalled` deletes the sessions |
| 3.1.1 Valid TLS | Railway domain with its certificate |
| 3.2 Minimal scopes | `read_products`, `read_content`, `read_locales`, `read_translations`, `write_translations`; no customer or order data |
| Privacy webhooks with HMAC check | `/webhooks/compliance` (data request, customer redact, shop redact); invalid signatures get 401 (tested) |
| Data protection | Supertext API keys stored with AES-256-GCM (`SUPERTEXT_KEY_ENCRYPTION_KEY`); shop data deleted on shop/redact |
| Privacy policy | Public page at `/privacy` (`app/routes/privacy.tsx`) |
| 2.1.3 No web errors | Errors show as messages in the app; interrupted translations (server restart) are marked and can be restarted |
| 1.2 Billing | The app charges nothing in Shopify. Merchants pay Supertext directly through their own Supertext account and API key (like other connector apps). If the reviewer asks, explain this in the test instructions. |

## Listing texts (draft)

**App name:** Supertext Translation

**App card subtitle:** Translate products and pages with Supertext AI

**App introduction:**
Translate your products, collections, pages and blog posts into all your store's languages with Supertext AI.

**App details:**
Supertext Translation connects your Shopify store to Supertext, the Swiss translation company. Pick the items and languages, and the app translates titles, descriptions and SEO texts in the background. Formatting, links and images in descriptions are kept. Translations go straight into Shopify's own translation store, so you can review and edit them in Translate & Adapt. Choose formal or informal language and the regional variant, such as Swiss German. Requires a Supertext account.

**Features:**
- Translate products, collections, pages, blogs and blog posts in bulk
- Keeps headings, lists, bold text and links in descriptions
- Saves translations to Shopify, ready to review in Translate & Adapt
- Regional variants per language, like de-CH or fr-FR
- Formal or informal form of address

**Pricing:** Free to install. Translation is billed by Supertext through your Supertext account.

**Category / tags:** Store design → Language & translation (pick the closest current category; tags: translation, multilingual).

**Requirements to mention (4.3.8):** Requires a Supertext account and API key; at least one additional language in the store.

**Links:** Privacy policy `https://shopify-production-d86d.up.railway.app/privacy` · Support `https://www.supertext.com/en/contact` · Support email `hello@supertext.com` · Documentation: the user guide on GitHub.

## Test instructions for reviewers (draft)

> 1. Install the app from the install link and approve the permissions.
> 2. In Shopify, open Settings → Languages and add German (no need to publish).
> 3. Open Apps → Supertext Translation → Settings. Paste this Supertext API key: **[reviewer API key]**, then click *Save and test connection*. It shows "Supertext accepted the API key".
> 4. Open Translate. Products is selected; tick one or two products. German is ticked. Click *Translate with Supertext*.
> 5. Under *Recent translations* the run shows progress and then *Done*. Open the product in Translate & Adapt (or switch the store's language) to see the German title and description.
>
> The app is free; translation costs are billed by Supertext to the merchant's own Supertext account. The key above is a test account with credit for the review.

## Screencast script (4.5.3, English, 2–3 minutes)

1. Install from the link, approve permissions, the app opens.
2. Settings: paste the API key, *Save and test connection*, show the Languages section with de-DE / de-CH.
3. Translate: choose products, select two, German and French ticked, start.
4. Progress under *Recent translations*, then *Done*.
5. Show the result in Translate & Adapt and on the storefront in German.
6. Translate the same product again without *Overwrite*: fields are kept.

## Assets

| Asset | Size | Content |
| --- | --- | --- |
| App icon | 1200 × 1200 px, PNG/JPG | Supertext logo mark; no Shopify logo, no text with prices (4.2.2, 4.4.3) |
| Screenshots | 1600 × 900 px, 3–6 | The real app UI only, no browser frame (4.4.4), each one different (4.4.5): translate page, languages and progress, settings with languages, result in Translate & Adapt |
| Feature image (optional) | 1600 × 900 px | |

## Steps only Supertext can do

1. Choose **Public distribution** in the Dev Dashboard.
2. Add an **emergency developer contact** (4.5.6) in the Dev Dashboard.
3. Create a **Supertext test account and API key** with some credit for the reviewers, and put the key into the test instructions (4.5.4/4.5.5). Keep it valid during review.
4. Have the **privacy policy** at `/privacy` checked by whoever owns privacy at Supertext.
5. Make the **icon and screenshots**, record the **screencast**.
6. Fill in the listing with the texts above and submit.

## Hosting region

The app server and its database run in Railway's EU region (Amsterdam); the privacy policy says so. If the region changes, update the *Where the data is processed* section of `/privacy`.
