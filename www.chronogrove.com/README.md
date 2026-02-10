# Chronogrove Demo Site

This is the official demo site for `gatsby-theme-chronogrove`, showcasing the theme's capabilities and serving as a development environment.

## Purpose

This demo site serves multiple purposes:

- **Live Demo**: Showcases the theme's features and design
- **Development Environment**: Test theme functionality and new features
- **Documentation**: Provides real examples of theme usage
- **Testing**: Ensures the theme works with different content types

## Usage

From the root of the monorepo:

```bash
# Start the demo site for theme development
yarn develop:theme

# Or run directly from this directory
cd www.chronogrove.com
yarn develop
```

## Content Structure

- `content/blog/` - Blog posts in MDX format
- `content/music/` - Music posts in MDX format
- `gatsby-config.js` - Site configuration using the theme

## Configuration

The site uses demo data that showcases the theme's capabilities while remaining generic and reusable. All personal details have been replaced with placeholder values.

## Widget Testing

The site includes demo widget configurations that point to mock endpoints. You can:

1. Set up real API endpoints for live demos

## Development Workflow

1. Make changes to the theme in the `theme/` directory
2. Test changes using this example site
3. Once satisfied, test with your actual site (`www.chrisvogt.me`)
4. Commit and push changes

This setup ensures your theme remains generic and reusable while providing a proper development environment.
