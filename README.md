# Gatsby Theme Chronogrove

[![Netlify Status](https://api.netlify.com/api/v1/badges/29f330b8-22bf-4f7f-a0f0-240476512db0/deploy-status)](https://app.netlify.com/sites/chrisvogt/deploys)
[![CI](https://github.com/chrisvogt/gatsby-theme-chronogrove/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/chrisvogt/gatsby-theme-chronogrove/actions/workflows/ci.yml)
[![CodeQL](https://github.com/chrisvogt/gatsby-theme-chronogrove/actions/workflows/codeql-analysis.yml/badge.svg?branch=main)](https://github.com/chrisvogt/gatsby-theme-chronogrove/actions/workflows/codeql-analysis.yml)
[![Code Coverage](https://codecov.io/gh/chrisvogt/gatsby-theme-chronogrove/branch/main/graph/badge.svg?token=YUksu2c99s)](https://codecov.io/gh/chrisvogt/gatsby-theme-chronogrove)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/chrisvogt/gatsby-theme-chronogrove/blob/main/LICENSE)
[![BlueSky](https://img.shields.io/badge/BlueSky-@chrisvogt.me-blue?logo=bluesky&logoColor=white)](https://bsky.app/profile/chrisvogt.me)

A modern Gatsby theme for personal websites and blogs with social media integration. It powers [www.chrisvogt.me](https://www.chrisvogt.me) and includes a demo site, reusable theme package, and content examples.

> **TypeScript roadmap:** The monorepo is heading toward **incremental TypeScript adoption** (a full package rewrite in one step has been painful here, so we are not doing that again in one leap). Until files are ported, please **add or update [`prop-types`](https://github.com/facebook/prop-types)** on React components you **create** or **meaningfully change**—especially under **`packages/theme/src`**, where `react/prop-types` is enabled (see root **`eslint.config.js`**). Documenting props now makes it much easier to replace `propTypes` with TypeScript types **file by file** later.

## 🚀 Features

- **Social Dashboard Homepage**: Display recent activity from multiple social platforms
- **Blog System**: Full-featured blog with MDX support (built-in shortcodes such as `Note`, `ColorModeImage`, and embeds—see theme README)
- **Widget System**: Pre-built widgets for GitHub, Instagram, Spotify, Goodreads, and Steam
- **Responsive Design**: Mobile-first design with dark/light mode support
- **Performance Optimized**: Built with Gatsby for fast loading and SEO
- **Testing**: Comprehensive unit tests and coverage reporting
- **Navigation System**: Configurable navigation with proper GraphQL integration
- **Error Handling**: Robust error handling and fallbacks throughout the theme

## 📋 Prerequisites

- **Node.js**: >= 24.0.0
- **pnpm**: >= 10.0.0
- **Git**: For version control

> **Migrating from Yarn?** Remove `node_modules` and `yarn.lock`, then run `pnpm install`. The repo uses pnpm workspaces and Turborepo; all `yarn` commands are now `pnpm` (e.g. `pnpm develop`, `pnpm test`).

## 🏗️ Project Structure

This is a monorepo using pnpm workspaces and Turborepo:

```
gatsby-theme-chronogrove/
├── packages/
│   ├── ui/                   # @chronogrove/ui — Theme UI theme, color-mode, shared primitives
│   │   ├── src/
│   │   └── package.json
│   └── theme/                # gatsby-theme-chronogrove (Gatsby theme package)
│       ├── src/
│       │   ├── components/   # React components
│       │   ├── widgets/      # Social media widgets
│       │   ├── templates/    # Page templates
│       │   └── ...
│       ├── scripts/          # Theme-local tooling (e.g. postinstall banner)
│       └── package.json
├── websites/
│   ├── www.chronogrove.com/  # Official demo site
│   │   ├── content/          # Demo blog posts and content
│   │   ├── gatsby-config.js
│   │   └── package.json
│   └── www.chrisvogt.me/     # Personal website implementation
│       ├── content/          # Blog posts and content
│       ├── src/pages/        # Custom pages
│       ├── gatsby-config.js
│       └── package.json
├── examples/
│   └── chronogrove-next/     # Next.js 16 App Router reference (optional; not the main Gatsby site)
│       ├── app/
│       └── package.json
└── package.json              # Root workspace config
```

> **Dependency overrides**: The root `package.json` uses pnpm overrides for security patches. See [docs/dependency-overrides.md](docs/dependency-overrides.md) for rationale.

## ⚡ Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/chrisvogt/gatsby-theme-chronogrove.git
   cd gatsby-theme-chronogrove
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **HTTPS Development Setup**

   **For local HTTPS development, you'll need SSL certificates:**
   - Install mkcert (if not already installed):

     ```bash
     # macOS
     brew install mkcert

     # Linux
     sudo apt install mkcert
     ```

   - Generate certificates:

     ```bash
     mkcert www.dev-chrisvogt.me
     ```

   - Move certificates to the certs directory:

     ```bash
     mkdir -p websites/www.chrisvogt.me/certs
     mv www.dev-chrisvogt.me-key.pem websites/www.chrisvogt.me/certs/
     mv www.dev-chrisvogt.me.pem websites/www.chrisvogt.me/certs/
     ```

4. **If you do not plan to use Google Analytics, remove or comment out the analytics plugin block in `websites/www.chrisvogt.me/gatsby-config.js`:**

   ```
   {
      resolve: 'gatsby-plugin-google-gtag',
      options: {
        trackingIds: [process.env.GA_MEASUREMENT_ID],
        gtagConfig: {},
        pluginConfig: {
          respectDNT: true
        }
      }
    },

   ```

5. **Start development server**

   ```bash
   pnpm develop
   ```

6. **Open your browser**
   Navigate to [https://www.dev-chrisvogt.me:8000](https://www.dev-chrisvogt.me:8000)

## 🛠️ Development

### Available Scripts

| Command              | Description                                               |
| -------------------- | --------------------------------------------------------- |
| `pnpm develop`       | Start personal site (www.chrisvogt.me)                    |
| `pnpm develop:theme` | Start demo site (www.chronogrove.com)                     |
| `pnpm develop:next`  | Start Next.js reference app (`examples/chronogrove-next`) |
| `pnpm test`          | Run test suite                                            |
| `pnpm test:watch`    | Run tests in watch mode                                   |
| `pnpm test:coverage` | Generate coverage report                                  |
| `pnpm build`         | Build for production                                      |
| `pnpm format`        | Format code with Prettier                                 |
| `pnpm lint`          | Run ESLint                                                |

### Development Workflow

#### Working on the Theme

The theme code lives in **`packages/theme`** (`gatsby-theme-chronogrove`). Shared **Theme UI** surface (theme object, color-mode helpers, `ChronogroveThemeProvider`, Button, skip-nav, color toggle) lives in **`packages/ui`** (`@chronogrove/ui`). To work on theme components:

1. Start the demo site: `pnpm develop:theme`
2. Make your changes in `packages/theme/src/components/` and/or `packages/ui/src/` as appropriate
3. The changes will be reflected in the demo site at `http://localhost:8000`

Run UI package tests only: `pnpm --filter @chronogrove/ui test`

#### Working on Content

**Demo Site Content** (`websites/www.chronogrove.com/`):

- **Blog posts**: `websites/www.chronogrove.com/content/blog/`
- **Music posts**: `websites/www.chronogrove.com/content/music/`
- **Site configuration**: `websites/www.chronogrove.com/gatsby-config.js`

**Personal Site Content** (`websites/www.chrisvogt.me/`):

- **Blog posts**: `websites/www.chrisvogt.me/content/blog/`
- **Custom pages**: `websites/www.chrisvogt.me/src/pages/`
- **Site configuration**: `websites/www.chrisvogt.me/gatsby-config.js`

4. **Start HTTPS development**:
   ```bash
   pnpm develop
   ```

### Demo Site Development

For theme development and testing, use the demo site:

```bash
# Start the demo site
pnpm develop:theme

# Open your browser to http://localhost:8000
```

## 🎨 Widgets

The theme includes several pre-built widgets for social media integration:

### Available Widgets

- **📝 Recent Posts**: Display latest blog posts
- **🐙 GitHub**: Show profile stats, pinned repos, and recent PRs
- **📸 Instagram**: Display recent photos with lightbox gallery
- **📚 Goodreads**: Show reading progress and recent books
- **🎵 Spotify**: Display playlists and top tracks
- **🎮 Steam**: Show gaming activity and owned games

### Widget Configuration

Widgets require data sources. Configure them in your `gatsby-config.js`:

```javascript
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-theme-chronogrove',
      options: {
        widgets: {
          github: {
            widgetDataSource: 'https://your-github-api.com'
          },
          instagram: {
            widgetDataSource: 'https://your-instagram-api.com'
          }
          // ... other widgets
        }
      }
    }
  ]
}
```

See the [mock data examples](packages/theme/__mocks__/) for expected API response formats.

## 🧪 Testing

The project includes comprehensive testing for theme components, widgets, selectors, and build-critical behavior:

- **Unit Tests**: Jest + React Testing Library
- **Snapshot Tests**: Component regression coverage
- **Coverage Reports**: Code coverage tracking
- **GraphQL Mocking**: Proper mocking for Gatsby's `useStaticQuery` and `graphql`
- **Navigation Testing**: Comprehensive tests for navigation components and hooks

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

## 🚀 Production Build

### Building for Production

**Personal Site:**

```bash
pnpm --filter www.chrisvogt.me build
```

**Demo Site:**

```bash
pnpm --filter www.chronogrove.com build
```

**Next.js reference app** (optional):

```bash
pnpm --filter chronogrove-next build
```

The Gatsby build outputs are `websites/www.chrisvogt.me/public` and `websites/www.chronogrove.com/public` (relative to the repo root). The Next example writes to `examples/chronogrove-next/.next` (gitignored).

**Netlify / static hosts:** If the site root is the monorepo, set **publish directory** to `websites/www.chrisvogt.me/public` (or `public` when **base directory** is `websites/www.chrisvogt.me`).

### Testing Production Build

To test the production build locally:

```bash
# Install http-server globally
npm install -g http-server

# Serve the build with HTTPS (use the same cert/key filenames as in develop:https)
http-server -o -S -C websites/www.chrisvogt.me/certs/www.dev-chrisvogt.me.pem -K websites/www.chrisvogt.me/certs/www.dev-chrisvogt.me-key.pem -a www.dev-chrisvogt.me -p 443
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for the pull request process, PR title format, and CI expectations.

## 📚 Documentation

- **[`@chronogrove/ui`](packages/ui/README.md)**: Shared Theme UI layer, color-mode helpers, Gatsby helpers (`@chronogrove/ui/gatsby`), and **Next.js App Router** helpers (`@chronogrove/ui/next`)
- **[Next.js example](examples/chronogrove-next/README.md)**: App Router reference (`chronogrove-next`): `@chronogrove/ui/next` shell plus [`home-showcase.jsx`](examples/chronogrove-next/app/home-showcase.jsx) demonstrating the same `@chronogrove/ui` primitives as the Gatsby theme (widgets, layout, controls)
- **[Theme Documentation](packages/theme/README.md)**: Detailed theme configuration and customization
- **[Demo Site Documentation](websites/www.chronogrove.com/README.md)**: Demo site setup and usage
- **[Widget Documentation](packages/theme/src/components/widgets/)**: Individual widget documentation
- **[API Examples](packages/theme/__mocks__/)**: Mock data examples for widget APIs

## 🐛 Troubleshooting

### Common Issues

**Port 8000 already in use**

```bash
# Kill the process using port 8000
lsof -ti:8000 | xargs kill
```

**Demo site not loading**

- Ensure you're using `pnpm develop:theme` for the demo site
- Check that the workspace is properly configured
- Verify all dependencies are installed: `pnpm install`

**SSL certificate errors**

- Ensure certificates are in the correct location: `websites/www.chrisvogt.me/certs/`
- Verify certificate names match expected format
- Check that mkcert is properly installed

**Widget data not loading**

- Verify API endpoints are accessible
- Check network requests in browser dev tools
- Review mock data examples for correct format

## 📄 License

Copyright © 2019 [Chris Vogt](https://www.chrisvogt.me). Released under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Gatsby](https://www.gatsbyjs.com/)
- Styled with [Theme UI](https://theme-ui.com/)
- Icons from [Font Awesome](https://fontawesome.com/)
- Testing with [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/)

---

**Questions?** Open an [issue](https://github.com/chrisvogt/gatsby-theme-chronogrove/issues) or reach out on [Bluesky](https://bsky.app/profile/chrisvogt.me).
