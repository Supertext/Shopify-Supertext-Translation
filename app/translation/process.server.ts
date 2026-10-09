import type { AdminClient } from "./shopify.server";
import { translateResource, type TranslateDocument } from "./translate.server";
import { errorInfo, type ErrorInfo } from "../i18n/error";

export interface JobRequest {
  resourceIds: string[];
  locales: string[];
  overwrite: boolean;
}

/** `message` is English; `code`/`params`/`detail` let the UI show it in the merchant's language. */
export interface JobError extends ErrorInfo {
  resource: string;
  locale: string;
}

/** Errors that fail every item the same way: a bad key or an exhausted limit. */
const FATAL = new Set(["auth", "limitExceeded", "noApiKey"]);
/** Supertext refused the language (wrong code): reported once, then the language is skipped. */
const REFUSED = new Set(["languagePair", "languagePairUnknown"]);

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
        const info = errorInfo(error);
        progress.errors.push({ resource: resourceId, locale, ...info });
        if (info.code && REFUSED.has(info.code)) {
          refused.add(locale);
        }
        if (info.code && FATAL.has(info.code)) {
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
