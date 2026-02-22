/// <reference types="vite/client" />

interface RuntimeEnv {
  API_BASE_URL?: string;
  APP_ENV?: string;
}

interface Window {
  __ENV__?: RuntimeEnv;
}
