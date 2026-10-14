# Installation guide — Supertext Translation for Shopify

For store owners and staff who manage apps. The app adds **Apps → Supertext Translation** to the Shopify admin. It is hosted by Supertext: there is nothing to install on a server.

> **Status:** version 0.x, not yet listed in the Shopify App Store. Supertext installs it on a store with an install link (see *Install the app*).

## Requirements

- A Shopify store, on any plan, or a free development store.
- At least one language besides the default one, added under **Settings → Languages** (see *Set up languages*).
- A Supertext account and AI API key:
  - No Supertext account yet? Create one at [supertext.com](https://www.supertext.com/person/en/account/signin).
  - Generate your API key at [supertext.com → Integrations → API](https://www.supertext.com/en/integrations/api) (requires the **Admin** role).
- To install apps you must be the store owner or a staff member with the permission to manage apps.

## Install the app

1. Open the install link Supertext sent you while logged in to your store's admin.
2. Shopify shows what the app may access (below). Click **Install**.
3. The app opens under **Apps → Supertext Translation**.

The app asks for these permissions, and only these:

| Permission | Why |
| --- | --- |
| Read products | To read product and collection texts |
| Read content | To read pages, blogs and blog posts |
| Read languages | To show your shop's languages |
| Read and write translations | To save the translations in Shopify's translation store |

It can't change your products, prices, orders or customers, and it doesn't read customer data.

## Enter the API key

1. Open **Apps → Supertext Translation → Settings** (on a phone: the **Settings** link at the top of the translate page).
2. Paste the key into **API key**. A key copied with its `Supertext-Auth-Key ` prefix works too.
3. Click **Save**. The app checks the key with Supertext right away (nothing is translated or billed) and shows the result, for example *API key checked: the connection to Supertext works.* An invalid key is saved anyway; the message says what to do.

The **API key check** box next to the settings shows the last result and when it ran. **Test connection** there checks the saved key again.

The key is stored encrypted, for your store only, and never shown again. To replace it, paste a new one and save; **Remove API key** deletes it.

## Set up languages

The app translates into the languages your shop already has; it doesn't add languages itself.

1. In the Shopify admin, open **Settings → Languages**.
2. Click **Add language**, pick for example German or French, and add it.
3. The language appears in the app straight away. Customers see it only once you **publish** it in Shopify. The app shows unpublished languages with *not published yet*, so you can translate first and publish when you are happy.

The default language (shown as *Default* in Shopify) is the source language.

### Supertext language codes

Supertext translates into exact language variants, for example `de-CH` (Swiss Standard German, no "ß"), `de-DE`, `fr-CH`, `fr-FR`, `en-US`, `en-GB`, `pt-BR`. For German, English, French, Italian and Portuguese it has **no variant without a region**, and the app doesn't guess one. Shopify names most languages without a region (`de`, `fr`), so map them once under **Apps → Supertext Translation → Settings → Languages**:

1. Each of your shop's languages has a field. Type or pick the Supertext language from the list, for example `de-CH` for `de`, then click **Save**.
2. Under each field the page shows what is sent: *Sent to Supertext as de-CH*, or in red *Not mapped* while the language has no Supertext language. Unmapped languages can't be ticked on the translate page.
3. Languages whose Shopify code already is a Supertext code work without a mapping: `es`, `nl`, `sv`, `pl`, `pt-BR`, `zh-Hans` and so on. Your default language works too when it is a bare language Supertext translates from (`en`, `de`, …); map it only if it isn't (the same mapping is used for the source, e.g. `en` → `en-US` sends `en`).
4. Leave a field empty to remove its mapping. A code Supertext doesn't offer is not saved; the page lists it.

The full list is the one Supertext's API publishes (`GET features`): bg, cs, da, de-AT, de-CH, de-DE, el, en-GB, en-US, es, fi, fr-CH, fr-FR, gsw-u-sd-chbe, gsw-u-sd-chzh, hr, hu, it-CH, it-IT, ja, ko, nb, nl, pl, pt-BR, pt-PT, rm, ru, sk, sl, sq, sr-Cyrl, sr-Latn, sv, tr, zh-Hans, zh-Hant.

Formal and informal address (*Form of address*) applies only to languages that have it; for English, Romansh, Albanian, Serbian and Swiss German dialect the app sends no preference and the settings page notes it next to the language.

## All settings

| Setting | Where | What it does |
| --- | --- | --- |
| API key | Settings | Your Supertext AI key. Required. |
| Supertext language per language | Settings → Languages | The Supertext language a shop language is translated into (and from, for the default language), e.g. `de` → `de-CH`. Needed for Shopify codes that aren't Supertext codes (`de`, `fr`, `en`, `it`, `pt`); empty = not mapped. See *Supertext language codes*. |
| Form of address | Settings | *Let Supertext decide*, *Formal* (German "Sie") or *Informal* (German "du"). Sent only for languages that have the distinction. |
| Send version information to Supertext | Settings → Version information | On by default. See *Version information*. |
| Overwrite existing translations | Translate page, per run | Off: fields that already have a current translation are kept. On: everything selected is translated again. |

## Version information

With **Send version information to Supertext** on (the default), the app sends a short report to Supertext's support service (the Supertext Commando Center) when you save the settings and when the app, the Shopify API version it uses or its server runtime was updated. So Supertext support can see which version your shop runs and whether its API key works. A report contains exactly:

- your shop's address (`https://<your-shop>.myshopify.com`),
- the app's name and version, `Shopify` with the Admin API version the app uses, and the server runtime (Node.js) with its version,
- the version of the bundled Supertext SDK,
- whether an API key is set, and the result of the last API key check (`ok`, `invalid`, `missing`, `unreachable` or `error`, its time, Supertext's HTTP status and error code).

No content, no API key, no personal data. The app is hosted by Supertext, so there is no callback address. To turn it off, untick the setting and click **Save**: nothing more is sent, not even an "off" report. The API key check itself still runs, since it only talks to the Supertext API. Supertext can also turn reports off for all shops on the app's server (`SUPERTEXT_VERSION_REPORTS=0`); the setting then shows *Turned off for all shops on the app's server*.

## Interface languages

The app's own screens (Translate, Settings, messages and errors) are available in English, German, French and Italian. They follow the language of your Shopify admin, which Shopify passes to the app when it opens; other admin languages get English. To change it, click your name in the Shopify admin → **Manage account** → **Preferences** → **Language**, then reopen the app. This only affects the app's interface, not which languages your shop is translated into.

## Updating

Supertext updates the app for all stores; you don't need to do anything. If a new version needs more permissions, Shopify asks you to approve them the next time you open the app. The installed version is shown under **Settings → About**.

## Privacy

The app's privacy policy: https://shopify-production-d86d.up.railway.app/privacy. In short: it reads only your shop's texts and languages (no customer or order data), sends the selected texts to Supertext for translation, and stores your API key encrypted.

## Uninstalling

Open **Settings → Apps and sales channels**, choose **Supertext Translation** and click **Uninstall**. The translations the app created stay in your shop, and you can keep editing them in Shopify. 48 hours after uninstalling, Shopify tells the app to delete everything it kept for your store (your API key and the list of past translations), and it does.

## Troubleshooting

| Message or problem | What to do |
| --- | --- |
| *Add your Supertext API key* | Enter the key under Settings. No account yet? Create one at [supertext.com](https://www.supertext.com/person/en/account/signin); generate the key at [supertext.com → Integrations → API](https://www.supertext.com/en/integrations/api) (requires the Admin role). |
| *Authentication failed. Please check the Supertext API key* | The key is wrong or was deleted. Generate a new one at [supertext.com → Integrations → API](https://www.supertext.com/en/integrations/api) (requires the Admin role) and save it under Settings. No account yet? Create one at [supertext.com](https://www.supertext.com/person/en/account/signin). |
| *"de" has no Supertext language yet, so nothing was sent* | The shop language isn't mapped (Settings → Languages shows *Not mapped*). Choose its Supertext language there, e.g. `de-CH`, save and translate again. |
| *Supertext doesn't translate from "en" into "de-CH"* | Supertext refuses this pair. Choose another Supertext language for it under Settings → Languages. |
| *Saved, except these language codes, which Supertext doesn't offer* | The code typed isn't in Supertext's list (e.g. `de` without region, `German`). Pick one from the list. |
| *API key checked: the connection to Supertext works.* | All good. |
| *Supertext rejected the API key …* | The key is incomplete, wrong or was deleted. Paste the whole key or generate a new one at [supertext.com → Integrations → API](https://www.supertext.com/en/integrations/api) (requires the Admin role). No account yet? Create one at [supertext.com](https://www.supertext.com/person/en/account/signin). |
| *No API key is set yet …* | Paste the key under Settings and save. |
| *The API key couldn't be checked because Supertext can't be reached* | A network problem or a Supertext outage. The settings are saved; click **Test connection** later. |
| *The API key couldn't be checked: Supertext answered with an error (…)* | Supertext answered with an unexpected HTTP status (shown in brackets). Click **Test connection** later; if it stays, contact Supertext support. |
| *Your Supertext translation limit is exceeded* | Your Supertext plan's limit is used up. Contact Supertext or upgrade your plan. |
| *Too many requests to Supertext* | Supertext received too many requests at once and the app's automatic retries ran out. Start the translation again. |
| *Add a second language* | Your shop has only one language. Add one under Settings → Languages. |
| Translations don't show in the shop | Publish the language under Settings → Languages, and check that the shop's theme has a language selector. |
| *Enter your API key again* (Settings) | The saved key can no longer be read, for example after a server change. Paste the key again and save. |
| *Interrupted by an app update* | The app was updated while the translation ran. Start it again; items that were finished are kept. |
| The app doesn't load | Reload the admin page. If it still doesn't load, contact Supertext; the app's server may be down. |

## Screenshots

Screenshots of the app in a demo store will be added here once the demo store is set up (see the developer guide).
