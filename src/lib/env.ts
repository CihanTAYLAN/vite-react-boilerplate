export interface AppEnv {
  API_BASE_URL: string;
  APP_ENV: string;
}

const DEFAULT_ENV: AppEnv = {
  API_BASE_URL: "__MOCK__",
  APP_ENV: "development",
};

const PLACEHOLDER_PATTERN = /^\$[A-Z0-9_]+$/;

function normalizeValue(value: string | undefined, fallback: string): string {
  if (!value) {
    return fallback;
  }

  const trimmed = value.trim();

  if (!trimmed || PLACEHOLDER_PATTERN.test(trimmed)) {
    return fallback;
  }

  return trimmed;
}

export function getEnvConfig(): AppEnv {
  if (typeof window === "undefined") {
    return DEFAULT_ENV;
  }

  const runtimeEnv = window.__ENV__;

  return {
    API_BASE_URL: normalizeValue(
      runtimeEnv?.API_BASE_URL,
      DEFAULT_ENV.API_BASE_URL,
    ),
    APP_ENV: normalizeValue(runtimeEnv?.APP_ENV, DEFAULT_ENV.APP_ENV),
  };
}
