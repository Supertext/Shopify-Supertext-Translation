import { useEffect, useState } from "react";
import type {
  ActionFunctionArgs,
  HeadersFunction,
  LoaderFunctionArgs,
} from "react-router";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
  useRevalidator,
  useSearchParams,
} from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import { recentJobs, startJob, type JobView } from "../jobs.server";
import { effectiveApiKey, getSettings } from "../settings.server";
import { titleOf } from "../translation/fields.server";
import { listResources, shopLocales } from "../translation/shopify.server";
import { isResourceType, RESOURCE_TYPES } from "../translation/resource-types";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const url = new URL(request.url);
  const typeParam = url.searchParams.get("type");
  const type = isResourceType(typeParam) ? typeParam : "PRODUCT";
  const after = url.searchParams.get("after");

  const [locales, page, jobs, settings] = await Promise.all([
    shopLocales(admin),
    listResources(admin, type, after),
    recentJobs(session.shop),
    getSettings(session.shop),
  ]);
  const primary = locales.find((l) => l.primary);

  return {
    type,
    primary: primary ? { locale: primary.locale, name: primary.name } : null,
    targets: locales
      .filter((l) => !l.primary)
      .map((l) => ({ locale: l.locale, name: l.name, published: l.published })),
    resources: page.resources.map((r) => ({
      id: r.id,
      title: titleOf(r.content),
    })),
    nextCursor: page.hasNextPage ? page.endCursor : null,
    jobs,
    hasApiKey: effectiveApiKey(settings) !== "",
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const form = await request.formData();
  const resourceIds = form.getAll("resource").map(String).filter(Boolean);
  const locales = form.getAll("locale").map(String).filter(Boolean);
  if (resourceIds.length === 0 || locales.length === 0) {
    return { error: "Select at least one item and one language." };
  }
  const settings = await getSettings(session.shop);
  if (!effectiveApiKey(settings)) {
    return {
      error:
        "No Supertext API key yet. Add it under Settings (create an account at https://www.supertext.com/person/en/account/signin, generate the key at https://www.supertext.com/en/integrations/api; requires the Admin role).",
    };
  }
  const jobId = await startJob(session.shop, {
    resourceIds,
    locales,
    overwrite: form.get("overwrite") === "on",
  });
  return { jobId };
};

const isActive = (job: JobView) => job.status === "queued" || job.status === "running";

