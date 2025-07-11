const path = require('path')

module.exports = () => ({
  siteMetadata: {
    avatarURL: 'https://res.cloudinary.com/chrisvogt/image/upload/f_auto/v1573025803/avatar_2x_srlojo',
    baseURL: 'https://www.chrisvogt.me',
    description: 'My personal website. A GatsbyJS blog with built-in Instagram, Goodreads, GitHub and Spotify widgets.',
    footerText: 'Made with ❤️ in San Francisco',
    headline: 'www.chrisvogt.me',
    imageURL: '',
    languageCode: 'en',
    siteUrl: 'https://www.chrisvogt.me',
    social: {
      twitterUsername: ''
    },
    subhead: 'My personal blog and website',
    title: 'My Personal Website',
    titleTemplate: '%s · www.chrisvogt.me',
    widgets: {
      flickr: {
        username: '',
        widgetDataSource: ''
      },
      github: {
        username: '',
        widgetDataSource: ''
      },
      goodreads: {
        username: '',
        widgetDataSource: ''
      },
      instagram: {
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
      }
    }
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        gatsbyRemarkPlugins: [
          'gatsby-remark-prismjs',
          'gatsby-remark-images',
          'gatsby-remark-embed-video',
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-autolink-headers'
        ]
      }
    },
    {
      resolve: 'gatsby-plugin-page-creator',
      options: {
        path: path.join(__dirname, 'src/pages')
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: path.join(__dirname, 'src/data')
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: 'content',
        name: 'content'
      }
    },
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    'gatsby-plugin-emotion',
    'gatsby-theme-style-guide',
    'gatsby-transformer-json',
    'gatsby-plugin-theme-ui'
  ]
})
