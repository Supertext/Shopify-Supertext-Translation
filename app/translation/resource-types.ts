// Shared by the server and the browser (no server-only code here).

/** Resource types the app translates, in the order the UI shows them. */
export const RESOURCE_TYPES = [
  { value: "PRODUCT", label: "Products" },
  { value: "COLLECTION", label: "Collections" },
  { value: "PAGE", label: "Pages" },
  { value: "ARTICLE", label: "Blog posts" },
  { value: "BLOG", label: "Blogs" },
] as const;

export type ResourceType = (typeof RESOURCE_TYPES)[number]["value"];

export const isResourceType = (value: unknown): value is ResourceType =>
  RESOURCE_TYPES.some((t) => t.value === value);
