// Shared by the server and the browser (no server-only code here).

/** Resource types the app translates, in the order the UI shows them (labels: `resource.<value>` in app/i18n). */
export const RESOURCE_TYPES = [
  { value: "PRODUCT" },
  { value: "COLLECTION" },
  { value: "PAGE" },
  { value: "ARTICLE" },
  { value: "BLOG" },
] as const;

export type ResourceType = (typeof RESOURCE_TYPES)[number]["value"];

export const isResourceType = (value: unknown): value is ResourceType =>
  RESOURCE_TYPES.some((t) => t.value === value);
