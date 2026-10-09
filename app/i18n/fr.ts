import type { Messages } from "./en";

// French, with the terms of Shopify's French admin (boutique, collections,
// articles de blog, interface administrateur Shopify). "\u00a0" is the
// non-breaking space before ? ! : ; and inside « ».
export const fr: Messages = {
  "nav.translate": "Traduire",
  "nav.settings": "Paramètres",

  "apiKeyHelp.text":
    "Pas encore de compte Supertext\u00a0? {signup}. Générez votre clé API sur {apiKey} (rôle Admin requis).",
  "apiKeyHelp.signup": "Créez-en un sur supertext.com",
  "apiKeyHelp.apiKey": "supertext.com → Integrations → API",

  "translate.heading": "Traduire avec Supertext",
  "translate.settingsLink": "⚙ Paramètres\u00a0: clé API et langues",
  "translate.started":
    "Traduction lancée. La progression s’affiche sous «\u00a0Traductions récentes\u00a0»\u00a0; vous pouvez quitter cette page entre-temps.",
  "translate.noKey.heading": "Ajoutez votre clé API Supertext",
  "translate.noKey.text":
    "L’application a besoin d’une clé API Supertext pour traduire. Saisissez-la sous {settings}.",
  "translate.noKey.settings": "Paramètres",
  "translate.oneLanguage.heading": "Ajoutez une deuxième langue",
  "translate.oneLanguage.text":
    "Votre boutique n’a qu’une seule langue. Ajoutez des langues sous Paramètres → Langues dans l’interface administrateur Shopify, puis revenez ici.",
  "translate.step1": "1. Choisissez ce qu’il faut traduire",
  "translate.empty": "Aucun élément de ce type pour l’instant.",
  "translate.selectAll": "Tout sélectionner sur cette page ({count})",
  "translate.firstPage": "Première page",
  "translate.nextPage": "Page suivante",
  "translate.step2": "2. Choisissez les langues",
  "translate.codesHint":
    "Le code Supertext à côté de chaque langue est la variante vers laquelle le contenu est traduit. Modifiez-le sous {settings}.",
  "translate.codesHint.settings": "Paramètres → Langues",
  "translate.from": "Traduction depuis {language}, la langue par défaut de votre boutique.",
  "translate.notPublished": ", pas encore publiée",
  "translate.overwrite": "Écraser les traductions existantes",
  "translate.overwriteHint":
    "Sans cette option, les champs qui ont déjà une traduction à jour sont conservés. Les traductions obsolètes (l’original a changé depuis) sont toujours retraduites.",
  "translate.starting": "Démarrage…",
  "translate.submit": "Traduire avec Supertext",
  "translate.submitCount.one": "Traduire {count} élément avec Supertext",
  "translate.submitCount.other": "Traduire {count} éléments avec Supertext",
  "translate.selectSomething": "Sélectionnez au moins un élément et une langue.",
  "translate.noApiKey":
    "Pas encore de clé API Supertext. Ajoutez-la sous Paramètres (créez un compte sur https://www.supertext.com/person/en/account/signin, générez la clé sur https://www.supertext.com/en/integrations/api\u00a0; rôle Admin requis).",

  "resource.PRODUCT": "Produits",
  "resource.COLLECTION": "Collections",
  "resource.PAGE": "Pages",
  "resource.ARTICLE": "Articles de blog",
  "resource.BLOG": "Blogs",

  "jobs.heading": "Traductions récentes",
  "jobs.none": "Aucune traduction pour l’instant.",
  "job.running": "Traduction en cours… {completed} sur {total}",
  "job.failed": "Échec",
  "job.doneWithErrors": "Terminé, avec des erreurs",
  "job.done": "Terminé",
  "job.written.one": "{count} champ traduit",
  "job.written.other": "{count} champs traduits",
  "job.kept": "{count} conservé(s)",

  "settings.heading": "Paramètres Supertext",
  "settings.removed": "La clé API a été supprimée.",
  "settings.invalidCodes":
    "Enregistré, sauf ces codes de langue, qui ne sont pas des codes valides comme de-CH\u00a0: {codes}.",
  "settings.noKey": "Pas encore de clé API Supertext.",
  "settings.tested": "Enregistré. Supertext a accepté la clé API.",
  "settings.saved": "Paramètres enregistrés.",
  "settings.apiKey.heading": "Clé API Supertext",
  "settings.apiKey.label": "Clé API",
  "settings.apiKey.placeholderSaved":
    "Une clé est enregistrée. Saisissez-en une nouvelle pour la remplacer.",
  "settings.apiKey.placeholderServer": "La clé définie sur le serveur est utilisée.",
  "settings.apiKey.placeholder": "Collez votre clé API Supertext",
  "settings.languages.heading": "Langues",
  "settings.languages.text":
    "Le code de langue que Supertext utilise pour chacune des langues de votre boutique. Pour les langues cibles, Supertext a besoin d’une région, par exemple de-CH pour l’allemand de Suisse ou fr-FR pour le français de France. Votre langue par défaut est la langue source.",
  "settings.languages.default": ", langue par défaut",
  "settings.style.heading": "Style de traduction",
  "settings.style.label": "Forme d’adresse",
  "settings.style.default": "Laisser Supertext décider",
  "settings.style.more": "Formelle (p.\u00a0ex. «\u00a0vous\u00a0»)",
  "settings.style.less": "Informelle (p.\u00a0ex. «\u00a0tu\u00a0»)",
  "settings.save": "Enregistrer",
  "settings.saveAndTest": "Enregistrer et tester la connexion",
  "settings.removeKey": "Supprimer la clé API",
  "settings.about.heading": "À propos",
  "settings.about.version": "version {version}",
  "settings.about.versionUnknown": "(version inconnue)",
  "settings.about.text":
    "Les traductions sont enregistrées dans le stockage des traductions de Shopify\u00a0: vous pouvez donc les vérifier et les modifier dans l’application Translate & Adapt de Shopify.",

  "error.noApiKey": "Aucune clé API Supertext n’est configurée.",
  "error.noFileId": "Supertext n’a pas renvoyé d’identifiant de fichier.",
  "error.translationFailed": "Supertext n’a pas pu traduire le document.",
  "error.limitExceeded": "Votre limite de traduction Supertext est dépassée.",
  "error.fileDeleted": "Le fichier Supertext a été supprimé avant d’avoir pu être téléchargé.",
  "error.timeout": "Délai dépassé en attendant la traduction Supertext.",
  "error.emptyTranslation": "Le document traduit était vide.",
  "error.unreachable": "Impossible de joindre Supertext\u00a0: {reason}",
  "error.auth":
    "Échec de l’authentification. Veuillez vérifier la clé API Supertext. Pas encore de compte Supertext\u00a0? Créez-en un sur https://www.supertext.com/person/en/account/signin. Générez votre clé API sur https://www.supertext.com/en/integrations/api (rôle Admin requis).",
  "error.notFound": "La ressource Supertext demandée est introuvable.",
  "error.tooLarge": "Le contenu est trop volumineux pour être traduit par Supertext en une seule fois.",
  "error.rateLimited": "Trop de requêtes envoyées à Supertext. Veuillez réessayer dans un instant.",
  "error.unavailable": "Le service Supertext est actuellement indisponible.",
  "error.http": "Supertext a répondu avec le code HTTP {status}.",
  "error.languagePair":
    "Supertext ne traduit pas de «\u00a0{source}\u00a0» vers «\u00a0{target}\u00a0». Définissez le code Supertext de cette langue sous Paramètres → Langues, avec une région (p.\u00a0ex. de-CH, fr-FR, en-US).",
  "error.languagePairUnknown":
    "Supertext ne traduit pas vers cette langue. Définissez le code Supertext de cette langue sous Paramètres → Langues, avec une région (p.\u00a0ex. de-CH, fr-FR, en-US).",
  "error.itemGone": "L’élément n’existe plus.",
  "error.incomplete": "Supertext a renvoyé {returned} champs sur {expected}.",
  "error.shopify": "Shopify\u00a0: {reason}",
  "error.shopifyNoData": "Shopify n’a renvoyé aucune donnée.",
  "error.shopifyRejected": "Shopify a refusé la traduction\u00a0: {reason}",

  "landing.heading": "Supertext Translation pour Shopify",
  "landing.intro":
    "Traduisez vos produits, collections, pages et articles de blog avec Supertext AI, directement depuis l’interface administrateur Shopify.",
  "landing.feature1.title": "Toutes vos langues en une fois",
  "landing.feature1.text":
    "Choisissez les éléments et les langues, et Supertext les traduit en arrière-plan.",
  "landing.feature2.title": "Mise en forme conservée",
  "landing.feature2.text":
    "Les descriptions de produits conservent leurs titres, listes, textes en gras et liens.",
  "landing.feature3.title": "Vérification dans Shopify",
  "landing.feature3.text":
    "Les traductions sont enregistrées dans le stockage des traductions de Shopify\u00a0: vous pouvez les vérifier et les modifier dans Translate & Adapt.",
  "login.heading": "Se connecter",
  "login.shopDomain": "Domaine de la boutique",
  "login.example": "p.\u00a0ex. my-shop-domain.myshopify.com",
  "login.submit": "Se connecter",
  "login.missingShop": "Veuillez saisir le domaine de votre boutique pour vous connecter",
  "login.invalidShop": "Veuillez saisir un domaine de boutique valide pour vous connecter",
};
