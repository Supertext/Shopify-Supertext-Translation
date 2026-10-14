import { defineConfig } from "vitest/config";

// Separate from vite.config.ts so the tests don't load the React Router plugin.
// SUPERTEXT_REPORT_URL: tests never reach the live Commando Center (reporting tests use fakes).
export default defineConfig({
  test: {
    include: ["test/**/*.test.ts"],
    environment: "node",
    env: { SUPERTEXT_REPORT_URL: "http://127.0.0.1:9/report", SUPERTEXT_VERSION_REPORTS: "" },
  },
});
