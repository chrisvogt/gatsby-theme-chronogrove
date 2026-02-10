const path = require('path')

module.exports = {
  siteMetadata: {
    avatarURL: 'https://via.placeholder.com/150',
    baseURL: 'https://www.chronogrove.com',
    description:
      'Official demo site for gatsby-theme-chronogrove - A beautiful Gatsby theme for personal websites and blogs',
    footerText: 'Made with ❤️ using gatsby-theme-chronogrove',
    headline: 'Chronogrove',
    hCard: {
      email: 'hello@chronogrove.com',
      givenName: 'Chronogrove',
      locality: 'San Francisco',
      region: 'CA',
      countryName: 'USA',
      category: 'Gatsby Theme',
      photoURL: 'https://via.placeholder.com/150'
    },
    imageURL: '',
    languageCode: 'en',
    siteUrl: 'https://www.chronogrove.com',
    social: {
      twitterUsername: 'chronogrove'
    },
    subhead: 'Official demo site for gatsby-theme-chronogrove',
    title: 'Chronogrove',
    titleTemplate: '%s · Chronogrove, a GatsbyJS blog theme for digital gardens and creators',
    webmentionUrl: 'https://webmention.io/www.chronogrove.com/webmention'
  },
  plugins: [
    {
      resolve: 'gatsby-theme-chronogrove',
      options: {
        siteMetadata: {
          title: 'Chronogrove',
          description:
            'Official demo site for gatsby-theme-chronogrove - A beautiful Gatsby theme for personal websites and blogs',
          headline: 'Chronogrove',
          subhead: 'Official demo site for gatsby-theme-chronogrove',
          avatarURL: 'https://via.placeholder.com/150',
          hCard: {
            email: 'hello@chronogrove.com',
            givenName: 'Chronogrove',
            locality: 'San Francisco',
            region: 'CA',
            countryName: 'USA',
            category: 'Gatsby Theme',
            photoURL: 'https://via.placeholder.com/150'
          },
          social: {
            twitterUsername: 'chronogrove'
          },
          footerText: 'Made with ❤️ using gatsby-theme-chronogrove',
          titleTemplate: '%s · A GatsbyJS Theme for Personal Websites',
          socialProfiles: [
            {
              displayName: 'Twitter',
              slug: 'twitter',
              href: 'https://twitter.com/chronogrove',
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
              href: 'https://instagram.com/chronogrove',
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
              href: 'https://linkedin.com/in/cjvogt',
              icon: {
                class: 'fab fa-linkedin',
                name: 'linkedin',
                reactIcon: 'faLinkedin',
                set: 'fab'
              }
            }
          ]
        },
        navigation: {
          header: {
            left: [
              {
                path: '/about',
                slug: 'about',
                text: 'About',
                title: 'About'
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
                path: '#instagram',
                slug: 'instagram',
                text: 'Instagram',
                title: 'Instagram'
              },
              {
                path: '#github',
                slug: 'github',
                text: 'GitHub',
                title: 'GitHub'
              }
            ]
          }
        },
        widgets: {
          github: {
            username: 'chrisvogt',
            widgetDataSource: 'https://api.chronogrove.com/api/widgets/github?timestamp=1752551337'
          },
          instagram: {
            username: 'chronogrove',
            widgetDataSource: 'https://api.chronogrove.com/api/widgets/instagram?timestamp=1752551337'
          }
        }
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: path.join(__dirname, 'content'),
        name: 'content'
      }
    }
  ]
}
