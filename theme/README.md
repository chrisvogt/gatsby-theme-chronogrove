# Gatsby Theme Chronogrove

[![CI](https://github.com/chrisvogt/gatsby-theme-chronogrove/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/chrisvogt/gatsby-theme-chronogrove/actions/workflows/ci.yml)
[![CodeQL](https://github.com/chrisvogt/gatsby-theme-chronogrove/actions/workflows/codeql-analysis.yml/badge.svg?branch=main)](https://github.com/chrisvogt/gatsby-theme-chronogrove/actions/workflows/codeql-analysis.yml)
[![Code Coverage](https://codecov.io/gh/chrisvogt/gatsby-theme-chronogrove/branch/main/graph/badge.svg?token=YUksu2c99s)](https://codecov.io/gh/chrisvogt/gatsby-theme-chronogrove)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/chrisvogt/gatsby-theme-chronogrove/blob/main/LICENSE)

A beautiful Gatsby theme for personal websites and blogs with built-in social media widgets. Features a dashboard-style home page that showcases your recent activity across multiple platforms.

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
- **Testing**: Comprehensive test suite with 459 passing tests

## 🚀 Quick Start

### Installation

```bash
npm install gatsby-theme-chronogrove
# or
yarn add gatsby-theme-chronogrove
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
      }
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
- **Syntax Highlighting**: Code blocks with Prism.js
- **Responsive Images**: Optimized images with Gatsby Image
- **SEO**: Automatic meta tags and structured data
```

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
yarn install

# Start development server
yarn workspace www.chrisvogt.me develop
```

### Testing

The theme includes comprehensive testing with **459 passing tests**:

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Generate coverage report
yarn test:coverage
```

**Test Coverage:**

- ✅ 79 test suites passing
- ✅ 459 individual tests passing
- ✅ 69 snapshot tests
- ✅ GraphQL mocking for Gatsby components
- ✅ Navigation component testing
- ✅ Widget component testing

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

## 🔧 Recent Improvements (v0.51.0)

### Bug Fixes

- **Fixed failing unit tests**: Resolved GraphQL errors in test environment
- **Fixed navigation data handling**: Updated `useNavigationData` hook to return empty object when navigation data is missing
- **Improved test reliability**: Added proper mocking for Gatsby's `useStaticQuery` and `graphql` in component tests

### Technical Improvements

- Enhanced test coverage for navigation components
- Improved error handling in navigation data hooks
- Better separation of concerns between theme and site-specific configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Gatsby](https://gatsbyjs.com/) - Static site generator
- [Theme UI](https://theme-ui.com/) - Design system
- [MDX](https://mdxjs.com/) - Markdown with JSX
- [FontAwesome](https://fontawesome.com/) - Icons

## 📞 Support

- **Documentation**: [GitHub Wiki](https://github.com/chrisvogt/gatsby-theme-chronogrove/wiki)
- **Issues**: [GitHub Issues](https://github.com/chrisvogt/gatsby-theme-chronogrove/issues)
- **Discussions**: [GitHub Discussions](https://github.com/chrisvogt/gatsby-theme-chronogrove/discussions)
- **Changelog**: [CHANGELOG.md](../CHANGELOG.md) - Complete version history

---

Made with ❤️ by [Chris Vogt](https://www.chrisvogt.me)

**Current Version**: v0.51.0
