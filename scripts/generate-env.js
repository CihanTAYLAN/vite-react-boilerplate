import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const ENV_PATH = resolve(process.cwd(), ".env");
const OUTPUT_PATH = resolve(process.cwd(), "public/env.js");

const DEFAULT_ENV = {
  API_BASE_URL: "__MOCK__",
  APP_ENV: "development",
};

function parseEnvFile(content) {
  const parsed = {};

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const normalizedLine = line.startsWith("export ")
      ? line.slice("export ".length)
      : line;

    const separatorIndex = normalizedLine.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = normalizedLine.slice(0, separatorIndex).trim();
    let value = normalizedLine.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    parsed[key] = value;
  }

  return parsed;
}

function normalizeValue(value, fallback) {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim();
  return trimmed || fallback;
}

const fileValues = existsSync(ENV_PATH)
  ? parseEnvFile(readFileSync(ENV_PATH, "utf8"))
  : {};

const runtimeEnv = {
  API_BASE_URL: normalizeValue(
    fileValues.API_BASE_URL,
    DEFAULT_ENV.API_BASE_URL,
  ),
  APP_ENV: normalizeValue(fileValues.APP_ENV, DEFAULT_ENV.APP_ENV),
};

const content = `window.__ENV__ = ${JSON.stringify(runtimeEnv, null, 2)};\n`;

writeFileSync(OUTPUT_PATH, content, "utf8");

console.log(
  `[env] Generated public/env.js (API_BASE_URL=${runtimeEnv.API_BASE_URL}, APP_ENV=${runtimeEnv.APP_ENV})`,
);
