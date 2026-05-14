# Dependency Overrides

This document explains why `pnpm` overrides are defined in the root `package.json`. Since JSON cannot contain comments, this file acts as the source of truth for future maintainers.

When upstream dependencies catch up, these overrides can be removed. Periodically run `gh api repos/chrisvogt/gatsby-theme-chronogrove/dependabot/alerts` to check whether the related alerts have been resolved.

**Gatsby and shared semver pins** (not overrides) live in [`pnpm-workspace.yaml`](../pnpm-workspace.yaml) under `catalog:`; workspace packages reference them with `"catalog:"` in `package.json`. The published theme still documents supported ranges in [`packages/theme/package.json`](../packages/theme/package.json) `peerDependencies`.

## Security Fixes (Dependabot High/Critical)

| Package                                    | Version           | Reason                                                                                                                                                                                                                                                           |
| ------------------------------------------ | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| flatted                                    | ^3.4.2            | Prototype pollution. Transitive via eslint → file-entry-cache → flat-cache.                                                                                                                                                                                      |
| socket.io-parser                           | ^4.2.6            | ReDoS / denial of service. Transitive via socket.io stack.                                                                                                                                                                                                       |
| immutable                                  | ^3.8.3            | Prototype pollution. Transitive via various Gatsby dependencies.                                                                                                                                                                                                 |
| multer                                     | ^2.1.1            | Path traversal. Transitive via express/gatsby.                                                                                                                                                                                                                   |
| svgo                                       | ^2.8.1            | XML external entity (XXE) injection. Transitive via postcss-svgo.                                                                                                                                                                                                |
| serialize-javascript                       | >=7.0.3           | XSS via unsanitized output. Transitive dependency.                                                                                                                                                                                                               |
| minimatch (gatsby-plugin-google-analytics) | ^3.1.4            | ReDoS. Override via parent package.                                                                                                                                                                                                                              |
| minimatch (gatsby-plugin-sitemap)          | ^3.1.4            | ReDoS. Override via parent package.                                                                                                                                                                                                                              |
| path-to-regexp                             | `>=0.1.13 <0.2.0` | ReDoS (e.g. [CVE-2026-4867](https://github.com/pillarjs/path-to-regexp/security/advisories/GHSA-37ch-88jc-xwx2)). Transitive via express (Gatsby dev server). Stays on the 0.1.x line Express 4 expects; remove when upstream resolves 0.1.13+ without override. |

## Compatibility & Pinning

| Package       | Version  | Reason                                                      |
| ------------- | -------- | ----------------------------------------------------------- |
| lodash        | ^4.17.23 | Prototype pollution fix; ensures no vulnerable 4.x is used. |
| @mdx-js/react | ^3.1.1   | MDX 3 compatibility across theme and content packages.      |

## Adding New Overrides

1. Add the override to `package.json` under `pnpm.overrides`.
2. Run `pnpm install --no-frozen-lockfile` to regenerate the lockfile.
3. Add an entry to this document with the package, version, and reason.
4. Link to the Dependabot alert or CVE if applicable.
