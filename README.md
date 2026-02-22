# Vite React Runtime Config Starter

Production-ready **React + Vite + TypeScript** starter for static SPA deployments with **runtime configuration**.
Build once, deploy the same image everywhere, inject environment values at runtime via `window.__ENV__`.

## Why This Starter
- Runtime config model for static deployments (`/env.js`)
- Real app patterns: routing, auth guard, forms, global state, request cache
- Developer-friendly defaults: strict TypeScript, Biome, path aliases
- Works with and without backend (`__MOCK__` mode)

## Feature Highlights
- **Routing**: nested/layout routes + protected route pattern
- **State**: Zustand (counter, theme, auth snapshot)
- **Requests**: SWR with cache + revalidation
- **Forms**: `react-hook-form` + `zod`
- **Auth**: token helpers with `localStorage`
- **Runtime Env**: `window.__ENV__` (not build-time env)
- **Deployment**: multi-stage Docker + Nginx SPA fallback

## Tech Stack
- React `^19.2.4`
- Vite `^7.3.1`
- TypeScript `^5.9.3` (strict)
- React Router DOM `^7.13.0`
- Zustand `^5.0.11`
- SWR `^2.4.0`
- react-hook-form `^7.71.2`
- zod `^4.3.6`
- @hookform/resolvers `^5.2.2`
- Tailwind CSS `^4.2.0` + `@tailwindcss/vite`
- shadcn/ui-style primitives (Button, Card, Input, Label, Form)
- Biome `^2.4.4`
- Docker + Nginx

## Quick Start
```bash
yarn install
cp .env.example .env
yarn dev
```

Build preview:
```bash
yarn build
yarn preview
```

## Runtime Configuration (`window.__ENV__`)
The app reads runtime values from `window.__ENV__`:
- `API_BASE_URL`
- `APP_ENV`

### Local workflow
- `.env` is converted into `public/env.js` via `yarn env:generate`
- `yarn dev` and `yarn build` call this automatically

### Docker workflow
- `public/env.template.js` includes placeholders
- container entrypoint generates `/usr/share/nginx/html/env.js` with `envsubst`

`public/env.template.js`:
```js
window.__ENV__ = {
  API_BASE_URL: "$API_BASE_URL",
  APP_ENV: "$APP_ENV"
};
```

Example `.env`:
```env
API_BASE_URL=http://localhost:8000
APP_ENV=development
```

## API Contract Used by Demos
- `POST /api/v1/common/auth/login`
- `POST /api/v1/common/auth/register` (demo/register flow)
- `GET /health`

Login response is parsed from envelope format:
- `data.accessToken`
- `data.refreshToken`
- optional: `data.user`, `data.expiresIn`

## Demo Routes
| Route | Purpose |
|---|---|
| `/` | Landing and quick navigation |
| `/demo/routing` | Nested/layout routing demo |
| `/demo/routing/child-a` | Nested child route A |
| `/demo/routing/child-b` | Nested child route B |
| `/demo/state` | Zustand shared state + theme toggle |
| `/demo/requests` | SWR + `/health` request/caching demo |
| `/demo/forms` | Form validation with touched/error/value states |
| `/auth/login` | Login flow and token persistence |
| `/auth/register` | Register flow (demo endpoint) |
| `/demo/protected` | Guarded page with logout |

## Mock API Mode
Mock mode is active when:
- `API_BASE_URL` is empty, or
- `API_BASE_URL=__MOCK__`

Mock endpoints:
- `POST /api/v1/common/auth/login`
- `POST /api/v1/common/auth/register`
- `GET /health`

## Docker Deployment
```bash
docker build -t vite-react-runtime-config-starter .
docker run --rm -p 8080:80 \
  -e API_BASE_URL=https://api.example.com \
  -e APP_ENV=production \
  vite-react-runtime-config-starter
```

## Development Scripts
```bash
yarn dev
yarn build
yarn preview
yarn typecheck
yarn lint
yarn format
```

## Quality Gate
Before pushing changes:
```bash
yarn format
yarn lint
yarn typecheck
yarn build
```

## Project Structure
```text
.
├── .env.example
├── .docker/
│   ├── docker-entrypoint.sh
│   └── nginx.conf
├── public/
│   ├── env.js
│   └── env.template.js
├── scripts/
│   └── generate-env.js
├── src/
│   ├── app/
│   ├── routes/
│   ├── features/
│   ├── components/
│   ├── lib/
│   └── store/
├── Dockerfile
├── components.json
├── biome.json
├── tsconfig*.json
└── vite.config.ts
```

## Color Palette Customization
Palette is centralized in `src/index.css` using CSS tokens.

Quick preset switch in `index.html`:
```html
<html lang="en" data-palette="ocean">
```

Available presets:
- `ocean`
- `emerald`
- `sunset`

Core tokens you can tune:
- `--color-primary`, `--color-primary-hover`, `--color-primary-foreground`
- `--color-secondary`, `--color-secondary-hover`, `--color-secondary-foreground`
- `--color-surface`, `--color-border`, `--color-text`, `--color-text-muted`
- `--color-bg-start`, `--color-bg-mid`, `--color-bg-end`
