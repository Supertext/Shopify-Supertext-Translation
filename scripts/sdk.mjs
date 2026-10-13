// The bundled Supertext SDK (vendor/supertext-sdk), copied unchanged from
// https://github.com/Supertext/Supertext-API-SDK-and-Guide (sdk/typescript/src).
//
//   node scripts/sdk.mjs check            fails if a bundled file was edited
//   node scripts/sdk.mjs update <dir>     copies the SDK from a checkout of that repo
//                                         and records its version, commit and checksums
//
// Never edit the files in vendor/supertext-sdk: fix the SDK repo, then update.
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { copyFileSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const VENDOR = "vendor/supertext-sdk";
const MANIFEST = join(VENDOR, "SDK_VERSION.json");
const sha = (file) => createHash("sha256").update(readFileSync(file)).digest("hex");
const sources = (dir) => readdirSync(dir).filter((f) => f.endsWith(".ts")).sort();

const [command, dir] = process.argv.slice(2);
if (command === "update") {
  if (!dir) throw new Error("usage: node scripts/sdk.mjs update <path to Supertext-API-SDK-and-Guide>");
  const src = join(dir, "sdk/typescript/src");
  for (const old of sources(VENDOR)) if (!sources(src).includes(old)) throw new Error(`${old} no longer in the SDK: delete it by hand`);
  for (const file of sources(src)) copyFileSync(join(src, file), join(VENDOR, file));
  copyFileSync(join(dir, "sdk/typescript/LICENSE"), join(VENDOR, "LICENSE"));
  const version = JSON.parse(readFileSync(join(dir, "sdk/typescript/package.json"), "utf8")).version;
  const commit = execFileSync("git", ["-C", dir, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
  const files = Object.fromEntries(sources(VENDOR).map((f) => [f, sha(join(VENDOR, f))]));
  writeFileSync(MANIFEST, JSON.stringify({ version, commit, source: "https://github.com/Supertext/Supertext-API-SDK-and-Guide/tree/" + commit + "/sdk/typescript/src", files }, null, 2) + "\n");
  console.log(`Bundled supertext-sdk ${version} (${commit.slice(0, 7)}).`);
} else if (command === "check") {
  const manifest = JSON.parse(readFileSync(MANIFEST, "utf8"));
  const problems = [];
  for (const [file, hash] of Object.entries(manifest.files)) if (sha(join(VENDOR, file)) !== hash) problems.push(`${file} was edited`);
  for (const file of sources(VENDOR)) if (!(file in manifest.files)) problems.push(`${file} is not part of the SDK`);
  if (problems.length) {
    console.error(`vendor/supertext-sdk differs from supertext-sdk ${manifest.version}:\n  ${problems.join("\n  ")}\nFix it in the SDK repo and run: node scripts/sdk.mjs update <dir>`);
    process.exit(1);
  }
  console.log(`vendor/supertext-sdk = supertext-sdk ${manifest.version} (${manifest.commit.slice(0, 7)}), unchanged.`);
} else {
  throw new Error("usage: node scripts/sdk.mjs check | update <dir>");
}
