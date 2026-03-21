# Chronogrove Demo Site

This is the official demo site for `gatsby-theme-chronogrove`. It showcases the theme and doubles as a lightweight development environment when working on the theme package.

## Purpose

This demo site serves a few purposes:

- **Live demo**: Shows the theme's features and design
- **Development environment**: Exercises theme functionality and new features
- **Documentation**: Provides real examples of theme usage
- **Testing**: Confirms the theme works with different content types

## Usage

From the root of the monorepo:

```bash
# Start the demo site for theme development
pnpm develop:theme

# Or run directly from this directory
cd www.chronogrove.com
pnpm develop
```

### Theme switching (dark/light mode)

If dark/light mode does not update correctly after changing the theme, clear the cache and restart:

```bash
cd www.chronogrove.com
pnpm run clean
pnpm develop
# or in one step:
pnpm run develop:clean
```

This site adds a minimal `gatsby-browser.js` that re-exports only the theme's `onRouteUpdate` and `shouldUpdateScroll` hooks, not `wrapRootElement`. That keeps route-based color-mode reconciliation working without duplicating head content or double-wrapping the root.

## Content Structure

- `content/blog/` - Blog posts in MDX format
- `content/music/` - Music posts in MDX format
- `gatsby-config.js` - Site configuration using the theme

## Configuration

The site uses demo data that showcases the theme's capabilities while remaining generic and reusable. All personal details have been replaced with placeholder values.

## Widget Testing

The site includes demo widget configurations that point to mock or demo endpoints. If you want a more realistic demo, you can swap those for real APIs.

## Development Workflow

1. Make changes to the theme in the `theme/` directory
2. Test changes using this example site
3. Once satisfied, test the change against the personal site in `www.chrisvogt.me`
4. Commit and push changes

This setup keeps the theme generic and reusable while still giving you a practical place to develop against.
