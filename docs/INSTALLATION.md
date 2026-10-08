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
3. Click **Save and test connection**. The page shows *Supertext accepted the API key*.

The key is stored for your store only and never shown again. To replace it, paste a new one and save; **Remove API key** deletes it.

## Set up languages

The app translates into the languages your shop already has; it doesn't add languages itself.

1. In the Shopify admin, open **Settings → Languages**.
2. Click **Add language**, pick for example German or French, and add it.
3. The language appears in the app straight away. Customers see it only once you **publish** it in Shopify. The app shows unpublished languages with *not published yet*, so you can translate first and publish when you are happy.

The default language (shown as *Default* in Shopify) is the source language.

### Supertext language codes

Shopify names most languages without a region (`de`, `fr`), but Supertext translates into a regional variant (`de-CH`, `de-DE`, `fr-FR`, `en-US`). Under **Apps → Supertext Translation → Settings → Languages**, each of your languages has a Supertext code, pre-filled like this:

| Shopify | Supertext code (default) |
| --- | --- |
| `de` | `de-DE` |
| `fr` | `fr-FR` |
| `it` | `it-IT` |
| `en` | `en-US` |
| `pt-BR`, `zh-TW`, … (with region) | the same code |

Change a code when your shop targets another region, for example `de-CH` (Swiss German, no "ß") or `fr-CH`, then click **Save**. Leave the field empty to go back to the default. The translate page shows the code each language is sent with.

## All settings

| Setting | Where | What it does |
| --- | --- | --- |
| API key | Settings | Your Supertext AI key. Required. |
| Supertext code per language | Settings → Languages | The regional code Supertext translates into, e.g. `de-CH`. Pre-filled with a default (see *Supertext language codes*). |
| Form of address | Settings | *Let Supertext decide*, *Formal* (German "Sie") or *Informal* (German "du"). Applies to all languages that have the distinction. |
| Overwrite existing translations | Translate page, per run | Off: fields that already have a current translation are kept. On: everything selected is translated again. |

## Updating

Supertext updates the app for all stores; you don't need to do anything. If a new version needs more permissions, Shopify asks you to approve them the next time you open the app. The installed version is shown under **Settings → About**.

## Uninstalling

Open **Settings → Apps and sales channels**, choose **Supertext Translation** and click **Uninstall**. The translations the app created stay in your shop, and you can keep editing them in Shopify. 48 hours after uninstalling, Shopify tells the app to delete everything it kept for your store (your API key and the list of past translations), and it does.

## Troubleshooting

| Message or problem | What to do |
| --- | --- |
| *Add your Supertext API key* | Enter the key under Settings. No account yet? Create one at [supertext.com](https://www.supertext.com/person/en/account/signin); generate the key at [supertext.com → Integrations → API](https://www.supertext.com/en/integrations/api) (requires the Admin role). |
| *Authentication failed. Please check the Supertext API key* | The key is wrong or was deleted. Generate a new one at [supertext.com → Integrations → API](https://www.supertext.com/en/integrations/api) and save it under Settings. |
| *Supertext doesn't translate from "en" into "de"* | The language's Supertext code has no region or isn't supported. Set a regional code under Settings → Languages, e.g. `de-CH`, and translate again. |
| *Your Supertext translation limit is exceeded* | Your Supertext plan's limit is used up. Contact Supertext or upgrade your plan. |
| *Too many requests to Supertext* | Supertext received too many requests at once and the app's automatic retries ran out. Start the translation again. |
| *Add a second language* | Your shop has only one language. Add one under Settings → Languages. |
| Translations don't show in the shop | Publish the language under Settings → Languages, and check that the shop's theme has a language selector. |
| The app doesn't load | Reload the admin page. If it still doesn't load, contact Supertext; the app's server may be down. |

## Screenshots

Screenshots of the app in a demo store will be added here once the demo store is set up (see the developer guide).
