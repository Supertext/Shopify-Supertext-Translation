import type { AdminClient } from "./shopify.server";
import { translateResource, type TranslateDocument } from "./translate.server";

export interface JobRequest {
  resourceIds: string[];
  locales: string[];
  overwrite: boolean;
}

export interface JobError {
  resource: string;
  locale: string;
  message: string;
}

export interface Progress {
  completed: number;
  written: number;
  skipped: number;
  errors: JobError[];
}

/**
 * Translates every resource into every locale, one at a time (the Supertext
 * API limits requests per second). One failure doesn't stop the others.
 */
export async function processJob(
  admin: AdminClient,
  translate: TranslateDocument,
  request: JobRequest,
  onProgress: (progress: Progress) => Promise<void>,
): Promise<Progress> {
  const progress: Progress = { completed: 0, written: 0, skipped: 0, errors: [] };
  // Languages Supertext refused (wrong code): reported once, then skipped.
  const refused = new Set<string>();
  for (const resourceId of request.resourceIds) {
    for (const locale of request.locales) {
      if (refused.has(locale)) {
        progress.completed++;
        continue;
      }
      try {
        const result = await translateResource(
          admin,
          translate,
          resourceId,
          locale,
          request.overwrite,
        );
        progress.written += result.written;
        progress.skipped += result.skipped;
      } catch (error) {
        progress.errors.push({
          resource: resourceId,
          locale,
          message: (error as Error).message,
        });
        if (/Supertext doesn't translate/.test((error as Error).message)) {
          refused.add(locale);
        }
        // A bad key or an exhausted limit fails every item the same way.
        if (/Authentication failed|limit is exceeded|No Supertext API key/.test((error as Error).message)) {
          progress.completed = request.resourceIds.length * request.locales.length;
          await onProgress(progress);
          return progress;
        }
      }
      progress.completed++;
      await onProgress(progress);
    }
  }
  return progress;
}
