// English: the source language and the fallback for missing keys.
// Placeholders in braces ({count}, {settings}) are filled in by the code;
// never translate them. Keys ending in .one / .other are plural forms.

export const en = {
  // Navigation
  "nav.translate": "Translate",
  "nav.settings": "Settings",

  // API key help (shown wherever the key is mentioned)
  "apiKeyHelp.text":
    "No Supertext account yet? {signup}. Generate your API key at {apiKey} (requires the Admin role).",
  "apiKeyHelp.signup": "Create one at supertext.com",
  "apiKeyHelp.apiKey": "supertext.com → Integrations → API",

  // Translate page
  "translate.heading": "Translate with Supertext",
  "translate.settingsLink": "⚙ Settings: API key and languages",
  "translate.started":
    "Translation started. Progress shows under Recent translations; you can leave this page meanwhile.",
  "translate.noKey.heading": "Add your Supertext API key",
  "translate.noKey.text":
    "The app needs a Supertext API key before it can translate. Enter it under {settings}.",
  "translate.noKey.settings": "Settings",
  "translate.oneLanguage.heading": "Add a second language",
  "translate.oneLanguage.text":
    "Your shop has only one language. Add languages under Settings → Languages in the Shopify admin, then come back here.",
  "translate.step1": "1. Choose what to translate",
  "translate.empty": "Nothing of this type yet.",
  "translate.selectAll": "Select all on this page ({count})",
  "translate.firstPage": "First page",
  "translate.nextPage": "Next page",
  "translate.step2": "2. Choose the languages",
  "translate.codesHint":
    "The Supertext code next to each language is the variant it is translated into. Change it under {settings}.",
  "translate.codesHint.settings": "Settings → Languages",
  "translate.from": "Translating from {language}, your shop's default language.",
  "translate.notPublished": ", not published yet",
  "translate.overwrite": "Overwrite existing translations",
  "translate.overwriteHint":
    "Without this option, fields that already have a current translation are kept. Outdated ones (the original changed since) are always translated again.",
  "translate.starting": "Starting…",
  "translate.submit": "Translate with Supertext",
  "translate.submitCount.one": "Translate {count} with Supertext",
  "translate.submitCount.other": "Translate {count} with Supertext",
  "translate.selectSomething": "Select at least one item and one language.",
  "translate.noApiKey":
    "No Supertext API key yet. Add it under Settings (create an account at https://www.supertext.com/person/en/account/signin, generate the key at https://www.supertext.com/en/integrations/api; requires the Admin role).",

  // What can be translated
  "resource.PRODUCT": "Products",
  "resource.COLLECTION": "Collections",
  "resource.PAGE": "Pages",
  "resource.ARTICLE": "Blog posts",
  "resource.BLOG": "Blogs",

  // Recent translations
  "jobs.heading": "Recent translations",
  "jobs.none": "No translations yet.",
  "job.running": "Translating… {completed} of {total}",
  "job.failed": "Failed",
  "job.doneWithErrors": "Done, with errors",
  "job.done": "Done",
  "job.written.one": "{count} field translated",
  "job.written.other": "{count} fields translated",
  "job.kept": "{count} kept",

  // Settings page
  "settings.heading": "Supertext settings",
  "settings.keyUnreadable.heading": "Enter your API key again",
  "settings.keyUnreadable.text": "The saved Supertext API key can no longer be read. Paste it again below and save.",
  "settings.encryptionMissing": "The API key could not be saved because the app's server isn't fully set up. Please contact Supertext support.",
  "settings.removed": "The API key was removed.",
  "settings.invalidCodes":
    "Saved, except these language codes, which aren't valid codes like de-CH: {codes}.",
  "settings.noKey": "No Supertext API key yet.",
  "settings.tested": "Saved. Supertext accepted the API key.",
  "settings.saved": "Settings saved.",
  "settings.apiKey.heading": "Supertext API key",
  "settings.apiKey.label": "API key",
  "settings.apiKey.placeholderSaved": "A key is saved. Enter a new one to replace it.",
  "settings.apiKey.placeholderServer": "Using the key set on the server.",
  "settings.apiKey.placeholder": "Paste your Supertext API key",
  "settings.languages.heading": "Languages",
  "settings.languages.text":
    "The language code Supertext uses for each of your shop's languages. Supertext needs a region for the languages you translate into, for example de-CH for Swiss German or fr-FR for French as spoken in France. Your default language is translated from.",
  "settings.languages.default": ", default language",
  "settings.style.heading": "Translation style",
  "settings.style.label": "Form of address",
  "settings.style.default": "Let Supertext decide",
  "settings.style.more": "Formal (e.g. German “Sie”)",
  "settings.style.less": "Informal (e.g. German “du”)",
  "settings.save": "Save",
  "settings.saveAndTest": "Save and test connection",
  "settings.removeKey": "Remove API key",
  "settings.about.heading": "About",
  "settings.about.version": "version {version}",
  "settings.about.versionUnknown": "(version unknown)",
  "settings.about.text":
    "Translations are written to Shopify's own translation store, so you can review and edit them in Shopify's Translate & Adapt app.",

  // Errors from Supertext and Shopify (codes set by LocalizedError)
  "error.noApiKey": "No Supertext API key configured.",
  "error.noFileId": "Supertext did not return a file id.",
  "error.translationFailed": "Supertext failed to translate the document.",
  "error.limitExceeded": "Your Supertext translation limit is exceeded.",
  "error.fileDeleted": "The Supertext file was deleted before it could be downloaded.",
  "error.timeout": "Timed out waiting for the Supertext translation.",
  "error.emptyTranslation": "The translated document was empty.",
  "error.unreachable": "Could not reach Supertext: {reason}",
  "error.auth":
    "Authentication failed. Please check the Supertext API key. No Supertext account yet? Create one at https://www.supertext.com/person/en/account/signin. Generate your API key at https://www.supertext.com/en/integrations/api (requires the Admin role).",
  "error.notFound": "The requested Supertext resource was not found.",
  "error.tooLarge": "The content is too large for Supertext to translate in one go.",
  "error.rateLimited": "Too many requests to Supertext. Please try again shortly.",
  "error.unavailable": "The Supertext service is currently unavailable.",
  "error.http": "Supertext answered with HTTP {status}.",
  "error.languagePair":
    "Supertext doesn't translate from \"{source}\" into \"{target}\". Set the Supertext code for this language under Settings → Languages, with a region (e.g. de-CH, fr-FR, en-US).",
  "error.languagePairUnknown":
    "Supertext doesn't translate into this language. Set the Supertext code for this language under Settings → Languages, with a region (e.g. de-CH, fr-FR, en-US).",
  "error.interrupted": "Interrupted by an app update. Please start the translation again; finished items are kept.",
  "error.itemGone": "The item no longer exists.",
  "error.incomplete": "Supertext returned {returned} of {expected} fields.",
  "error.shopify": "Shopify: {reason}",
  "error.shopifyNoData": "Shopify returned no data.",
  "error.shopifyRejected": "Shopify rejected the translation: {reason}",

  // Start page and login (outside the Shopify admin)
  "landing.heading": "Supertext Translation for Shopify",
  "landing.intro":
    "Translate your products, collections, pages and blog posts with Supertext AI, right from the Shopify admin.",
  "landing.feature1.title": "All your languages at once",
  "landing.feature1.text":
    "Pick the items and the languages, and Supertext translates them in the background.",
  "landing.feature2.title": "Formatting kept",
  "landing.feature2.text":
    "Product descriptions keep their headings, lists, bold text and links.",
  "landing.feature3.title": "Review in Shopify",
  "landing.feature3.text":
    "Translations land in Shopify's own translation store, so you can check and edit them in Translate & Adapt.",
  "login.heading": "Log in",
  "login.shopDomain": "Shop domain",
  "login.example": "e.g. my-shop-domain.myshopify.com",
  "login.submit": "Log in",
  "login.missingShop": "Please enter your shop domain to log in",
  "login.invalidShop": "Please enter a valid shop domain to log in",
} as const;

export type MessageKey = keyof typeof en;
export type Messages = Record<MessageKey, string>;
