# User guide — Supertext Translation for Shopify

How to translate your shop's texts with Supertext AI. You need an administrator to have installed the app and entered the Supertext API key (see the [installation guide](INSTALLATION.md)).

## Translate

1. In the Shopify admin, open **Apps → Supertext Translation**. The app has two pages, **Translate** and **Settings**: on a computer they are listed under the app in the left sidebar; on a phone, use the **Settings** link at the top of the translate page.
2. **Choose what to translate:** click **Products**, **Collections**, **Pages**, **Blog posts** or **Blogs**, then tick the items. **Select all on this page** ticks the 50 items shown; use **Next page** for more. Only the items on the current page are translated at once.
3. **Choose the languages:** all your shop's other languages are ticked; untick the ones you don't want. Next to each language you see the variant Supertext translates into, for example *→ Supertext de-CH* (an administrator sets it under Settings → Languages).
4. Leave **Overwrite existing translations** off unless you want to replace translations made earlier (see below).
5. Click **Translate … with Supertext**.

The translation runs in the background. **Recent translations** shows *Translating… 3 of 10* and updates itself; you can leave the page and come back. When it says **Done**, the translations are saved in Shopify.

Each item is translated into one language after the other, so a large selection takes a few minutes.

## Review and edit

The translations are saved in Shopify's own translation store, the same place Shopify's free **Translate & Adapt** app uses. To check or correct them:

1. Install Shopify's Translate & Adapt app if you haven't (Apps → search "Translate & Adapt").
2. Open it, pick the language and the item, and edit any field. Your edits are kept until you translate that item again with *Overwrite existing translations*.

Customers see a language only once it is published under **Settings → Languages**.

## Translating again

- **Without** *Overwrite existing translations*, fields that already have a translation are kept. Recent translations shows them as *kept*.
- Fields whose original text changed after they were translated are marked outdated by Shopify. These are always translated again, so a run without overwrite brings your translations up to date.
- **With** *Overwrite existing translations*, every selected field is translated again, replacing edits you made in Translate & Adapt.

## What gets translated

For products, collections, pages, blog posts and blogs, every text field Shopify offers for translation, for example:

- Title and description (the description keeps its headings, lists, bold text, links and images)
- SEO title and SEO description
- Product type, blog post summary and other plain-text fields

## What is not translated

- **URL handles** (the part of the address like `/products/swiss-chocolate`). Set them per language in Translate & Adapt if you want translated addresses.
- Product options and variants, metafields, menus, theme texts, notifications, policies and checkout texts (planned for later versions).
- Images and their alt texts.
- Fields that are empty in the default language.

## Formal and informal language

An administrator chooses under **Settings → Form of address** whether Supertext uses the formal ("Sie") or informal ("du") form, for languages that have one.

## When something goes wrong

Errors appear in red under the translation in **Recent translations**, with the language they concern. One failed item doesn't stop the others.

| Message | Meaning |
| --- | --- |
| *Done, with errors* | Some items were translated, others not. The red lines say why; translate those again. |
| *Supertext doesn't translate from "en" into "de"* | The language needs a regional Supertext code. Ask your administrator to set it under Settings → Languages (e.g. `de-CH`). |
| *The item no longer exists* | It was deleted after you selected it. |
| *Supertext returned 2 of 3 fields* | Supertext's answer was incomplete, so nothing was saved for that item. Translate it again. |
| *Authentication failed …* | The API key is wrong. Ask your administrator to check Settings. |
| *Your Supertext translation limit is exceeded* | The Supertext plan's limit is used up. Ask your administrator. |
| *No Supertext API key yet* | Ask your administrator to add it under Settings. |
