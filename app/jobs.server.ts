import prisma from "./db.server";
import { getSettings, supertextClient } from "./settings.server";
import { supertextCode } from "./translation/language-codes";
import { unauthenticated } from "./shopify.server";
import { shopLocales } from "./translation/shopify.server";
import type { TranslateDocument } from "./translation/translate.server";
import {
  processJob,
  type JobError,
  type JobRequest,
} from "./translation/process.server";

export type { JobError, JobRequest };

export interface JobView {
  id: string;
  status: string;
  total: number;
  completed: number;
  written: number;
  skipped: number;
  errors: JobError[];
  locales: string[];
  createdAt: string;
}

export async function recentJobs(shop: string, take = 5): Promise<JobView[]> {
  const rows = await prisma.translationJob.findMany({
    where: { shop },
    orderBy: { createdAt: "desc" },
    take,
  });
  return rows.map((row) => ({
    id: row.id,
    status: row.status,
    total: row.total,
    completed: row.completed,
    written: row.written,
    skipped: row.skipped,
    errors: JSON.parse(row.errors) as JobError[],
    locales: (JSON.parse(row.request) as JobRequest).locales,
    createdAt: row.createdAt.toISOString(),
  }));
}

/**
 * Starts a translation in the background and returns its id. The work runs in
 * this process with the shop's offline session; the page polls the job row.
 */
export async function startJob(shop: string, request: JobRequest): Promise<string> {
  const job = await prisma.translationJob.create({
    data: {
      shop,
      request: JSON.stringify(request),
      total: request.resourceIds.length * request.locales.length,
    },
  });
  void runJob(job.id, shop, request).catch(async (error: Error) => {
    console.error(`[supertext] job ${job.id} failed: ${error.message}`);
    await prisma.translationJob
      .update({
        where: { id: job.id },
        data: {
          status: "failed",
          errors: JSON.stringify([{ resource: "", locale: "", message: error.message }]),
        },
      })
      .catch(() => undefined);
  });
  return job.id;
}

async function runJob(id: string, shop: string, request: JobRequest): Promise<void> {
  const { admin } = await unauthenticated.admin(shop);
  const settings = await getSettings(shop);
  const client = supertextClient(settings);
  const primary = (await shopLocales(admin)).find((l) => l.primary)?.locale;
  const translate: TranslateDocument = (html, locale) =>
    client.translateDocument(html, {
      targetLanguage: supertextCode(locale, settings.languageCodes),
      sourceLanguage: primary,
      politeness: settings.politeness,
    });

  await prisma.translationJob.update({ where: { id }, data: { status: "running" } });
  const result = await processJob(admin, translate, request, async (progress) => {
    await prisma.translationJob.update({
      where: { id },
      data: {
        completed: progress.completed,
        written: progress.written,
        skipped: progress.skipped,
        errors: JSON.stringify(progress.errors),
      },
    });
  });
  await prisma.translationJob.update({
    where: { id },
    data: {
      status: result.errors.length && result.written === 0 ? "failed" : "done",
    },
  });
}
