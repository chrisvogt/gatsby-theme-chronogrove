const { defaultConfig, mergeConfig } = require('./theme-config')

describe('theme-config', () => {
  describe('defaultConfig', () => {
    it('should have the correct structure', () => {
      expect(defaultConfig).toHaveProperty('siteMetadata')
      expect(defaultConfig).toHaveProperty('navigation')
      expect(defaultConfig).toHaveProperty('widgets')
    })

    it('should have default site metadata', () => {
      expect(defaultConfig.siteMetadata).toEqual({
        title: 'My Personal Website',
        description: 'A personal website and blog',
        siteUrl: 'https://example.com',
        baseURL: 'https://example.com',
        languageCode: 'en',
        headline: 'My Website',
        subhead: 'Personal blog and portfolio',
        avatarURL: '',
        imageURL: '',
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
        social: {
          twitterUsername: ''
        },
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
        footerText: 'Made with ❤️',
        titleTemplate: '%s · My Website',
        webmentionUrl: ''
      })
    })

    it('should have default navigation structure', () => {
      expect(defaultConfig.navigation).toHaveProperty('header')
      expect(defaultConfig.navigation.header).toHaveProperty('left')
      expect(defaultConfig.navigation.header).toHaveProperty('home')
      expect(Array.isArray(defaultConfig.navigation.header.left)).toBe(true)
      expect(Array.isArray(defaultConfig.navigation.header.home)).toBe(true)
    })

    it('should have default navigation items', () => {
      expect(defaultConfig.navigation.header.left).toHaveLength(2)
      expect(defaultConfig.navigation.header.left[0]).toEqual({
        path: '/about',
        slug: 'about',
        text: 'About',
        title: 'About Me'
      })
      expect(defaultConfig.navigation.header.left[1]).toEqual({
        path: '/blog',
        slug: 'blog',
        text: 'Blog',
        title: 'Latest posts from the blog'
      })
    })

    it('should have default home navigation items', () => {
      expect(defaultConfig.navigation.header.home).toHaveLength(2)
      expect(defaultConfig.navigation.header.home[0]).toEqual({
        path: '#github',
        slug: 'github',
        text: 'GitHub',
        title: 'GitHub'
      })
      expect(defaultConfig.navigation.header.home[1]).toEqual({
        path: '#instagram',
        slug: 'instagram',
        text: 'Instagram',
        title: 'Instagram'
      })
    })

    it('should have default widget configuration', () => {
      const expectedWidgets = ['github', 'instagram', 'goodreads', 'spotify', 'steam', 'flickr']
      expectedWidgets.forEach(widget => {
        expect(defaultConfig.widgets).toHaveProperty(widget)
        expect(defaultConfig.widgets[widget]).toEqual({
          username: '',
          widgetDataSource: ''
        })
      })
    })
  })

  describe('mergeConfig', () => {
    it('should return default config when no options provided', () => {
      const result = mergeConfig()
      expect(result).toEqual(defaultConfig)
    })

    it('should return default config when empty options provided', () => {
      const result = mergeConfig({})
      expect(result).toEqual(defaultConfig)
    })

    it('should merge site metadata correctly', () => {
      const themeOptions = {
        siteMetadata: {
          title: 'Custom Title',
          description: 'Custom Description',
          hCard: {
            email: 'custom@example.com',
            givenName: 'Custom'
          }
        }
      }

      const result = mergeConfig(themeOptions)

      expect(result.siteMetadata.title).toBe('Custom Title')
      expect(result.siteMetadata.description).toBe('Custom Description')
      expect(result.siteMetadata.hCard.email).toBe('custom@example.com')
      expect(result.siteMetadata.hCard.givenName).toBe('Custom')
      expect(result.siteMetadata.hCard.familyName).toBe('Name') // Should keep default
      expect(result.siteMetadata.siteUrl).toBe('https://example.com') // Should keep default
    })

    it('should merge navigation correctly', () => {
      const themeOptions = {
        navigation: {
          header: {
            left: [
              {
                path: '/custom',
                slug: 'custom',
                text: 'Custom',
                title: 'Custom Page'
              }
            ],
            home: [
              {
                path: '#custom',
                slug: 'custom',
                text: 'Custom Widget',
                title: 'Custom Widget'
              }
            ]
          }
        }
      }

      const result = mergeConfig(themeOptions)

      expect(result.navigation.header.left).toHaveLength(1)
      expect(result.navigation.header.left[0]).toEqual({
        path: '/custom',
        slug: 'custom',
        text: 'Custom',
        title: 'Custom Page'
      })

      expect(result.navigation.header.home).toHaveLength(1)
      expect(result.navigation.header.home[0]).toEqual({
        path: '#custom',
        slug: 'custom',
        text: 'Custom Widget',
        title: 'Custom Widget'
      })
    })

    it('should merge widgets correctly', () => {
      const themeOptions = {
        widgets: {
          github: {
            username: 'testuser',
            widgetDataSource: 'https://api.example.com/github'
          },
          spotify: {
            username: 'spotifyuser',
            widgetDataSource: 'https://api.example.com/spotify'
          }
        }
      }

      const result = mergeConfig(themeOptions)

      expect(result.widgets.github.username).toBe('testuser')
      expect(result.widgets.github.widgetDataSource).toBe('https://api.example.com/github')
      expect(result.widgets.spotify.username).toBe('spotifyuser')
      expect(result.widgets.spotify.widgetDataSource).toBe('https://api.example.com/spotify')

      // Other widgets should keep defaults
      expect(result.widgets.instagram.username).toBe('')
      expect(result.widgets.instagram.widgetDataSource).toBe('')
    })

    it('should merge all sections together', () => {
      const themeOptions = {
        siteMetadata: {
          title: 'Test Site'
        },
        navigation: {
          header: {
            left: [
              {
                path: '/test',
                slug: 'test',
                text: 'Test',
                title: 'Test'
              }
            ]
          }
        },
        widgets: {
          github: {
            username: 'testuser'
          }
        }
      }

      const result = mergeConfig(themeOptions)

      expect(result.siteMetadata.title).toBe('Test Site')
      expect(result.navigation.header.left).toHaveLength(1)
      expect(result.navigation.header.left[0].path).toBe('/test')
      expect(result.widgets.github.username).toBe('testuser')

      // Should preserve other defaults
      expect(result.siteMetadata.description).toBe('A personal website and blog')
      expect(result.navigation.header.home).toHaveLength(2)
      expect(result.widgets.instagram.username).toBe('')
    })

    it('should handle deep nested objects correctly', () => {
      const themeOptions = {
        siteMetadata: {
          hCard: {
            email: 'deep@example.com'
          }
        }
      }

      const result = mergeConfig(themeOptions)

      expect(result.siteMetadata.hCard.email).toBe('deep@example.com')
      expect(result.siteMetadata.hCard.givenName).toBe('Given') // Should keep default
      expect(result.siteMetadata.hCard.familyName).toBe('Name') // Should keep default
    })
  })
})
