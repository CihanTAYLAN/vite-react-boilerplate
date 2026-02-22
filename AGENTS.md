# AGENTS.md

This file defines project-specific working rules for agents in this repository.
Goal: deliver fast, maintainable, production-quality changes.

## 1. Scope and Priority
- Follow the existing architecture first.
- Extend without breaking: preserve current routing, auth, runtime-config, and UI behavior.
- Optimize for readability and long-term maintenance.

## 2. Mandatory Rules
- Use `yarn` only.
- Do not use `import.meta.env` for runtime config. This project uses `window.__ENV__`.
- Keep `/env.js` loaded before the app bundle in `index.html`.
- For local development, generate `.env` -> `public/env.js` via `yarn env:generate`.
- Keep Docker assets under `.docker/` (`.docker/nginx.conf`, `.docker/docker-entrypoint.sh`).
- This project does not target `docker compose`; do not add compose-based workflows.

## 3. Architecture Contract
- `src/app`: app bootstrap and providers.
- `src/routes`: route definitions and guards.
- `src/features`: feature-first pages/modules.
- `src/components/ui`: reusable UI primitives.
- `src/lib`: env, api-client, auth/storage helpers.
- `src/store`: Zustand stores.

Do not break this separation when adding code.

## 4. API and Auth Contract
- Login endpoint: `POST /api/v1/common/auth/login`
- Health endpoint (demo): `GET /health`
- Login response uses backend envelope format:
  - `data.accessToken`
  - `data.refreshToken`
  - optional `data.user`, `data.expiresIn`
- Token storage keys:
  - `accessToken`
  - `refreshToken`
- Auth header format: `Authorization: Bearer <accessToken>`

If auth or endpoints change:
1. Update `src/lib/api-client.ts`
2. Update related feature page copy/behavior
3. Update endpoint docs in `README.md`

## 5. UI / UX Quality Rules
- Prefer palette updates through tokens in `src/index.css`.
- Prefer tokens over hard-coded colors in new components:
  - `--color-primary`, `--color-text`, `--color-border`, etc.
- Avoid responsive regressions:
  - header/nav must not overflow
  - long text/tokens must be handled with wrap/truncate/scroll
- Avoid global CSS that overrides utility classes unintentionally (especially link/button colors).

## 6. TypeScript and Code Standards
- Respect `strict` rules; avoid `any` (if unavoidable, add a short reason).
- Keep function and API return types explicit.
- Provide user-friendly error handling.
- Follow existing patterns:
  - Forms: `react-hook-form` + `zod`
  - Global state: `zustand`
  - Request cache/revalidation: `swr`

## 7. Required Validation After Changes
Run these commands after meaningful changes:

```bash
yarn format
yarn lint
yarn typecheck
yarn build
```

Build chain includes `env:generate`, so `.env` values are reflected.

## 8. Documentation Hygiene
Update `README.md` whenever these change:
- endpoint/path
- env behavior
- script names
- project structure
- runtime/deployment flow

## 9. Disallowed / Avoid
- Introducing random libraries outside the chosen stack.
- Breaking the runtime config model.
- Hiding permanent UI issues with one-off CSS hacks.
- Leaving lint/typecheck/build broken.

## 10. Definition of Done
A task is done only if:
1. Requested behavior works.
2. Existing behavior has no regressions.
3. `format + lint + typecheck + build` are clean.
4. `README.md` is updated when required.