export default function Translate() {
  const data = useLoaderData<typeof loader>();
  const result = useActionData<typeof action>();
  const navigation = useNavigation();
  const revalidator = useRevalidator();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const submitting = navigation.state === "submitting";
  const running = data.jobs.some(isActive);

  // Refresh the job list while a translation runs.
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      if (revalidator.state === "idle") revalidator.revalidate();
    }, 2000);
    return () => clearInterval(timer);
  }, [running, revalidator]);

  // Only the items on the current page are submitted, so start over on every page.
  const pageKey = searchParams.toString();
  useEffect(() => setSelected(new Set()), [pageKey]);

  const toggle = (id: string) =>
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const allSelected =
    data.resources.length > 0 && data.resources.every((r) => selected.has(r.id));

  return (
    <s-page heading="Translate with Supertext">
      {result && "error" in result && (
        <s-banner tone="critical">
          <s-paragraph>{result.error}</s-paragraph>
        </s-banner>
      )}
      {result && "jobId" in result && (
        <s-banner tone="success">
          <s-paragraph>
            Translation started. Progress shows under Recent translations;
            you can leave this page meanwhile.
          </s-paragraph>
        </s-banner>
      )}
      {!data.hasApiKey && (
        <s-banner tone="warning" heading="Add your Supertext API key">
          <s-paragraph>
            The app needs a Supertext API key before it can translate. Enter
            it under <s-link href="/app/settings">Settings</s-link>.
          </s-paragraph>
          <s-paragraph>
            No Supertext account yet?{" "}
            <a
              href="https://www.supertext.com/person/en/account/signin"
              target="_blank"
              rel="noopener noreferrer"
            >
              Create one at supertext.com
            </a>
            . Generate your API key at{" "}
            <a
              href="https://www.supertext.com/en/integrations/api"
              target="_blank"
              rel="noopener noreferrer"
            >
              supertext.com → Integrations → API
            </a>{" "}
            (requires the Admin role).
          </s-paragraph>
        </s-banner>
      )}
      {data.targets.length === 0 && (
        <s-banner tone="info" heading="Add a second language">
          <s-paragraph>
            Your shop has only one language. Add languages under Settings →
            Languages in the Shopify admin, then come back here.
          </s-paragraph>
        </s-banner>
      )}

      <Form method="post">
        <s-section heading="1. Choose what to translate">
          <s-stack direction="inline" gap="small-200">
            {RESOURCE_TYPES.map((t) => (
              <s-button
                key={t.value}
                variant={t.value === data.type ? "primary" : "secondary"}
                onClick={() => setSearchParams({ type: t.value })}
              >
                {t.label}
              </s-button>
            ))}
          </s-stack>

          {data.resources.length === 0 ? (
            <s-paragraph>Nothing of this type yet.</s-paragraph>
          ) : (
            <div style={{ marginTop: 12 }}>
              <label style={rowStyle}>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() =>
                    setSelected(
                      allSelected ? new Set() : new Set(data.resources.map((r) => r.id)),
                    )
                  }
                />
                <strong>Select all on this page ({data.resources.length})</strong>
              </label>
              {data.resources.map((r) => (
                <label key={r.id} style={rowStyle}>
                  <input
                    type="checkbox"
                    name="resource"
                    value={r.id}
                    checked={selected.has(r.id)}
                    onChange={() => toggle(r.id)}
                  />
                  {r.title}
                </label>
              ))}
            </div>
          )}
          {(data.nextCursor || searchParams.get("after")) && (
            <s-stack direction="inline" gap="small-200">
              {searchParams.get("after") && (
                <s-button onClick={() => setSearchParams({ type: data.type })}>
                  First page
                </s-button>
              )}
              {data.nextCursor && (
                <s-button
                  onClick={() =>
                    setSearchParams({ type: data.type, after: data.nextCursor! })
                  }
                >
                  Next page
                </s-button>
              )}
            </s-stack>
          )}
        </s-section>

        <s-section heading="2. Choose the languages">
          {data.primary && (
            <s-paragraph>
              Translating from <strong>{data.primary.name}</strong>, your
              shop&apos;s default language.
            </s-paragraph>
          )}
          {data.targets.map((l) => (
            <label key={l.locale} style={rowStyle}>
              <input type="checkbox" name="locale" value={l.locale} defaultChecked />
              {l.name} ({l.locale})
              {!l.published && <em style={{ color: "#6d7175" }}>, not published yet</em>}
            </label>
          ))}
          <label style={{ ...rowStyle, marginTop: 8 }}>
            <input type="checkbox" name="overwrite" />
            Overwrite existing translations
          </label>
          <s-paragraph>
            Without this option, fields that already have a current
            translation are kept. Outdated ones (the original changed since)
            are always translated again.
          </s-paragraph>
        </s-section>

        <s-section>
          <s-stack direction="inline" gap="base">
            <button
              type="submit"
              disabled={submitting || selected.size === 0 || data.targets.length === 0}
              style={buttonStyle}
            >
              {submitting
                ? "Starting…"
                : selected.size
                  ? `Translate ${selected.size} with Supertext`
                  : "Translate with Supertext"}
            </button>
          </s-stack>
        </s-section>
      </Form>

      <s-section heading="Recent translations">
        {data.jobs.length === 0 ? (
          <s-paragraph>No translations yet.</s-paragraph>
        ) : (
          data.jobs.map((job) => <JobRow key={job.id} job={job} />)
        )}
      </s-section>
    </s-page>
  );
}

function JobRow({ job }: { job: JobView }) {
  const label = isActive(job)
    ? `Translating… ${job.completed} of ${job.total}`
    : job.status === "failed"
      ? "Failed"
      : job.errors.length
        ? "Done, with errors"
        : "Done";
  return (
    <s-box padding="small" borderWidth="base" borderRadius="base">
      <s-paragraph>
        <strong>{label}</strong> · {new Date(job.createdAt).toLocaleString()} ·{" "}
        {job.locales.join(", ")} · {job.written} fields translated
        {job.skipped ? `, ${job.skipped} kept` : ""}
      </s-paragraph>
      {job.errors.slice(0, 5).map((e, i) => (
        <s-paragraph key={i}>
          <s-text tone="critical">
            {e.locale ? `${e.locale}: ` : ""}
            {e.message}
          </s-text>
        </s-paragraph>
      ))}
    </s-box>
  );
}

const rowStyle = {
  display: "flex",
  gap: 8,
  alignItems: "center",
  padding: "6px 0",
  cursor: "pointer",
} as const;

const buttonStyle = {
  background: "#303030",
  color: "#fff",
  border: 0,
  borderRadius: 8,
  padding: "8px 14px",
  font: "inherit",
  fontWeight: 600,
  cursor: "pointer",
} as const;

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
