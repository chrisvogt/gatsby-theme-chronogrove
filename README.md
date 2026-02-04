# Gatsby Theme Chronogrove

[![Netlify Status](https://api.netlify.com/api/v1/badges/29f330b8-22bf-4f7f-a0f0-240476512db0/deploy-status)](https://app.netlify.com/sites/chrisvogt/deploys)
[![CI](https://github.com/chrisvogt/gatsby-theme-chronogrove/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/chrisvogt/gatsby-theme-chronogrove/actions/workflows/ci.yml)
[![CodeQL](https://github.com/chrisvogt/gatsby-theme-chronogrove/actions/workflows/codeql-analysis.yml/badge.svg?branch=main)](https://github.com/chrisvogt/gatsby-theme-chronogrove/actions/workflows/codeql-analysis.yml)
[![Code Coverage](https://codecov.io/gh/chrisvogt/gatsby-theme-chronogrove/branch/main/graph/badge.svg?token=YUksu2c99s)](https://codecov.io/gh/chrisvogt/gatsby-theme-chronogrove)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/chrisvogt/gatsby-theme-chronogrove/blob/main/LICENSE)
[![BlueSky](https://img.shields.io/badge/BlueSky-@chrisvogt.me-blue?logo=bluesky&logoColor=white)](https://bsky.app/profile/chrisvogt.me)

A modern, feature-rich Gatsby theme for personal websites and blogs with social media integration. This theme powers [www.chrisvogt.me](https://www.chrisvogt.me) and provides a comprehensive solution for developers looking to build their own personal website.

## 🚀 Features

- **Social Dashboard Homepage**: Display recent activity from multiple social platforms
- **Blog System**: Full-featured blog with MDX support
- **Widget System**: Pre-built widgets for GitHub, Instagram, Spotify, Goodreads, and Steam
- **Responsive Design**: Mobile-first design with dark/light mode support
- **Performance Optimized**: Built with Gatsby for fast loading and SEO
- **Testing**: Comprehensive test suite with 459 passing tests
- **Navigation System**: Configurable navigation with proper GraphQL integration
- **Error Handling**: Robust error handling and fallbacks throughout the theme

## 📋 Prerequisites

- **Node.js**: >= 20.0.0
- **Yarn**: >= 4.0.0
- **Git**: For version control

## 🏗️ Project Structure

This is a monorepo using Yarn workspaces:

```
gatsby-theme-chronogrove/
├── theme/                    # Gatsby theme package
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── widgets/          # Social media widgets
│   │   ├── templates/        # Page templates
│   │   └── ...
│   └── package.json
├── www.chronogrove.com/      # Official demo site
│   ├── content/              # Demo blog posts and content
│   ├── gatsby-config.js      # Demo site configuration
│   └── package.json
├── www.chrisvogt.me/         # Personal website implementation
│   ├── content/              # Blog posts and content
│   ├── src/pages/            # Custom pages
│   └── gatsby-config.js      # Site configuration
└── package.json              # Root workspace config
```

## ⚡ Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/chrisvogt/gatsby-theme-chronogrove.git
   cd gatsby-theme-chronogrove
   ```

2. **Install dependencies**

   ```bash
   yarn
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
     mkdir -p www.chrisvogt.me/certs
     mv www.dev-chrisvogt.me-key.pem www.chrisvogt.me/certs/
     mv www.dev-chrisvogt.me.pem www.chrisvogt.me/certs/
     ```

4. **If you don’t have a Google Analytics tracking ID or don’t plan to use it, remove or comment out these lines in `gatsby-config.js`:**

   ```
   {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: process.env.GA_PROPERTY_ID,
        head: false,
        respectDNT: true
      }
    },

   ```

5. **Start development server**

   ```bash
   yarn develop
   ```

6. **Open your browser**
   Navigate to [https://www.dev-chrisvogt.me:8000](https://www.dev-chrisvogt.me:8000)

## 🛠️ Development

### Available Scripts

| Command              | Description                            |
| -------------------- | -------------------------------------- |
| `yarn develop`       | Start personal site (www.chrisvogt.me) |
| `yarn develop:theme` | Start demo site (www.chronogrove.com)  |
| `yarn test`          | Run test suite                         |
| `yarn test:watch`    | Run tests in watch mode                |
| `yarn test:coverage` | Generate coverage report               |
| `yarn build`         | Build for production                   |
| `yarn format`        | Format code with Prettier              |
| `yarn lint`          | Run ESLint                             |

### Development Workflow

#### Working on the Theme

The theme code is located in the `/theme` directory. To work on theme components:

1. Start the demo site: `yarn develop:theme`
2. Make your changes to components in `theme/src/components/`
3. The changes will be reflected in the demo site at `http://localhost:8000`

#### Working on Content

**Demo Site Content** (`/www.chronogrove.com`):

- **Blog posts**: `www.chronogrove.com/content/blog/`
- **Music posts**: `www.chronogrove.com/content/music/`
- **Site configuration**: `www.chronogrove.com/gatsby-config.js`

**Personal Site Content** (`/www.chrisvogt.me`):

- **Blog posts**: `www.chrisvogt.me/content/blog/`
- **Custom pages**: `www.chrisvogt.me/src/pages/`
- **Site configuration**: `www.chrisvogt.me/gatsby-config.js`

4. **Start HTTPS development**:
   ```bash
   yarn develop
   ```

### Demo Site Development

For theme development and testing, use the demo site:

```bash
# Start the demo site
yarn develop:theme

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

See the [mock data examples](theme/__mocks__/) for expected API response formats.

## 🧪 Testing

The project includes comprehensive testing with **459 passing tests**:

- **Unit Tests**: Jest + React Testing Library
- **Snapshot Tests**: Component regression testing (69 snapshots)
- **Coverage Reports**: Code coverage tracking
- **GraphQL Mocking**: Proper mocking for Gatsby's `useStaticQuery` and `graphql`
- **Navigation Testing**: Comprehensive tests for navigation components and hooks

### Running Tests

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Generate coverage report
yarn test:coverage
```

## 🚀 Production Build

### Building for Production

**Personal Site:**

```bash
yarn workspace www.chrisvogt.me build
```

**Demo Site:**

```bash
yarn workspace www.chronogrove.com build
```

The build outputs will be in `/www.chrisvogt.me/public` and `/www.chronogrove.com/public` respectively.

### Testing Production Build

To test the production build locally:

```bash
# Install http-server globally
npm install -g http-server

# Serve the build with HTTPS
http-server -o -S -C ../certs/www.chrisvogt.me.pem -K ../certs/www.chrisvogt.me-key.pem -a www.chrisvogt.me -p 443
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup for Contributors

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `yarn test`
5. Run `yarn prettier --write ..` to automatically fix formatting issues
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

## 📚 Documentation

- **[Theme Documentation](theme/README.md)**: Detailed theme configuration and customization
- **[Demo Site Documentation](www.chronogrove.com/README.md)**: Demo site setup and usage
- **[Widget Documentation](theme/src/components/widgets/)**: Individual widget documentation
- **[API Examples](theme/__mocks__/)**: Mock data examples for widget APIs

## 🐛 Troubleshooting

### Common Issues

**Port 8000 already in use**

```bash
# Kill the process using port 8000
lsof -ti:8000 | xargs kill -9
```

**Demo site not loading**

- Ensure you're using `yarn develop:theme` for the demo site
- Check that the workspace is properly configured
- Verify all dependencies are installed: `yarn install`

**SSL certificate errors**

- Ensure certificates are in the correct location: `www.chrisvogt.me/certs/`
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
