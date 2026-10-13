/**
 * The app's connection to Supertext: the bundled Supertext SDK
 * (vendor/supertext-sdk) plus the mapping of its error codes to the app's
 * translated messages (`error.<code>` in app/i18n).
 *
 * The SDK does the protocol: auth header, multipart upload, polling, 429
 * retries, deleting files, packing segments into documents, language codes.
 */
import {
  SupertextClient,
  SupertextError,
  type Politeness,
  type SegmentInput,
} from "../../vendor/supertext-sdk/index";
import { LocalizedError, type MessageParams } from "../i18n/error";

export { SupertextClient, SupertextError };
export type { Politeness, SegmentInput };

export interface ClientOptions {
  apiKey: string;
  /** Default: the live API. */
  baseUrl?: string;
  /** e.g. "Shopify-Supertext-Translation/0.1.0", appended to the SDK's User-Agent. */
  userAgent?: string;
  /** Tests: HTTP and sleep implementations. */
  fetch?: (input: string, init: RequestInit) => Promise<Response>;
  sleep?: (ms: number) => Promise<void>;
  pollIntervalMs?: number;
}

export function createClient(options: ClientOptions): SupertextClient {
  return new SupertextClient(options.apiKey, {
    ...(options.baseUrl ? { baseUrl: options.baseUrl } : {}),
    ...(options.userAgent ? { userAgent: options.userAgent } : {}),
    ...(options.fetch ? { fetch: options.fetch } : {}),
    ...(options.sleep ? { sleep: options.sleep } : {}),
    ...(options.pollIntervalMs !== undefined ? { pollIntervalMs: options.pollIntervalMs } : {}),
  });
}

const AUTH_HINT =
  " No Supertext account yet? Create one at https://www.supertext.com/person/en/account/signin. Generate your API key at https://www.supertext.com/en/integrations/api (requires the Admin role).";

/**
 * The SDK's error as a LocalizedError the UI can show in the merchant's
 * language. Other errors pass through unchanged.
 */
export function localizeError(error: unknown): unknown {
  if (!(error instanceof SupertextError)) return error;
  const params: MessageParams = {};
  let code: string;
  let message = error.message;
  let detail = error.detail;
  switch (error.code) {
    case "missing_api_key":
      code = "noApiKey";
      break;
    case "authentication_failure":
      code = "auth";
      message += AUTH_HINT;
      break;
    case "invalid_language_pair":
      // The API's raw JSON isn't useful to merchants; the message says what to do.
      detail = undefined;
      if (error.sourceLang && error.targetLang) {
        code = "languagePair";
        params.source = error.sourceLang;
        params.target = error.targetLang;
        message = `Supertext doesn't translate from "${error.sourceLang}" into "${error.targetLang}". Set the Supertext code for this language under Settings → Languages, with a region (e.g. de-CH, fr-FR, en-US).`;
      } else {
        code = "languagePairUnknown";
      }
      break;
    case "not_found":
      code = "notFound";
      break;
    case "payload_too_large":
      code = "tooLarge";
      break;
    case "too_many_requests":
      code = "rateLimited";
      break;
    case "service_unavailable":
      code = "unavailable";
      break;
    case "unexpected_status":
      code = "http";
      params.status = error.status ?? 0;
      break;
    case "transport_error":
      code = "unreachable";
      params.reason = error.detail ?? "";
      detail = undefined;
      break;
    case "no_file_id":
      code = "noFileId";
      break;
    case "translation_error":
      code = "translationFailed";
      break;
    case "quota_exceeded":
      code = "limitExceeded";
      break;
    case "file_deleted":
      code = "fileDeleted";
      break;
    case "timeout":
      code = "timeout";
      break;
    case "incomplete_response":
      code = "incompleteResponse";
      break;
    default:
      code = "http";
      params.status = error.status ?? 0;
  }
  return new LocalizedError(message, code, params, detail);
}

/** Error codes (app side) that fail every item the same way: stop the whole job. */
export const FATAL_CODES = new Set(["auth", "limitExceeded", "noApiKey"]);
/** Error codes for a language Supertext refuses: skip that language for the rest of the job. */
export const REFUSED_CODES = new Set(["languagePair", "languagePairUnknown"]);
