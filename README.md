# Vite React Runtime Config Starter

## 1. Project Overview
This repository is a production-ready static SPA starter built with React + Vite + TypeScript.
It demonstrates runtime configuration (`window.__ENV__`) for Dockerized static deployments so the same image can run in multiple environments without rebuilding.

## 2. Features List
- React Router with nested routes, layout routes, and protected route guard
- Zustand global state (counter, theme, auth snapshot)
- SWR request/caching/revalidation workflow
- Form handling with `react-hook-form` + `zod`
- Token-based auth helpers using `localStorage` (`accessToken`, `refreshToken`)
- Runtime config via `/env.js` loaded before the app bundle
- Multi-stage Docker build and Nginx static hosting with SPA fallback
- Built-in mock API mode for local demo without backend

## 3. Tech Stack
- React `^19.2.4`
- Vite `^7.3.1`
- TypeScript `^5.9.3` (strict mode)
- React Router DOM `^7.13.0`
- Zustand `^5.0.11`
- SWR `^2.4.0`
- react-hook-form `^7.71.2`
- zod `^4.3.6`
- @hookform/resolvers `^5.2.2`
- Tailwind CSS `^4.2.0` + `@tailwindcss/vite`
- shadcn/ui style components (Button, Card, Input, Label, Form)
- Biome `^2.4.4`
- Docker + Nginx

## 4. Quick Start
```bash
yarn install
yarn dev
```

Production build preview:
```bash
yarn build
yarn preview
```

## 5. Demo Routes
- `/` - Landing page with starter-kit overview and quick links
- `/demo/routing` - Nested routing parent layout demo
- `/demo/routing/child-a` - Nested child route A
- `/demo/routing/child-b` - Nested child route B
- `/demo/state` - Zustand counter + theme persistence demo
- `/demo/requests` - SWR fetch/cache/revalidate demo
- `/demo/forms` - react-hook-form + zod touched/values demo
- `/auth/login` - Login form, token save, redirect to protected page
- `/auth/register` - Registration form, redirect to login on success
- `/demo/protected` - Protected page requiring `accessToken`

## 6. Runtime Configuration
The app reads runtime config from `window.__ENV__`:

- `API_BASE_URL`
- `APP_ENV`

### How it works
1. `index.html` loads `/env.js` before `/src/main.tsx`.
2. For local development, `yarn dev`/`yarn build` generates `public/env.js` from `.env`.
3. In Docker runtime, `env.js` is generated from `public/env.template.js` with `envsubst`.
4. The frontend reads values through `src/lib/env.ts`.

### Files
- `public/env.template.js`
- `public/env.js` (local default)
- `src/lib/env.ts`
- `index.html`

`public/env.template.js` placeholders:
```js
window.__ENV__ = {
  API_BASE_URL: "$API_BASE_URL",
  APP_ENV: "$APP_ENV"
};
```

Example runtime values:
- `API_BASE_URL=https://api.example.com`
- `API_BASE_URL=http://localhost:3000`
- `API_BASE_URL=__MOCK__`

Local `.env` example:
```env
API_BASE_URL=http://localhost:8000
APP_ENV=development
```

## 7. Docker Deployment
Build and run:
```bash
docker build -t vite-react-runtime-config-starter .
docker run --rm -p 8080:80 \
  -e API_BASE_URL=https://api.example.com \
  -e APP_ENV=production \
  vite-react-runtime-config-starter
```

The entrypoint script generates `/usr/share/nginx/html/env.js` from `env.template.js` at container startup.

## 8. Mock API Mode
Mock mode is active when:
- `API_BASE_URL` is empty, or
- `API_BASE_URL=__MOCK__`

Mock endpoints:
- `POST /api/v1/common/auth/login` -> `{ accessToken, refreshToken }`
- `POST /api/v1/common/auth/register` -> `{ success: true, message: string }`
- `GET /health` -> health payload for SWR demo

Behavior:
- 500ms artificial delay
- no external mock library dependency

## 9. Development
Scripts:
```bash
yarn dev
yarn build
yarn preview
yarn typecheck
yarn lint
yarn format
```

## 10. Project Structure
```text
.
├── .env.example
├── .docker/
│   ├── docker-entrypoint.sh
│   └── nginx.conf
├── public/
│   ├── env.js
│   └── env.template.js
├── src/
│   ├── app/          # app bootstrap and providers
│   ├── routes/       # router tree and protected route wrapper
│   ├── features/     # landing, demos, auth pages
│   ├── components/   # shared layout + ui primitives
│   ├── lib/          # env reader, api client, auth/storage helpers
│   └── store/        # zustand stores
├── Dockerfile
├── components.json
├── biome.json
├── tsconfig*.json
└── vite.config.ts
```

## 11. Adding shadcn/ui Components
This project already includes `components.json` and core primitives.
To add more components:

```bash
yarn dlx shadcn@latest add dialog
yarn dlx shadcn@latest add dropdown-menu
```

Then adjust imports to alias-based paths, for example:
- `@/components/ui/dialog`
- `@/lib/utils`

## 12. Color Palette Customization
Palette is centralized with CSS variables in `src/index.css`.

### Quick switch (no code changes)
Change the preset in `index.html`:

```html
<html lang="en" data-palette="ocean">
```

Available presets:
- `ocean` (default)
- `emerald`
- `sunset`

### Fine-tune your own palette
Edit the tokens in `src/index.css`:
- `--color-primary`, `--color-primary-hover`, `--color-primary-foreground`
- `--color-secondary`, `--color-secondary-hover`, `--color-secondary-foreground`
- `--color-surface`, `--color-border`, `--color-text`, `--color-text-muted`
- `--color-bg-start`, `--color-bg-mid`, `--color-bg-end`

These tokens are consumed by shared UI primitives (`Button`, `Card`, `Input`) and top-level navigation, so palette updates propagate quickly.
