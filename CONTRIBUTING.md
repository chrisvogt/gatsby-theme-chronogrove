# Contributing

Thanks for taking a look at this project.

If you found a bug, want to improve the theme, or just want to clean up something small, pull requests are welcome. This repo powers my personal site, but I’m actively trying to make the theme cleaner, more reusable, and easier for other people to work with too.

For local setup and development commands, start with the `README.md`.

## Opening A Pull Request

The basic flow is simple:

1. Fork the repo and create a branch for your change.
2. Make the smallest reasonable change that solves the problem.
3. Run the checks that make sense locally before you open the PR.
4. Open a pull request with a clear description of what changed and why.

If your change affects the UI, screenshots are always appreciated. If it changes behavior, a short note about how you tested it helps a lot.

## Before You Open It

Please run the usual checks locally when you can:

```bash
pnpm lint
pnpm test
pnpm test:coverage
```

If you change something that could affect the site build, running `pnpm build` is helpful too.

## Accessibility Smoke Testing

For **keyboard** behavior, Chrome on macOS does **not** provide a built‑in “jump to navigation landmark” shortcut; use **Tab** / **Shift+Tab** for sequential focus, and exercise **VoiceOver** (⌃⌥ U rotor → **Landmarks**) to mimic how many screen‑reader users reach **`<nav aria-label="…">`** regions.

Changes that alter **skip links**, **in‑page anchors**, or **`scrollIntoView` / `focus`** on the home template should extend the relevant **`*.spec.js`** files (for example **`scroll-to-element-when-ready`**, **`scroll-to-hash-when-ready`**, **`home-navigation`**) so coverage stays aligned with WCAG‑oriented focus management.

## PR Titles

Use Conventional Commits for the pull request title.

Examples:

- `feat(theme): add configurable social links`
- `fix(spotify): guard against empty playlists`
- `docs: simplify contributing guide`

This repo uses squash merges only, so the PR title becomes the single commit that lands on `main`.

## CI And Maintainer Approval

GitHub Actions runs the usual project checks here, including linting, unit tests, coverage, and build checks. This repo also has deploy workflows, but those are maintainer-managed and not something outside contributors need to worry about.

If your PR comes from a fork, it is normal for some checks to wait on maintainer approval before they run. That is mostly a safety measure so strangers on the internet cannot freely burn privileged runners or access anything sensitive.

## A Few Small Requests

- Keep changes focused. Small PRs are much easier to review.
- Add or update tests when behavior changes.
- Update docs when the developer experience changes.
- Be kind in issues and reviews. Life is hard enough already.

## `@chronogrove/ui`: Gatsby shims versus direct imports

Shared presentation lives in **`packages/ui`** (`@chronogrove/ui`). The Gatsby theme (**`packages/theme`**, published as **`gatsby-theme-chronogrove`**) often exposes it through **thin files** that only re-export that package—for example `packages/theme/src/components/button.js` → `@chronogrove/ui/button`.

**Why:** [Gatsby theme shadowing](https://www.gatsbyjs.com/docs/how-to/plugins-and-themes/theme-shadowing/) lets a consumer site override theme files by matching paths under the installed theme. Imports that go through those shim paths keep overrides predictable.

**When you change or add UI:**

- **Portable components and tokens** — implement in **`packages/ui`**, extend **`package.json` `exports`**, and add tests there. In **`packages/theme`**, wire a **one-line re-export** at the usual import path when other theme code (or shadowing) expects it.
- **Next.js reference app** (`examples/chronogrove-next`) — import **`@chronogrove/ui/...`** subpaths directly; there is no Gatsby shadow layer.
- **Avoid** copying the same markup into **`packages/theme`** when it could live in **`packages/ui`** (unless it is truly Gatsby-specific).

## Questions

If you are not sure whether a change is a good fit, open an issue or draft PR and ask. I would much rather have an early conversation than have you waste time building the wrong thing.
