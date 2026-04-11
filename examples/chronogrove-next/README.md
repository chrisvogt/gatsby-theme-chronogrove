# Next.js reference — `@chronogrove/ui`

Minimal **Next.js 15 App Router** app proving Emotion SSR (`useServerInsertedHTML` + `CacheProvider`), `ChronogroveThemeProvider`, Theme UI color-mode head scripts, and client-side navigation reconcile for Theme UI.

**Package name:** `chronogrove-next` (private workspace package).

**`@chronogrove/ui` setup:** The example depends on `@chronogrove/ui` via `workspace:*` ([`package.json`](./package.json)). [`next.config.mjs`](./next.config.mjs) lists `transpilePackages` so the UI package (and Theme UI) compile in App Router. Global CSS imports [`@chronogrove/ui/color-toggle-styles`](../../packages/ui/src/color-toggle-styles.css) for `ColorToggle`; `@theme-toggles/react` is **not** a direct dependency—it is pulled in **transitively** through `@chronogrove/ui`.

**Versions:** Shared dependency versions (`next`, `react`, `theme-ui`, Emotion, `eslint-config-next`, etc.) use the repo [`pnpm` catalog](../../pnpm-workspace.yaml) (`catalog:` in this package’s `package.json`). Bump the catalog when upgrading tooling so this example stays aligned with `packages/ui` and the rest of the monorepo.

**localStorage:** Theme UI / Chronogrove use the key `theme-ui-color-mode` (see `@chronogrove/ui/color-mode`). This app does **not** install Material UI; keys like `mui-color-scheme` / `mui-color-scheme-light` come from [MUI](https://mui.com/) and are **not** written by this example—they usually indicate another origin (different tab, another `localhost` app, or a browser extension), not `node_modules` here.

## Commands

```bash
pnpm --filter chronogrove-next dev
pnpm --filter chronogrove-next build
```

From this directory:

```bash
pnpm dev
pnpm build
```

## Layout of interest

| File                                                                                 | Role                                                                                                               |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| [`app/layout.jsx`](./app/layout.jsx)                                                 | Server layout: `<head>` scripts/CSS; `suppressHydrationWarning` on `<html>`/`<body>` for Theme UI no-flash scripts |
| [`app/emotion-registry.jsx`](./app/emotion-registry.jsx)                             | Client: Emotion cache `key: 'css'`, `useServerInsertedHTML`                                                        |
| [`app/providers.jsx`](./app/providers.jsx)                                           | Client: `ChronogroveThemeProvider`                                                                                 |
| [`app/theme-ui-color-mode-route-sync.jsx`](./app/theme-ui-color-mode-route-sync.jsx) | Client: `reconcileThemeUiColorModeOnNavigation` on pathname change                                                 |
| [`app/globals.css`](./app/globals.css)                                               | `@import '@chronogrove/ui/color-toggle-styles'` (styles for `color-toggle`)                                        |

See [`@chronogrove/ui` README](../../packages/ui/README.md#nextjs-app-router) for integration notes.
