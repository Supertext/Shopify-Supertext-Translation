import type {
  ContentItem,
  ExistingTranslation,
  TranslationInput,
} from "./fields.server";

/** The part of Shopify's admin GraphQL client the app uses (easy to fake in tests). */
export interface AdminClient {
  graphql(
    query: string,
    options?: { variables?: Record<string, unknown> },
  ): Promise<Response>;
}

import type { ResourceType } from "./resource-types";

export interface ShopLocale {
  locale: string;
  name: string;
  primary: boolean;
  published: boolean;
}

async function run<T>(
  admin: AdminClient,
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const response = await admin.graphql(query, { variables });
  const json = (await response.json()) as {
    data?: T;
    errors?: { message: string }[];
  };
  if (json.errors?.length) {
    throw new Error(
      `Shopify: ${json.errors.map((e) => e.message).join("; ")}`,
    );
  }
  if (!json.data) throw new Error("Shopify returned no data.");
  return json.data;
}

export async function shopLocales(admin: AdminClient): Promise<ShopLocale[]> {
  const data = await run<{ shopLocales: ShopLocale[] }>(
    admin,
    `#graphql
    query SupertextShopLocales {
      shopLocales { locale name primary published }
    }`,
  );
  return data.shopLocales;
}

export interface ResourcePage {
  resources: { id: string; content: ContentItem[] }[];
  endCursor: string | null;
  hasNextPage: boolean;
}

export async function listResources(
  admin: AdminClient,
  resourceType: ResourceType,
  after: string | null,
  first = 50,
): Promise<ResourcePage> {
  const data = await run<{
    translatableResources: {
      nodes: { resourceId: string; translatableContent: ContentItem[] }[];
      pageInfo: { endCursor: string | null; hasNextPage: boolean };
    };
  }>(
    admin,
    `#graphql
    query SupertextResources($type: TranslatableResourceType!, $first: Int!, $after: String) {
      translatableResources(resourceType: $type, first: $first, after: $after) {
        nodes {
          resourceId
          translatableContent { key value digest locale type }
        }
        pageInfo { endCursor hasNextPage }
      }
    }`,
    { type: resourceType, first, after },
  );
  const { nodes, pageInfo } = data.translatableResources;
  return {
    resources: nodes.map((n) => ({
      id: n.resourceId,
      content: n.translatableContent,
    })),
    endCursor: pageInfo.endCursor,
    hasNextPage: pageInfo.hasNextPage,
  };
}

export interface ResourceForLocale {
  content: ContentItem[];
  translations: ExistingTranslation[];
}

export async function resourceForLocale(
  admin: AdminClient,
  resourceId: string,
  locale: string,
): Promise<ResourceForLocale | null> {
  const data = await run<{
    translatableResource: {
      translatableContent: ContentItem[];
      translations: ExistingTranslation[];
    } | null;
  }>(
    admin,
    `#graphql
    query SupertextResource($id: ID!, $locale: String!) {
      translatableResource(resourceId: $id) {
        translatableContent { key value digest locale type }
        translations(locale: $locale) { key value outdated }
      }
    }`,
    { id: resourceId, locale },
  );
  const resource = data.translatableResource;
  return resource
    ? { content: resource.translatableContent, translations: resource.translations }
    : null;
}

/** Shopify accepts at most this many translations per mutation. */
const REGISTER_BATCH = 100;

export async function registerTranslations(
  admin: AdminClient,
  resourceId: string,
  translations: TranslationInput[],
): Promise<void> {
  for (let i = 0; i < translations.length; i += REGISTER_BATCH) {
    const data = await run<{
      translationsRegister: {
        userErrors: { field: string[] | null; message: string }[];
      };
    }>(
      admin,
      `#graphql
      mutation SupertextRegister($id: ID!, $translations: [TranslationInput!]!) {
        translationsRegister(resourceId: $id, translations: $translations) {
          userErrors { field message }
        }
      }`,
      { id: resourceId, translations: translations.slice(i, i + REGISTER_BATCH) },
    );
    const errors = data.translationsRegister.userErrors;
    if (errors.length) {
      throw new Error(
        `Shopify rejected the translation: ${errors.map((e) => e.message).join("; ")}`,
      );
    }
  }
}
