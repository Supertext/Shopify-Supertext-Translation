import { readFileSync } from "node:fs";
import { join } from "node:path";

let cached: string | null | undefined;

/**
 * The app's version, read at runtime from package.json (the only place it is
 * kept; the release workflow checks it against CHANGELOG.md).
 */
export function appVersion(): string | null {
  if (cached === undefined) {
    try {
      const pkg = JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf8"));
      cached = typeof pkg.version === "string" ? pkg.version : null;
    } catch {
      cached = null;
    }
  }
  return cached ?? null;
}

/** The GitHub release page for an X.Y.Z version, else null. */
export function releaseUrl(version: string | null): string | null {
  return version && /^\d+\.\d+\.\d+$/.test(version)
    ? `https://github.com/Supertext/Shopify-Supertext-Translation/releases/tag/v${version}`
    : null;
}
