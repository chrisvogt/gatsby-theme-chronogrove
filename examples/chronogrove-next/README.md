# Next.js reference — `@chronogrove/ui`

Minimal **Next.js 16 App Router** app using **`@chronogrove/ui/next`** (`ChronogroveNextRootLayoutHead`, `ChronogroveNextEmotionRegistry`, `ChronogroveNextAppShell`) for Emotion SSR, Theme UI color-mode head scripts, three.js background, and client-side navigation reconcile.

**Package name:** `chronogrove-next` (private workspace package). It is **not** the main site in this repo (that remains **Gatsby** under `www.chrisvogt.me`); it exists to exercise `@chronogrove/ui/next` in CI-friendly source form and to keep Next integration docs honest.

## Repository hygiene

- **[`.gitignore`](./.gitignore)** ignores **`.next`**, **`out`**, **`node_modules`**, **`.turbo`**, **`.vercel`**, **`.env` / `.env*.local`**, and logs so PRs do not pick up build output or deploy metadata.
- **Tracked in git:** `app/`, `next.config.mjs`, `jsconfig.json`, `package.json`, this README — only sources and config.

**`@chronogrove/ui` setup:** The example depends on `@chronogrove/ui` via `workspace:*` ([`package.json`](./package.json)). [`next.config.mjs`](./next.config.mjs) lists `transpilePackages` so the UI package (and Theme UI) compile in App Router. Global CSS imports [`@chronogrove/ui/color-toggle-styles`](../../packages/ui/src/color-toggle-styles.css) for `ColorToggle`; `@theme-toggles/react` is **not** a direct dependency—it is pulled in **transitively** through `@chronogrove/ui`.

**`@fortawesome/free-brands-svg-icons`:** A **direct** dependency so [`app/home-showcase.jsx`](./app/home-showcase.jsx) can pass brand icons (e.g. `faGithub`) into **`WidgetHeader`** — matching how `gatsby-theme-chronogrove` widgets import icons for the same component. Core Font Awesome packages are also dependencies of `@chronogrove/ui`.

**Versions:** Shared dependency versions (`next`, `react`, `theme-ui`, Emotion, `eslint-config-next`, etc.) use the repo [`pnpm` catalog](../../pnpm-workspace.yaml) (`catalog:` in this package’s `package.json`). Bump the catalog when upgrading tooling so this example stays aligned with `packages/ui` and the rest of the monorepo. The catalog pins the **Next.js 16** line; major Next upgrades should stay deliberate repo-wide changes, not silent bumps in one package.

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

| File                                               | Role                                                                                                                                  |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| [`app/layout.jsx`](./app/layout.jsx)               | Server layout: `ChronogroveNextRootLayoutHead`, `ChronogroveNextEmotionRegistry`; `suppressHydrationWarning` on `<html>`/`<body>`     |
| [`app/providers.jsx`](./app/providers.jsx)         | Client: `ChronogroveNextAppShell` (theme provider, three.js background, surface sync, route reconcile)                                |
| [`app/globals.css`](./app/globals.css)             | `@import '@chronogrove/ui/color-toggle-styles'` (styles for `color-toggle`)                                                           |
| [`app/home-showcase.jsx`](./app/home-showcase.jsx) | Client showcase: imports the same `@chronogrove/ui` primitives as the Gatsby theme (`WidgetHeader`, `Pagination`, `PageHeader`, etc.) |

See [`@chronogrove/ui` README](../../packages/ui/README.md#nextjs-app-router) for integration notes.
