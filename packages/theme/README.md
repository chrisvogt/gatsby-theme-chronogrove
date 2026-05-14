# Gatsby Theme Chronogrove

[![CI](https://github.com/chrisvogt/gatsby-theme-chronogrove/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/chrisvogt/gatsby-theme-chronogrove/actions/workflows/ci.yml)
[![CodeQL](https://github.com/chrisvogt/gatsby-theme-chronogrove/actions/workflows/codeql-analysis.yml/badge.svg?branch=main)](https://github.com/chrisvogt/gatsby-theme-chronogrove/actions/workflows/codeql-analysis.yml)
[![Code Coverage](https://codecov.io/gh/chrisvogt/gatsby-theme-chronogrove/branch/main/graph/badge.svg?token=YUksu2c99s)](https://codecov.io/gh/chrisvogt/gatsby-theme-chronogrove)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/chrisvogt/gatsby-theme-chronogrove/blob/main/LICENSE)

A Gatsby theme for personal websites and blogs with built-in social media widgets. It includes a dashboard-style home page that can surface recent activity across multiple platforms.

## ✨ Features

- **Dashboard Home Page**: Social media widgets and recent posts
- **Blog Support**: MDX content with syntax highlighting
- **Dark/Light Mode**: Theme UI with color mode toggle
- **Responsive Design**: Mobile-first responsive layout
- **SEO Optimized**: Structured data and meta tags
- **Performance**: Lazy loading and optimized images
- **Accessibility**: ARIA labels and keyboard navigation
- **Navigation System**: Configurable navigation with GraphQL integration
- **Error Handling**: Robust error handling and fallbacks
- **Testing**: Comprehensive unit tests and coverage reporting

## Requirements

- **Gatsby** `^5.16.0` (peer dependency; use Gatsby 5.16.x in practice)
- **React** and **React DOM** 18 or 19

Shared presentation and color-mode logic also ship in **[`@chronogrove/ui`](../packages/ui/README.md)**. If you are **not** using Gatsby, consume that package directly. A **Next.js App Router** reference app lives under [`examples/chronogrove-next`](../examples/chronogrove-next/README.md) (`pnpm develop:next` from the repo root).

Dashboard widget chrome (**`WidgetHeader`**, **`ProfileMetricsBadge`**, and related primitives) is implemented in **`@chronogrove/ui`** and **re-exported** from this theme under `src/components/` (for example `widgets/widget-header.js`) so Gatsby **shadowing** import paths stay stable.

## 🚀 Quick Start

### Installation

```bash
npm install gatsby-theme-chronogrove
# or
pnpm add gatsby-theme-chronogrove
```

### Basic Configuration

```javascript
// gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-theme-chronogrove',
      options: {
        siteMetadata: {
          title: 'My Personal Website',
          description: 'A personal website and blog',
          headline: 'My Name',
          subhead: 'Personal blog and portfolio'
        }
      }
    }
  ]
}
```

## ⚙️ Configuration

The theme uses a modular configuration system that allows you to customize every aspect of your site through theme options.

### Site Metadata

```javascript
{
  resolve: 'gatsby-theme-chronogrove',
  options: {
    siteMetadata: {
      // Core site information
      title: 'My Personal Website',
      description: 'A personal website and blog',
      siteUrl: 'https://example.com',
      baseURL: 'https://example.com',
      languageCode: 'en',

      // Personal branding
      headline: 'My Name',
      subhead: 'Personal blog and portfolio',
      avatarURL: '/images/avatar.jpg',
      imageURL: '/images/og-image.png',

      // Contact information (hCard microformat)
      hCard: {
        email: 'mail@example.com',
        givenName: 'Given',
        familyName: 'Name',
        locality: 'City',
        region: 'ST',
        countryName: 'Country',
        category: 'Professional Title',
        photoURL: '/images/avatar.jpg'
      },

      // Social media
      social: {
        twitterUsername: '@username'
      },

      // Footer
      footerText: 'Made with ❤️',

      // SEO
      titleTemplate: '%s · My Website'
    }
  }
}
```

### Navigation Configuration

Customize your site's navigation menu:

```javascript
{
  resolve: 'gatsby-theme-chronogrove',
  options: {
    navigation: {
      header: {
        // Main navigation links (top of page)
        left: [
          {
            path: '/about',
            slug: 'about',
            text: 'About',
            title: 'About Me'
          },
          {
            path: '/blog',
            slug: 'blog',
            text: 'Blog',
            title: 'Latest posts from the blog'
          },
          {
            path: '/projects',
            slug: 'projects',
            text: 'Projects',
            title: 'My projects'
          }
        ],
        // Home page navigation (dashboard sections)
        home: [
          {
            path: '#github',
            slug: 'github',
            text: 'GitHub',
            title: 'GitHub Activity'
          },
          {
            path: '#instagram',
            slug: 'instagram',
            text: 'Instagram',
            title: 'Instagram Photos'
          },
          {
            path: '#goodreads',
            slug: 'goodreads',
            text: 'Goodreads',
            title: 'Reading Activity'
          }
        ]
      },
      // Optional footer link row (same item shape as header links). Omitted or [] = no links.
      // Use site-relative paths for internal pages; use https://… in `path` for external links.
      // Paths ending in .xml, .rss, .atom, etc. use a plain <a> (not Gatsby Link) so feeds and
      // other static outputs work with gatsby-plugin-feed. For other static URLs, set nativeAnchor: true.
      footer: [
        {
          path: '/rss.xml',
          slug: 'rss',
          text: 'Subscribe via RSS',
          title: 'RSS feed'
        },
        {
          path: '/privacy',
          slug: 'privacy',
          text: 'Privacy Policy',
          title: 'Privacy Policy'
        }
      ]
    }
  }
}
```

### Widget Configuration

Configure social media widgets for your dashboard:

```javascript
{
  resolve: 'gatsby-theme-chronogrove',
  options: {
    widgets: {
      github: {
        username: 'your-github-username',
        widgetDataSource: 'https://your-api.com/widgets/github'
      },
      instagram: {
        username: 'your-instagram-username',
        widgetDataSource: 'https://your-api.com/widgets/instagram'
      },
      goodreads: {
        username: 'your-goodreads-username',
        widgetDataSource: 'https://your-api.com/widgets/goodreads'
      },
      spotify: {
        username: 'your-spotify-username',
        widgetDataSource: 'https://your-api.com/widgets/spotify'
      },
      steam: {
        username: 'your-steam-username',
        widgetDataSource: 'https://your-api.com/widgets/steam'
      },
      flickr: {
        username: 'your-flickr-username',
        widgetDataSource: 'https://your-api.com/widgets/flickr'
      }
    }
  }
}
```

## 📝 Content

### Blog Posts

Create blog posts using MDX in your `content/blog/` directory:

```mdx
---
title: 'My First Blog Post'
date: '2024-01-01'
category: 'blog'
slug: 'my-first-post'
---

# My First Blog Post

This is my first blog post using Gatsby Theme Chronogrove!

## Features

- **MDX Support**: Write in Markdown with React components
- **Built-in shortcodes**: `Note` (callout panels), `ColorModeImage` (light/dark screenshots), `Emoji`, `YouTube`, `Spotify`, `SoundCloud`
- **Syntax Highlighting**: Code blocks with Prism.js
- **Responsive Images**: Optimized images with Gatsby Image
- **SEO**: Automatic meta tags and structured data
```

### Note Callout

Use the built-in `Note` component for callout panels in blog posts. No import required:

```mdx
<Note variant='info'>
  <strong>Note:</strong> This is an informational aside.
</Note>

<Note variant='update'>
  <strong>Update:</strong> This issue was resolved.
</Note>

<Note variant='outdated'>
  <strong>Note:</strong> These numbers are from 2024.
</Note>
```

Variants: `info` (default), `update` (green checkmark), `outdated` (amber clock).

### Color mode images (`ColorModeImage`)

Use **`ColorModeImage`** when you have separate screenshots or artwork per theme (e.g. product UI in light vs dark mode). No import required.

```mdx
<ColorModeImage
  light='https://res.cloudinary.com/your-cloud/image/upload/v123/light.png'
  dark='https://res.cloudinary.com/your-cloud/image/upload/v124/dark.png'
  alt='Screenshot of the app'
/>
```

- **`optimizeDelivery`** (default **`true`**): For **`*.cloudinary.com`** URLs without existing transformation segments, inserts **`f_auto,q_auto`** after **`/upload/`**. Pass **`optimizeDelivery={false}`** to use URLs verbatim.
- **`loading`**: Defaults to **`lazy`**; override with **`eager`** if needed.

### Music Posts

Create music posts in your `content/music/` directory:

```mdx
---
title: 'My New Song'
date: '2024-01-01'
category: 'music'
slug: 'my-new-song'
---

# My New Song

Listen to my latest track!

<Spotify trackId='4iV5W9uYEdYUVa79Axb7Rh' />
```

## 🎨 Customization

### Styling

The theme uses Theme UI for styling. You can customize the theme by shadowing the theme file:

```javascript
// src/gatsby-theme-chronogrove/gatsby-plugin-theme-ui/index.js
import { theme } from 'gatsby-theme-chronogrove/src/gatsby-plugin-theme-ui'

export default {
  ...theme,
  colors: {
    ...theme.colors,
    primary: '#007acc',
    secondary: '#ff6b6b'
  }
}
```

### Components

Shadow any component by creating a file with the same name in your `src/gatsby-theme-chronogrove/components/` directory:

```javascript
// src/gatsby-theme-chronogrove/components/home-header-content.js
import React from 'react'

export default function HomeHeaderContent() {
  return (
    <div>
      <h1>Custom Header Content</h1>
      <p>This replaces the default header content.</p>
    </div>
  )
}
```

## 🔧 Development

### Local Development

```bash
# Clone the repository
git clone https://github.com/chrisvogt/gatsby-theme-chronogrove.git
cd gatsby-theme-chronogrove

# Install dependencies
pnpm install

# Start the personal site with HTTPS
pnpm develop

# Or start the demo site
pnpm develop:theme
```

### Testing

The theme includes comprehensive testing for components, widgets, selectors, and Gatsby integration points:

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

**Coverage highlights:**

- ✅ Component and widget coverage
- ✅ GraphQL mocking for Gatsby components
- ✅ Navigation component testing
- ✅ Selector and hook coverage

## 📦 Available Widgets

### GitHub Widget

- Profile statistics
- Pinned repositories
- Recent pull requests
- Activity timeline

### Instagram Widget

- Recent photos
- Lightbox gallery
- Engagement metrics
- Profile information

### Goodreads Widget

- Currently reading
- Recently read books
- Reading progress
- Book recommendations

### Spotify Widget

- Top tracks
- Playlists
- Recently played
- Audio previews

### Steam Widget

- Recently played games
- Game statistics
- AI-generated summaries
- Time tracking

### Flickr Widget

- Photo galleries
- Image collections
- Photo metadata
- Lightbox gallery

## 📦 Shared UI package (`@chronogrove/ui`)

This repo ships a workspace package **[`@chronogrove/ui`](../packages/ui/README.md)** alongside the Gatsby theme. It holds:

- The **Theme UI theme** (tokens, variants, modes) consumed via `@chronogrove/ui/theme`
- **`ChronogroveThemeProvider`** — `ThemeUIProvider`, `InitializeColorMode`, and `Global` styles
- **Color-mode utilities** — SSR inline script/style builders tied to `resolveChronogroveSurfaceColors(theme)`, browser reconciliation, and the same storage key / custom event the theme uses on navigation
- **Emotion** `CacheProvider` helpers for the Gatsby browser entry
- **Primitives**: Button, color toggle, skip-nav components, `isDarkMode` helper

The published **theme** package lists `@chronogrove/ui` as a dependency; in the monorepo this resolves with `workspace:*`. **`pnpm publish`** rewrites workspace protocol ranges to semver in the tarball. Consumers of **only** `gatsby-theme-chronogrove` do not need to install `@chronogrove/ui` separately unless they import it directly (for example in a Next.js app reusing the design system).

**three.js:** The theme also declares **`three`** (same version as `@chronogrove/ui`, via the root **pnpm catalog**) because [`book-3d.js`](src/components/artwork/book-3d.js) imports it directly. Workspace packages should not rely on transitive hoisting for bare module resolution in their own sources.

## 🔍 Troubleshooting

### Dark/light mode not updating (workspace or local dependency)

If you use the theme as a **workspace** or **local** dependency and the theme toggle or navigation doesn’t update colors correctly:

1. **Try clearing the cache first:** `gatsby clean` then `gatsby develop`.
2. **If still broken**, add only the theme’s **route hooks** in your site so color-mode reconciles on navigation. Do **not** re-export `wrapRootElement` or add `gatsby-ssr.js`—that duplicates head (scripts, emotion insertion point) and double-wraps the root, which breaks theme switching in production.

**`gatsby-browser.js`** (in your site root):

```javascript
const themeBrowser = require('gatsby-theme-chronogrove/gatsby-browser')
exports.onRouteUpdate = themeBrowser.onRouteUpdate
exports.shouldUpdateScroll = themeBrowser.shouldUpdateScroll
```

**Scroll position:** The theme’s **`shouldUpdateScroll`** always returns **`false`** so **`gatsby-react-router-scroll`** does not replay a saved scroll offset (which could open a new page mid-viewport). **`onRouteUpdate`** scrolls to the top and focuses skip-nav content instead.

See [www.chronogrove.com/gatsby-browser.js](https://github.com/chrisvogt/gatsby-theme-chronogrove/blob/main/websites/www.chronogrove.com/gatsby-browser.js) in the repo for the canonical example.

Global CSS and Prism styles load via the theme's `gatsby-browser.js`. For how the same layer works in Next.js, and for font-loading guidance that applies to both hosts, see **[Global CSS, Prism / third-party CSS, and fonts](../../packages/ui/README.md#global-css-prism--third-party-css-and-fonts)** in `packages/ui/README.md`.

---

## 🤝 Contributing

Pull requests are welcome. See [`../../CONTRIBUTING.md`](../../CONTRIBUTING.md) for the contribution flow, PR title format, and CI expectations.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Gatsby](https://gatsbyjs.com/) - Static site generator
- [Theme UI](https://theme-ui.com/) - Design system
- [MDX](https://mdxjs.com/) - Markdown with JSX
- [FontAwesome](https://fontawesome.com/) - Icons

## 📞 Support

- **Root docs**: [`../README.md`](../README.md)
- **Issues**: [GitHub Issues](https://github.com/chrisvogt/gatsby-theme-chronogrove/issues)
- **Changelog**: [`../CHANGELOG.md`](../CHANGELOG.md)

---

Made with ❤️ by [Chris Vogt](https://www.chrisvogt.me)
