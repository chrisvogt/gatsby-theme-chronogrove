# `@chronogrove/ui`

Shared **Theme UI** theme, color-mode (light/dark) helpers, **Emotion** cache utilities, and small **Gatsby-independent** components used by [`gatsby-theme-chronogrove`](../../theme/README.md).

## Install

In this monorepo the theme uses `workspace:*`. In another project (after publish):

```bash
pnpm add @chronogrove/ui
```

Use **`pnpm publish`** for releases so `workspace:` dependencies in dependents are rewritten; see [pnpm workspaces — publishing](https://pnpm.io/workspaces#publishing-workspace-packages).

**Shared dependencies with `gatsby-theme-chronogrove`:** both packages depend on Theme UI, Emotion, **`three`** (where WebGL backgrounds or artwork import it), and related libraries, with versions driven by the root [pnpm catalog](../../pnpm-workspace.yaml). When you bump those catalog entries, update **`packages/ui`**, **`theme`**, and any other workspace `package.json` files that reference `catalog:` for the same keys in the **same change** so installs stay aligned and you avoid duplicate or mismatched trees.

## Subpath exports

Prefer deep imports so bundles stay lean:

| Import path                                | Contents                                                                                                                                                                                                                                                                                                                                         |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `@chronogrove/ui`                          | `ChronogroveThemeProvider`                                                                                                                                                                                                                                                                                                                       |
| `@chronogrove/ui/theme`                    | Default Theme UI theme object + named exports                                                                                                                                                                                                                                                                                                    |
| `@chronogrove/ui/provider`                 | `ChronogroveThemeProvider`                                                                                                                                                                                                                                                                                                                       |
| `@chronogrove/ui/color-mode`               | Storage key, reconcile event, SSR inline builders, `chronogroveHeadTheme` (RSC-safe), `resolveChronogroveSurfaceColors`, `useDocumentColorModeSurface`, browser sync, `reconcileThemeUiColorModeOnNavigation`                                                                                                                                    |
| `@chronogrove/ui/animated-page-background` | **`ChronogroveAnimatedPageBackground`** — same stack as the Gatsby home: fixed `z-index: 0`, light = solid theme background, dark = **three.js** Color Bends + scroll-linked gradient overlay and parallax (`three` is a dependency of this package). Animation timing uses **`THREE.Timer`** (not deprecated `Clock`, three.js r183+).          |
| `@chronogrove/ui/color-bends`              | **`ColorBends`** — lower-level three.js gradient background used inside `ChronogroveAnimatedPageBackground`. Prefer the full **`animated-page-background`** or **`@chronogrove/ui/next`** shell unless you need the raw component.                                                                                                               |
| `@chronogrove/ui/next`                     | **Next.js App Router helpers:** `ChronogroveNextRootLayoutHead` (RSC `<head>` injections), `ChronogroveNextEmotionRegistry`, `ChronogroveNextAppShell` (theme + three.js background + surface sync + soft-nav reconcile), `ChronogroveNextThemeUiColorModeRouteSync` (standalone). Requires `next` (peer, optional for the rest of the package). |
| `@chronogrove/ui/action-card-layout`       | **`actionCardPinnedLayoutSx`** — layout `sx` for `Card variant="actionCard"` (matches GitHub pinned cards).                                                                                                                                                                                                                                      |
| `@chronogrove/ui/emotion-cache`            | `createChronogroveEmotionCache`, `getChronogroveEmotionCache`                                                                                                                                                                                                                                                                                    |
| `@chronogrove/ui/button`                   | Theme UI `components` button                                                                                                                                                                                                                                                                                                                     |
| `@chronogrove/ui/color-toggle`             | Theme UI + `@theme-toggles/react` `Expand`                                                                                                                                                                                                                                                                                                       |
| `@chronogrove/ui/color-toggle-styles`      | CSS for the toggle (`Expand.css` + sizing); `@import` once in global CSS (see `examples/chronogrove-next/app/globals.css`)                                                                                                                                                                                                                       |
| `@chronogrove/ui/skip-nav`                 | `SkipNavLink`, `SkipNavContent`                                                                                                                                                                                                                                                                                                                  |
| `@chronogrove/ui/is-dark-mode`             | `colorMode === 'dark'` helper                                                                                                                                                                                                                                                                                                                    |
| `@chronogrove/ui/color-utils`              | `hexToRgb`, `hexToRgba`, `BUTTON_PRIMARY_COLORS`                                                                                                                                                                                                                                                                                                 |
| `@chronogrove/ui/action-button`            | Outline CTA as `<button>` or `<a>`                                                                                                                                                                                                                                                                                                               |
| `@chronogrove/ui/pagination-button`        | Compact paginator control                                                                                                                                                                                                                                                                                                                        |
| `@chronogrove/ui/lazy-load`                | Defer children until in viewport (`react-intersection-observer`)                                                                                                                                                                                                                                                                                 |
| `@chronogrove/ui/header`                   | Masthead shell (`variant: styles.Header`)                                                                                                                                                                                                                                                                                                        |
| `@chronogrove/ui/page-header`              | Blog-style `h1` heading (`p-name`)                                                                                                                                                                                                                                                                                                               |
| `@chronogrove/ui/profile-metrics-badge`    | Metrics row (`Badge variant="metrics"`) for dashboard widget headers                                                                                                                                                                                                                                                                             |
| `@chronogrove/ui/widget-header`            | Widget section title row (optional Font Awesome icon, aside slot, optional metrics)                                                                                                                                                                                                                                                              |
| `@chronogrove/ui/gatsby`                   | Color-mode Gatsby SSR/browser helpers                                                                                                                                                                                                                                                                                                            |

**Additional subpaths:** The table lists the most common entry points. Also published: **`pagination`** (full bar; composes **`pagination-button`**), **`category-label`**, **`metric-badge`**, **`metric-card`**, **`muted-card-footer`**, **`status-card`**, **`widget-section`** (dashboard `<section>`; when **`id`** is passed, **`tabIndex={-1}`** defaults so hosts can **`focus`** the landmark after hash / in-page navigation), **`widget-call-to-action`**, **`external-link-icon`**, **`thumbnail-strip`**, **`image-thumbnails`** (`optimizeSrc` for CDN resizing; Gatsby passes a Cloudinary helper). The authoritative list is **`package.json`** → **`exports`**.

## Next.js (App Router)

**Reference app:** [`examples/chronogrove-next`](../../examples/chronogrove-next) (`chronogrove-next`). Run `pnpm --filter chronogrove-next dev` from the repo root.

**Prefer `@chronogrove/ui/next`** for the standard wiring: `ChronogroveNextRootLayoutHead` in `<head>`, `ChronogroveNextEmotionRegistry` wrapping the body tree, and `ChronogroveNextAppShell` (or compose the lower-level exports yourself).

**Server vs client**

- **Server `layout`:** Keep the root layout a Server Component. **Do not** import `@chronogrove/ui/theme` here—it loads `theme-ui`’s `merge` and triggers React `createContext`, which Next.js disallows in RSC. Use **`ChronogroveNextRootLayoutHead`** from `@chronogrove/ui/next`, or manually pass **`chronogroveHeadTheme`** from `@chronogrove/ui/color-mode` to `resolveChronogroveSurfaceColors` and emit **in order**: `<meta name="emotion-insertion-point" content="" />`, then the Theme UI no-flash script, HTML background script, and fallback CSS (same composition as [`buildThemeUiColorModeHeadComponents`](./src/gatsby/build-theme-ui-color-mode-head-components.js) in `@chronogrove/ui/gatsby`).
- **Client Emotion registry + theme:** Use **`ChronogroveNextEmotionRegistry`** from `@chronogrove/ui/next`, or wrap the app in Emotion’s `CacheProvider` with a **per-request** cache with `key: 'css'` and Next’s `useServerInsertedHTML` ([Next.js: CSS-in-JS](https://nextjs.org/docs/app/building-your-application/styling/css-in-js)). **Do not** rely on `getChronogroveEmotionCache()` for SSR—it is a browser-oriented singleton. Import the **full** theme from `@chronogrove/ui/theme` only inside client components. Anything using `useColorMode`, `useThemeUI`, or `ChronogroveThemeProvider` must be `'use client'`. **Order:** `CacheProvider` (registry) **outside** `ChronogroveThemeProvider` **inside** `<body>`.
- **Document surface (match Gatsby `RootWrapper`):** **`ChronogroveNextAppShell`** calls **`useDocumentColorModeSurface`** from `@chronogrove/ui/color-mode` once. It syncs `document.documentElement`’s `theme-ui-*` class, `data-theme-ui-color-mode`, and inline page background from the **resolved** Theme UI theme (`rawColors` / `colors.background`). Without it, Emotion can win the cascade over head fallback CSS and panel tokens (`bg: 'panel-background'`) may not update in dark mode after hydration.
- **Animated page background (match Gatsby home):** **`ChronogroveNextAppShell`** includes **`ChronogroveAnimatedPageBackground`** (three.js Color Bends). Content should sit in a **`position: relative; z-index: 1`** wrapper above the fixed background layer.
- **`WidgetHeader` + icons:** This package depends on **`@fortawesome/fontawesome-svg-core`** and **`@fortawesome/react-fontawesome`**. Icon **definitions** (e.g. `faGithub`) come from a Font Awesome kit you add to **your** app—typically **`@fortawesome/free-brands-svg-icons`** for brands—the same pattern as **`gatsby-theme-chronogrove`** widgets.
- **`MetricCard` loading state:** Pass **`loading`** or **`showPlaceholder`** (equivalent) for the built-in pulse placeholder (or **`loadingSlot`** to override).
- **Soft navigations:** **`ChronogroveNextAppShell`** includes **`ChronogroveNextThemeUiColorModeRouteSync`**, which calls `reconcileThemeUiColorModeOnNavigation` after pathname changes (not on initial mount). Running reconcile on mount can fight `useColorMode` toggles. Gatsby’s equivalent is `onRouteUpdateThemeUiColorMode` (no initial `onRouteUpdate`).
- **Hydration:** Set `suppressHydrationWarning` on `<html>` and `<body>`. The inline no-flash / background scripts run before React hydrates and update `<html>` (`theme-ui-*` classes, `data-theme-ui-color-mode`, background), so the DOM no longer matches the server-rendered markup—React would warn without this flag (similar to [next-themes](https://github.com/pacocoursey/next-themes) on Next.js App Router).

**Imports:** Prefer `@chronogrove/ui/color-mode` for head builders and SPA reconcile. Reserve `@chronogrove/ui/gatsby` for Gatsby hooks (`onPreRenderHTML`, `onRenderBody` helpers).

**JSX + bundlers:** Primitives such as [`button`](./src/button.js) use [`Box`](https://theme-ui.com/components/box) from `@theme-ui/components` with an `as` prop for native elements, so `sx` works with Gatsby’s classic JSX runtime and Next’s SWC without a Theme UI file pragma. Jest uses [`babel.config.cjs`](./babel.config.cjs) (automatic JSX).

## Global CSS, Prism / third-party CSS, and fonts

Styles load in three layers. Understanding the split prevents accidental duplicates and keeps each host's build minimal.

### Layer order

| #   | Layer                                           | Mechanism                                                                                                                                                                                                               |
| --- | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Head — color-mode + Emotion insertion point** | Gatsby: `theme/gatsby-ssr.js` + `@chronogrove/ui/gatsby` helpers. Next: `ChronogroveNextRootLayoutHead` from `@chronogrove/ui/next`. Emit before any `<style>` tags so Emotion and Theme UI no-flash scripts run first. |
| 2   | **Theme UI globals (`theme.global`)**           | `ChronogroveThemeProvider` renders `<Global styles={theme.global} />` via Emotion. This applies identical baseline CSS under both Gatsby and Next as long as the provider wraps the app. No extra import needed.        |
| 3   | **Host global CSS**                             | Each host owns its plain-CSS files. See below for Gatsby and Next specifics.                                                                                                                                            |

### Gatsby

The theme's own global CSS entry is the side-effect import block in [`theme/gatsby-browser.js`](../../theme/gatsby-browser.js):

```javascript
import './src/styles/global.css' // layout, .sr-only, Prism overrides
import 'lightgallery/css/lightgallery.css'
import 'lightgallery/css/lg-thumbnail.css'
import 'lightgallery/css/lg-zoom.css'
import 'prismjs/themes/prism-solarizedlight.css'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
```

[`theme/src/styles/global.css`](../../theme/src/styles/global.css) also contains `@import '@chronogrove/ui/color-toggle-styles'` for the theme toggle animation.

Prism is **tightly coupled to `gatsby-remark-prismjs`** (configured in [`theme/gatsby-config.js`](../../theme/gatsby-config.js)). The CSS theme and helper overrides (`.gatsby-highlight`, line-number padding, etc.) only make sense when that plugin is active. They are intentionally kept in the Gatsby theme rather than in this package.

Sites that shadow or extend the theme can add additional side-effect imports in their own `gatsby-browser.js` alongside (not instead of) the theme's entry.

### Next.js (App Router)

The reference app is [`examples/chronogrove-next`](../../examples/chronogrove-next). Its [`app/globals.css`](../../examples/chronogrove-next/app/globals.css) shows the minimal baseline:

```css
/* Required if you use ColorToggle */
@import '@chronogrove/ui/color-toggle-styles';

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--theme-ui-colors-background);
  -webkit-font-smoothing: antialiased;
}
```

Import `globals.css` once from the root `layout.jsx`/`layout.tsx` — the same file that renders `ChronogroveNextRootLayoutHead` and `ChronogroveNextEmotionRegistry`. See [`examples/chronogrove-next/app/layout.jsx`](../../examples/chronogrove-next/app/layout.jsx).

For syntax highlighting in a Next MDX pipeline, use whatever highlighter fits your setup (e.g. [Shiki via rehype-pretty-code](https://rehype-pretty.pages.dev/)) and load only its CSS. There is no dependency on `prismjs` in this package, and you should not add the Prism CSS from the Gatsby theme to a Next app unless your MDX pipeline explicitly emits Prism class names.

### Fonts

The default Chronogrove theme uses **system font stacks** only (defined in [`src/theme.js`](./src/theme.js)):

```js
sans: '-apple-system, BlinkMacSystemFont, avenir next, ..., sans-serif'
mono: 'Menlo, Consolas, ..., monospace'
```

No `@font-face` rules or external font URLs are shipped by this package. Web fonts are **host-owned**:

- **Next.js:** use [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to load faces with zero layout shift; then pass the resulting CSS variable or family name into a theme override: `{ fonts: { body: 'var(--font-inter), sans-serif' } }`.
- **Gatsby:** use [`gatsby-plugin-google-gtag`](https://www.gatsbyjs.com/plugins/gatsby-plugin-google-gtag/) or a `<link>` in `gatsby-ssr.js`, then extend `theme.fonts` in your `gatsby-config.js` theme options.

Changing `theme.fonts` is the only hook needed; `ChronogroveThemeProvider` merges the override automatically via Theme UI.

### Font Awesome (icons)

`@chronogrove/ui` depends on `@fortawesome/fontawesome-svg-core` and `@fortawesome/react-fontawesome` for `WidgetHeader`. Icon **definitions** (e.g. `faGithub`) come from a kit you add to your own app — see the `WidgetHeader + icons` bullet in the [Next.js](#nextjs-app-router) section above.

## Changelog

Releases are recorded in the repository root [`CHANGELOG.md`](../../CHANGELOG.md).

## License

MIT (same as the parent repository).
