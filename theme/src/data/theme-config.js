/**
 * Default theme configuration
 * This can be overridden by theme options in gatsby-config.js
 */

const { mergeWith } = require('lodash')

const defaultConfig = {
  // Core site metadata
  siteMetadata: {
    title: 'My Personal Website',
    description: 'A personal website and blog',
    siteUrl: 'https://example.com',
    baseURL: 'https://example.com',
    languageCode: 'en',

    // Personal information
    headline: 'My Website',
    subhead: 'Personal blog and portfolio',
    avatarURL: '',
    imageURL: '',

    // Contact information
    hCard: {
      email: 'mail@example.com',
      givenName: 'Given',
      familyName: 'Name',
      locality: 'City',
      region: 'ST',
      countryName: 'Country',
      category: 'Professional Title',
      photoURL: ''
    },

    // Social media
    social: {
      twitterUsername: ''
    },

    // Social profiles for footer
    socialProfiles: [
      {
        displayName: 'GitHub',
        slug: 'github',
        href: 'https://github.com/username',
        icon: {
          class: 'fab fa-github',
          name: 'github',
          reactIcon: 'faGithub',
          set: 'fab'
        }
      },
      {
        displayName: 'Twitter',
        slug: 'twitter',
        href: 'https://twitter.com/username',
        icon: {
          class: 'fab fa-x-twitter',
          name: 'twitter',
          reactIcon: 'faXTwitter',
          set: 'fab'
        }
      },
      {
        displayName: 'Instagram',
        slug: 'instagram',
        href: 'https://instagram.com/username',
        icon: {
          class: 'fab fa-instagram',
          name: 'instagram',
          reactIcon: 'faInstagram',
          set: 'fab'
        }
      },
      {
        displayName: 'LinkedIn',
        slug: 'linkedin',
        href: 'https://linkedin.com/in/username',
        icon: {
          class: 'fab fa-linkedin',
          name: 'linkedin',
          reactIcon: 'faLinkedin',
          set: 'fab'
        }
      }
    ],

    // Footer
    footerText: 'Made with ❤️',

    // SEO
    titleTemplate: '%s · My Website',

    // Webmention endpoint
    webmentionUrl: ''
  },

  // Navigation configuration
  navigation: {
    header: {
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
        }
      ],
      home: [
        {
          path: '#github',
          slug: 'github',
          text: 'GitHub',
          title: 'GitHub'
        },
        {
          path: '#instagram',
          slug: 'instagram',
          text: 'Instagram',
          title: 'Instagram'
        }
      ]
    }
  },

  // Widget configuration
  widgets: {
    github: {
      username: '',
      widgetDataSource: ''
    },
    instagram: {
      username: '',
      widgetDataSource: ''
    },
    goodreads: {
      username: '',
      widgetDataSource: ''
    },
    spotify: {
      username: '',
      widgetDataSource: ''
    },
    steam: {
      username: '',
      widgetDataSource: ''
    },
    flickr: {
      username: '',
      widgetDataSource: ''
    }
  }
}

/**
 * Merge theme options with defaults
 * @param {Object} themeOptions - Options passed from gatsby-config.js
 * @returns {Object} Merged configuration
 */
const mergeConfig = (themeOptions = {}) => {
  // Use mergeWith with customizer to replace arrays instead of merging by index
  return mergeWith({}, defaultConfig, themeOptions, (objValue, srcValue) => {
    // If both values are arrays, replace the target array with the source array
    if (Array.isArray(objValue) && Array.isArray(srcValue)) {
      return srcValue
    }
    // For all other cases, use the default merge behavior
    return undefined
  })
}

module.exports = {
  defaultConfig,
  mergeConfig
}
