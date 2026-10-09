import type { Messages } from "./en";

// Italian (formal "Lei"), with the terms of Shopify's Italian admin
// (negozio, collezioni, articoli del blog, pannello di controllo di Shopify).
export const it: Messages = {
  "nav.translate": "Traduci",
  "nav.settings": "Impostazioni",

  "apiKeyHelp.text":
    "Non ha ancora un account Supertext? {signup}. Generi la Sua chiave API su {apiKey} (richiede il ruolo Admin).",
  "apiKeyHelp.signup": "Ne crei uno su supertext.com",
  "apiKeyHelp.apiKey": "supertext.com → Integrations → API",

  "translate.heading": "Traduci con Supertext",
  "translate.settingsLink": "⚙ Impostazioni: chiave API e lingue",
  "translate.started":
    "Traduzione avviata. L'avanzamento è visibile in «Traduzioni recenti»; nel frattempo può lasciare questa pagina.",
  "translate.noKey.heading": "Aggiunga la Sua chiave API Supertext",
  "translate.noKey.text":
    "L'app ha bisogno di una chiave API Supertext per tradurre. La inserisca in {settings}.",
  "translate.noKey.settings": "Impostazioni",
  "translate.oneLanguage.heading": "Aggiunga una seconda lingua",
  "translate.oneLanguage.text":
    "Il Suo negozio ha una sola lingua. Aggiunga altre lingue in Impostazioni → Lingue nel pannello di controllo di Shopify, poi torni qui.",
  "translate.step1": "1. Scelga cosa tradurre",
  "translate.empty": "Ancora nessun elemento di questo tipo.",
  "translate.selectAll": "Seleziona tutto in questa pagina ({count})",
  "translate.firstPage": "Prima pagina",
  "translate.nextPage": "Pagina successiva",
  "translate.step2": "2. Scelga le lingue",
  "translate.codesHint":
    "Il codice Supertext accanto a ogni lingua è la variante in cui viene tradotto il contenuto. Può modificarlo in {settings}.",
  "translate.codesHint.settings": "Impostazioni → Lingue",
  "translate.from": "Traduzione da {language}, la lingua predefinita del Suo negozio.",
  "translate.notPublished": ", non ancora pubblicata",
  "translate.overwrite": "Sovrascrivi le traduzioni esistenti",
  "translate.overwriteHint":
    "Senza questa opzione, i campi che hanno già una traduzione aggiornata vengono mantenuti. Quelli obsoleti (l'originale è cambiato nel frattempo) vengono sempre ritradotti.",
  "translate.starting": "Avvio in corso…",
  "translate.submit": "Traduci con Supertext",
  "translate.submitCount.one": "Traduci {count} elemento con Supertext",
  "translate.submitCount.other": "Traduci {count} elementi con Supertext",
  "translate.selectSomething": "Selezioni almeno un elemento e una lingua.",
  "translate.noApiKey":
    "Ancora nessuna chiave API Supertext. La aggiunga in Impostazioni (crei un account su https://www.supertext.com/person/en/account/signin, generi la chiave su https://www.supertext.com/en/integrations/api; richiede il ruolo Admin).",

  "resource.PRODUCT": "Prodotti",
  "resource.COLLECTION": "Collezioni",
  "resource.PAGE": "Pagine",
  "resource.ARTICLE": "Articoli del blog",
  "resource.BLOG": "Blog",

  "jobs.heading": "Traduzioni recenti",
  "jobs.none": "Ancora nessuna traduzione.",
  "job.running": "Traduzione in corso… {completed} di {total}",
  "job.failed": "Non riuscita",
  "job.doneWithErrors": "Completata, con errori",
  "job.done": "Completata",
  "job.written.one": "{count} campo tradotto",
  "job.written.other": "{count} campi tradotti",
  "job.kept": "{count} mantenuti",

  "settings.heading": "Impostazioni Supertext",
  "settings.removed": "La chiave API è stata rimossa.",
  "settings.invalidCodes":
    "Salvato, tranne questi codici lingua, che non sono codici validi come de-CH: {codes}.",
  "settings.noKey": "Ancora nessuna chiave API Supertext.",
  "settings.tested": "Salvato. Supertext ha accettato la chiave API.",
  "settings.saved": "Impostazioni salvate.",
  "settings.apiKey.heading": "Chiave API Supertext",
  "settings.apiKey.label": "Chiave API",
  "settings.apiKey.placeholderSaved":
    "È salvata una chiave. Ne inserisca una nuova per sostituirla.",
  "settings.apiKey.placeholderServer": "Viene usata la chiave impostata sul server.",
  "settings.apiKey.placeholder": "Incolli la Sua chiave API Supertext",
  "settings.languages.heading": "Lingue",
  "settings.languages.text":
    "Il codice lingua che Supertext usa per ciascuna lingua del Suo negozio. Per le lingue di destinazione Supertext ha bisogno di una regione, ad esempio de-CH per il tedesco svizzero o fr-FR per il francese di Francia. La traduzione parte dalla Sua lingua predefinita.",
  "settings.languages.default": ", lingua predefinita",
  "settings.style.heading": "Stile di traduzione",
  "settings.style.label": "Forma di cortesia",
  "settings.style.default": "Lascia decidere a Supertext",
  "settings.style.more": "Formale (ad es. «Lei»)",
  "settings.style.less": "Informale (ad es. «tu»)",
  "settings.save": "Salva",
  "settings.saveAndTest": "Salva e verifica la connessione",
  "settings.removeKey": "Rimuovi la chiave API",
  "settings.about.heading": "Informazioni",
  "settings.about.version": "versione {version}",
  "settings.about.versionUnknown": "(versione sconosciuta)",
  "settings.about.text":
    "Le traduzioni vengono salvate nell'archivio delle traduzioni di Shopify, quindi può verificarle e modificarle nell'app Translate & Adapt di Shopify.",

  "error.noApiKey": "Nessuna chiave API Supertext configurata.",
  "error.noFileId": "Supertext non ha restituito un ID file.",
  "error.translationFailed": "Supertext non è riuscito a tradurre il documento.",
  "error.limitExceeded": "Il Suo limite di traduzione Supertext è stato superato.",
  "error.fileDeleted": "Il file Supertext è stato eliminato prima di poter essere scaricato.",
  "error.timeout": "Tempo scaduto in attesa della traduzione Supertext.",
  "error.emptyTranslation": "Il documento tradotto era vuoto.",
  "error.unreachable": "Impossibile raggiungere Supertext: {reason}",
  "error.auth":
    "Autenticazione non riuscita. Verifichi la chiave API Supertext. Non ha ancora un account Supertext? Ne crei uno su https://www.supertext.com/person/en/account/signin. Generi la Sua chiave API su https://www.supertext.com/en/integrations/api (richiede il ruolo Admin).",
  "error.notFound": "La risorsa Supertext richiesta non è stata trovata.",
  "error.tooLarge": "Il contenuto è troppo grande per essere tradotto da Supertext in una sola volta.",
  "error.rateLimited": "Troppe richieste a Supertext. Riprovi tra poco.",
  "error.unavailable": "Il servizio Supertext non è al momento disponibile.",
  "error.http": "Supertext ha risposto con HTTP {status}.",
  "error.languagePair":
    "Supertext non traduce da «{source}» a «{target}». Imposti il codice Supertext di questa lingua in Impostazioni → Lingue, con una regione (ad es. de-CH, fr-FR, en-US).",
  "error.languagePairUnknown":
    "Supertext non traduce in questa lingua. Imposti il codice Supertext di questa lingua in Impostazioni → Lingue, con una regione (ad es. de-CH, fr-FR, en-US).",
  "error.itemGone": "L'elemento non esiste più.",
  "error.incomplete": "Supertext ha restituito {returned} campi su {expected}.",
  "error.shopify": "Shopify: {reason}",
  "error.shopifyNoData": "Shopify non ha restituito dati.",
  "error.shopifyRejected": "Shopify ha rifiutato la traduzione: {reason}",

  "landing.heading": "Supertext Translation per Shopify",
  "landing.intro":
    "Traduca prodotti, collezioni, pagine e articoli del blog con Supertext AI, direttamente dal pannello di controllo di Shopify.",
  "landing.feature1.title": "Tutte le lingue in una volta",
  "landing.feature1.text":
    "Scelga gli elementi e le lingue, e Supertext li traduce in background.",
  "landing.feature2.title": "Formattazione mantenuta",
  "landing.feature2.text":
    "Le descrizioni dei prodotti mantengono titoli, elenchi, grassetto e link.",
  "landing.feature3.title": "Revisione in Shopify",
  "landing.feature3.text":
    "Le traduzioni vengono salvate nell'archivio delle traduzioni di Shopify, così può verificarle e modificarle in Translate & Adapt.",
  "login.heading": "Accedi",
  "login.shopDomain": "Dominio del negozio",
  "login.example": "ad es. my-shop-domain.myshopify.com",
  "login.submit": "Accedi",
  "login.missingShop": "Inserisca il dominio del Suo negozio per accedere",
  "login.invalidShop": "Inserisca un dominio del negozio valido per accedere",
};
