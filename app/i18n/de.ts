import type { Messages } from "./en";

// German, with the terms of Shopify's German admin (Kategorien, Blogbeiträge, Shopify-Adminbereich).
export const de: Messages = {
  "nav.translate": "Übersetzen",
  "nav.settings": "Einstellungen",

  "apiKeyHelp.text":
    "Noch kein Supertext-Konto? {signup}. Generieren Sie Ihren API-Schlüssel unter {apiKey} (erfordert die Admin-Rolle).",
  "apiKeyHelp.signup": "Erstellen Sie eines auf supertext.com",
  "apiKeyHelp.apiKey": "supertext.com → Integrations → API",

  "translate.heading": "Mit Supertext übersetzen",
  "translate.settingsLink": "⚙ Einstellungen: API-Schlüssel und Sprachen",
  "translate.started":
    "Die Übersetzung wurde gestartet. Der Fortschritt erscheint unter „Letzte Übersetzungen“; Sie können diese Seite in der Zwischenzeit verlassen.",
  "translate.noKey.heading": "Supertext-API-Schlüssel hinzufügen",
  "translate.noKey.text":
    "Die App benötigt einen Supertext-API-Schlüssel, bevor sie übersetzen kann. Geben Sie ihn unter {settings} ein.",
  "translate.noKey.settings": "Einstellungen",
  "translate.oneLanguage.heading": "Zweite Sprache hinzufügen",
  "translate.oneLanguage.text":
    "Ihr Shop hat nur eine Sprache. Fügen Sie im Shopify-Adminbereich unter Einstellungen → Sprachen weitere hinzu und kehren Sie dann hierher zurück.",
  "translate.step1": "1. Inhalte auswählen",
  "translate.empty": "Noch nichts von diesem Typ vorhanden.",
  "translate.selectAll": "Alle auf dieser Seite auswählen ({count})",
  "translate.firstPage": "Erste Seite",
  "translate.nextPage": "Nächste Seite",
  "translate.step2": "2. Sprachen auswählen",
  "translate.codesHint":
    "Der Supertext-Code neben jeder Sprache ist die Variante, in die übersetzt wird. Ändern Sie ihn unter {settings}.",
  "translate.codesHint.settings": "Einstellungen → Sprachen",
  "translate.from": "Übersetzt wird aus {language}, der Standardsprache Ihres Shops.",
  "translate.notPublished": ", noch nicht veröffentlicht",
  "translate.overwrite": "Vorhandene Übersetzungen überschreiben",
  "translate.overwriteHint":
    "Ohne diese Option bleiben Felder, die bereits eine aktuelle Übersetzung haben, unverändert. Veraltete Übersetzungen (das Original hat sich seither geändert) werden immer neu übersetzt.",
  "translate.starting": "Wird gestartet …",
  "translate.submit": "Mit Supertext übersetzen",
  "translate.submitCount.one": "{count} Element mit Supertext übersetzen",
  "translate.submitCount.other": "{count} Elemente mit Supertext übersetzen",
  "translate.selectSomething": "Wählen Sie mindestens ein Element und eine Sprache aus.",
  "translate.noApiKey":
    "Noch kein Supertext-API-Schlüssel. Fügen Sie ihn unter Einstellungen hinzu (Konto erstellen unter https://www.supertext.com/person/en/account/signin, Schlüssel generieren unter https://www.supertext.com/en/integrations/api; erfordert die Admin-Rolle).",

  "resource.PRODUCT": "Produkte",
  "resource.COLLECTION": "Kategorien",
  "resource.PAGE": "Seiten",
  "resource.ARTICLE": "Blogbeiträge",
  "resource.BLOG": "Blogs",

  "jobs.heading": "Letzte Übersetzungen",
  "jobs.none": "Noch keine Übersetzungen.",
  "job.running": "Wird übersetzt … {completed} von {total}",
  "job.failed": "Fehlgeschlagen",
  "job.doneWithErrors": "Fertig, mit Fehlern",
  "job.done": "Fertig",
  "job.written.one": "{count} Feld übersetzt",
  "job.written.other": "{count} Felder übersetzt",
  "job.kept": "{count} beibehalten",

  "settings.heading": "Supertext-Einstellungen",
  "settings.keyUnreadable.heading": "API-Schlüssel erneut eingeben",
  "settings.keyUnreadable.text": "Der gespeicherte Supertext-API-Schlüssel kann nicht mehr gelesen werden. Füge ihn unten erneut ein und speichere.",
  "settings.encryptionMissing": "Der API-Schlüssel konnte nicht gespeichert werden, weil der Server der App nicht vollständig eingerichtet ist. Bitte wende dich an den Supertext-Support.",
  "settings.removed": "Der API-Schlüssel wurde entfernt.",
  "settings.invalidCodes":
    "Gespeichert, außer diesen Sprachcodes, die keine gültigen Codes wie de-CH sind: {codes}.",
  "settings.noKey": "Noch kein Supertext-API-Schlüssel.",
  "settings.tested": "Gespeichert. Supertext hat den API-Schlüssel akzeptiert.",
  "settings.saved": "Einstellungen gespeichert.",
  "settings.apiKey.heading": "Supertext-API-Schlüssel",
  "settings.apiKey.label": "API-Schlüssel",
  "settings.apiKey.placeholderSaved":
    "Ein Schlüssel ist gespeichert. Geben Sie einen neuen ein, um ihn zu ersetzen.",
  "settings.apiKey.placeholderServer": "Der auf dem Server hinterlegte Schlüssel wird verwendet.",
  "settings.apiKey.placeholder": "Supertext-API-Schlüssel einfügen",
  "settings.languages.heading": "Sprachen",
  "settings.languages.text":
    "Der Sprachcode, den Supertext für jede Sprache Ihres Shops verwendet. Für die Zielsprachen braucht Supertext eine Region, zum Beispiel de-CH für Schweizerdeutsch oder fr-FR für Französisch, wie es in Frankreich gesprochen wird. Aus Ihrer Standardsprache wird übersetzt.",
  "settings.languages.default": ", Standardsprache",
  "settings.style.heading": "Übersetzungsstil",
  "settings.style.label": "Anrede",
  "settings.style.default": "Supertext entscheiden lassen",
  "settings.style.more": "Formell (z. B. „Sie“)",
  "settings.style.less": "Informell (z. B. „du“)",
  "settings.save": "Speichern",
  "settings.saveAndTest": "Speichern und Verbindung testen",
  "settings.removeKey": "API-Schlüssel entfernen",
  "settings.about.heading": "Info",
  "settings.about.version": "Version {version}",
  "settings.about.versionUnknown": "(Version unbekannt)",
  "settings.about.text":
    "Übersetzungen werden im Übersetzungsspeicher von Shopify abgelegt. Sie können sie also in der Shopify-App Translate & Adapt prüfen und bearbeiten.",

  "error.noApiKey": "Kein Supertext-API-Schlüssel konfiguriert.",
  "error.noFileId": "Supertext hat keine Datei-ID zurückgegeben.",
  "error.translationFailed": "Supertext konnte das Dokument nicht übersetzen.",
  "error.limitExceeded": "Ihr Supertext-Übersetzungslimit ist überschritten.",
  "error.fileDeleted":
    "Die Supertext-Datei wurde gelöscht, bevor sie heruntergeladen werden konnte.",
  "error.timeout": "Zeitüberschreitung beim Warten auf die Supertext-Übersetzung.",
  "error.emptyTranslation": "Das übersetzte Dokument war leer.",
  "error.unreachable": "Supertext ist nicht erreichbar: {reason}",
  "error.auth":
    "Authentifizierung fehlgeschlagen. Bitte prüfen Sie den Supertext-API-Schlüssel. Noch kein Supertext-Konto? Erstellen Sie eines unter https://www.supertext.com/person/en/account/signin. Generieren Sie Ihren API-Schlüssel unter https://www.supertext.com/en/integrations/api (erfordert die Admin-Rolle).",
  "error.notFound": "Die angeforderte Supertext-Ressource wurde nicht gefunden.",
  "error.tooLarge": "Der Inhalt ist zu groß, um von Supertext in einem Durchgang übersetzt zu werden.",
  "error.rateLimited": "Zu viele Anfragen an Supertext. Bitte versuchen Sie es in Kürze erneut.",
  "error.unavailable": "Der Supertext-Dienst ist derzeit nicht verfügbar.",
  "error.http": "Supertext hat mit HTTP {status} geantwortet.",
  "error.languagePair":
    "Supertext übersetzt nicht von „{source}“ nach „{target}“. Legen Sie den Supertext-Code für diese Sprache unter Einstellungen → Sprachen mit einer Region fest (z. B. de-CH, fr-FR, en-US).",
  "error.languagePairUnknown":
    "Supertext übersetzt nicht in diese Sprache. Legen Sie den Supertext-Code für diese Sprache unter Einstellungen → Sprachen mit einer Region fest (z. B. de-CH, fr-FR, en-US).",
  "error.interrupted": "Durch ein App-Update unterbrochen. Bitte starte die Übersetzung erneut; fertige Einträge bleiben erhalten.",
  "error.itemGone": "Das Element existiert nicht mehr.",
  "error.incomplete": "Supertext hat {returned} von {expected} Feldern zurückgegeben.",
  "error.shopify": "Shopify: {reason}",
  "error.shopifyNoData": "Shopify hat keine Daten zurückgegeben.",
  "error.shopifyRejected": "Shopify hat die Übersetzung abgelehnt: {reason}",

  "landing.heading": "Supertext Translation für Shopify",
  "landing.intro":
    "Übersetzen Sie Ihre Produkte, Kategorien, Seiten und Blogbeiträge mit Supertext AI, direkt im Shopify-Adminbereich.",
  "landing.feature1.title": "Alle Sprachen auf einmal",
  "landing.feature1.text":
    "Wählen Sie die Elemente und die Sprachen aus, und Supertext übersetzt sie im Hintergrund.",
  "landing.feature2.title": "Formatierung bleibt erhalten",
  "landing.feature2.text":
    "Produktbeschreibungen behalten ihre Überschriften, Listen, Fettschrift und Links.",
  "landing.feature3.title": "Prüfen in Shopify",
  "landing.feature3.text":
    "Übersetzungen landen im Übersetzungsspeicher von Shopify, sodass Sie sie in Translate & Adapt prüfen und bearbeiten können.",
  "login.heading": "Anmelden",
  "login.shopDomain": "Shop-Domain",
  "login.example": "z. B. my-shop-domain.myshopify.com",
  "login.submit": "Anmelden",
  "login.missingShop": "Bitte geben Sie Ihre Shop-Domain ein, um sich anzumelden",
  "login.invalidShop": "Bitte geben Sie eine gültige Shop-Domain ein, um sich anzumelden",
};
