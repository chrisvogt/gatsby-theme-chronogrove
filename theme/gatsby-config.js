/**
 * Gatsby Theme Chronogrove - Configuration File
 *
 * This file serves as the main configuration for the Gatsby Theme Chronogrove.
 * It demonstrates how to set up a Gatsby theme with comprehensive features
 * including MDX support, image optimization, social media widgets, and more.
 *
 * USAGE:
 * This file is used internally by the theme. For your own site, you would
 * configure the theme in your site's gatsby-config.js like this:
 *
 * ```javascript
 * module.exports = {
 *   plugins: [
 *     {
 *       resolve: 'gatsby-theme-chronogrove',
 *       options: {
 *         siteMetadata: {
 *           title: 'My Personal Website',
 *           description: 'A personal website and blog',
 *           // ... other metadata
 *         },
 *         widgets: {
 *           discogs: { widgetDataSource: 'https://api.example.com/discogs' },
 *           github: { widgetDataSource: 'https://api.example.com/github' },
 *           // ... other widgets
 *         }
 *       }
 *     }
 *   ]
 * }
 * ```
 */

// Import required Node.js modules
const path = require('path')

// Import the theme configuration merger utility
// This handles merging default theme options with user-provided options
const { mergeConfig } = require('./src/data/theme-config')

// Only include development-only plugins when not in production
const isDevelopment = process.env.NODE_ENV !== 'production'

/**
 * Main theme configuration function
 *
 * This function is called by Gatsby with the theme options provided by the user.
 * It merges the user's configuration with the theme's defaults and returns
 * a complete Gatsby configuration object.
 *
 * @param {Object} themeOptions - User-provided theme options
 * @param {Object} themeOptions.siteMetadata - Site metadata configuration
 * @param {Object} themeOptions.widgets - Widget configuration
 * @param {Object} themeOptions.navigation - Navigation configuration
 * @returns {Object} Complete Gatsby configuration object
 */
module.exports = (themeOptions = {}) => {
  // Merge user options with theme defaults
  // This ensures all required configuration is present with sensible defaults
  const config = mergeConfig(themeOptions)

  // Return the complete Gatsby configuration
  return {
    /**
     * Site Metadata Configuration
     *
     * This section defines the core metadata for your site, including:
     * - Basic site information (title, description, URL)
     * - Personal information for hCard microformat
     * - Social media profiles
     * - Navigation structure
     * - Widget configuration
     *
     * This metadata is available throughout your site via GraphQL queries
     * and is used for SEO, social sharing, and site functionality.
     */
    siteMetadata: {
      // Spread the merged site metadata (includes user-provided + defaults)
      ...config.siteMetadata,

      // Navigation configuration for site menus and home page sections
      // This includes header navigation and home page widget sections
      navigation: config.navigation,

      // Widget configuration for social media integration
      // Defines which widgets are enabled and their data sources
      widgets: config.widgets
    },

    /**
     * Gatsby Plugins Configuration
     *
     * This array defines all the Gatsby plugins used by the theme.
     * Each plugin adds specific functionality to your site.
     */
    plugins: [
      /**
       * MDX Plugin Configuration
       *
       * Enables MDX (Markdown + JSX) support for content authoring.
       * This allows you to write content in Markdown with embedded React components.
       *
       * Features:
       * - Write blog posts in MDX
       * - Embed React components in content
       * - Use custom shortcodes (Spotify, YouTube, etc.)
       * - Syntax highlighting for code blocks
       */
      {
        resolve: 'gatsby-plugin-mdx',
        options: {
          // Gatsby Remark plugins for MDX processing
          gatsbyRemarkPlugins: [
            // Syntax highlighting for code blocks using Prism.js
            'gatsby-remark-prismjs',

            // Optimize images in MDX content with responsive sizes
            'gatsby-remark-images',

            // Embed videos from YouTube, Vimeo, etc.
            'gatsby-remark-embed-video',

            // Copy linked files to public directory
            'gatsby-remark-copy-linked-files',

            // Add anchor links to headings for easy navigation
            'gatsby-remark-autolink-headers'
          ]
        }
      },

      /**
       * Page Creator Plugin
       *
       * Automatically creates pages from files in the theme's src/pages directory.
       * This enables the theme to provide default pages like 404, home, etc.
       *
       * Users can shadow these pages by creating files with the same name
       * in their site's src/pages directory.
       */
      {
        resolve: 'gatsby-plugin-page-creator',
        options: {
          // Path to the theme's pages directory
          path: path.join(__dirname, 'src/pages')
        }
      },

      /**
       * File System Source - Theme Data
       *
       * Makes theme data files available to GraphQL.
       * This includes theme configuration, social profiles, and other
       * theme-specific data that doesn't change between sites.
       */
      {
        resolve: 'gatsby-source-filesystem',
        options: {
          // Path to theme data files
          path: path.join(__dirname, 'src/data')
        }
      },

      /**
       * File System Source - Content
       *
       * Makes user content files available to GraphQL.
       * This includes blog posts, music posts, and other content
       * that users create in their content directory.
       *
       * The 'content' name makes this data available in GraphQL
       * under the 'content' node type.
       */
      {
        resolve: 'gatsby-source-filesystem',
        options: {
          // Path to user content (relative to user's site root)
          path: 'content',
          // GraphQL node name for this content
          name: 'content'
        }
      },

      /**
       * Sharp Plugin
       *
       * Provides image processing capabilities using the Sharp library.
       * Enables responsive images, image optimization, and various
       * image transformations.
       *
       * Features:
       * - Automatic image optimization
       * - Responsive image generation
       * - WebP format support
       * - Image resizing and cropping
       */
      'gatsby-plugin-sharp',

      /**
       * Sharp Transformer
       *
       * Transforms image files into optimized formats and provides
       * GraphQL fields for accessing image data.
       *
       * This works with gatsby-plugin-sharp to provide the
       * gatsbyImageData GraphQL field for optimized images.
       */
      'gatsby-transformer-sharp',

      /**
       * Emotion Plugin
       *
       * Enables CSS-in-JS styling with Emotion.
       * This is used by Theme UI for the design system and
       * allows for dynamic styling based on theme configuration.
       *
       * Features:
       * - CSS-in-JS styling
       * - Dynamic theme switching
       * - Server-side rendering support
       */
      'gatsby-plugin-emotion',

      /**
       * Style Guide Plugin (Development Only)
       *
       * Provides a development style guide page for Theme UI.
       * This is useful during development to see all available
       * theme components and design tokens.
       *
       * Accessible at /___style-guide during development.
       *
       * Note: Only included in development to avoid loading Google Fonts
       * (Roboto) in production, which improves Lighthouse performance scores.
       */
      ...(isDevelopment ? ['gatsby-theme-style-guide'] : []),

      /**
       * JSON Transformer
       *
       * Transforms JSON files into GraphQL nodes.
       * This allows you to query JSON data files in your GraphQL
       * queries and use them in your components.
       *
       * Used for configuration files, mock data, and other JSON content.
       */
      'gatsby-transformer-json',

      /**
       * Theme UI Plugin
       *
       * Integrates Theme UI with Gatsby for the design system.
       * Provides theme context, color mode support, and design tokens
       * throughout your site.
       *
       * Features:
       * - Design system integration
       * - Dark/light mode support
       * - Theme customization
       * - Responsive design tokens
       */
      'gatsby-plugin-theme-ui'
    ]
  }
}
