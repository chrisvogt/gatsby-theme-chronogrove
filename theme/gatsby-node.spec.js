const path = require('path')

// Mock Gatsby actions
const mockActions = {
  createPage: jest.fn(),
  createTypes: jest.fn()
}

// Mock Gatsby reporter
const mockReporter = {
  panic: jest.fn()
}

// Mock GraphQL result
const mockGraphQLResult = {
  data: {
    allMdx: {
      edges: [
        {
          node: {
            id: 'test-1',
            fields: {
              category: 'blog',
              slug: 'test-post',
              type: 'post'
            },
            frontmatter: {
              slug: 'test-post'
            },
            internal: {
              contentFilePath: '/content/blog/test-post.mdx'
            }
          }
        },
        {
          node: {
            id: 'test-2',
            fields: {
              category: 'music',
              slug: 'test-song',
              type: 'media'
            },
            frontmatter: {
              slug: 'test-song'
            },
            internal: {
              contentFilePath: '/content/music/test-song.mdx'
            }
          }
        }
      ]
    }
  }
}

// Mock GraphQL function
const mockGraphQL = jest.fn().mockResolvedValue(mockGraphQLResult)

// Mock getNode function
const mockGetNode = jest.fn()

// Import the functions to test
const gatsbyNode = require('./gatsby-node')

describe('gatsby-node', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createSchemaCustomization', () => {
    it('should call createTypes with the correct schema definitions', () => {
      gatsbyNode.createSchemaCustomization({ actions: mockActions })

      expect(mockActions.createTypes).toHaveBeenCalledTimes(1)

      const typeDefs = mockActions.createTypes.mock.calls[0][0]

      // Check that the schema includes all expected types
      expect(typeDefs).toContain('type SiteSiteMetadata implements Node')
      expect(typeDefs).toContain('type SiteSiteMetadataNavigation')
      expect(typeDefs).toContain('type SiteSiteMetadataNavigationHeader')
      expect(typeDefs).toContain('type SiteSiteMetadataNavigationItem')
      expect(typeDefs).toContain('type SiteSiteMetadataWidgets')
      expect(typeDefs).toContain('type SiteSiteMetadataWidgetConfig')
      expect(typeDefs).toContain('type SiteSiteMetadataHCard')

      // Check that navigation item has required fields
      expect(typeDefs).toContain('path: String!')
      expect(typeDefs).toContain('slug: String!')
      expect(typeDefs).toContain('text: String!')
      expect(typeDefs).toContain('title: String!')

      // Check that widget config has optional fields
      expect(typeDefs).toContain('username: String')
      expect(typeDefs).toContain('widgetDataSource: String')

      // Check that hCard has all expected fields
      expect(typeDefs).toContain('email: String')
      expect(typeDefs).toContain('givenName: String')
      expect(typeDefs).toContain('familyName: String')
      expect(typeDefs).toContain('locality: String')
      expect(typeDefs).toContain('region: String')
      expect(typeDefs).toContain('countryName: String')
      expect(typeDefs).toContain('category: String')
      expect(typeDefs).toContain('photoURL: String')

      // Check that widgets includes all expected widget types
      expect(typeDefs).toContain('github: SiteSiteMetadataWidgetConfig')
      expect(typeDefs).toContain('instagram: SiteSiteMetadataWidgetConfig')
      expect(typeDefs).toContain('goodreads: SiteSiteMetadataWidgetConfig')
      expect(typeDefs).toContain('spotify: SiteSiteMetadataWidgetConfig')
      expect(typeDefs).toContain('steam: SiteSiteMetadataWidgetConfig')
      expect(typeDefs).toContain('flickr: SiteSiteMetadataWidgetConfig')
    })

    it('should handle actions parameter correctly', () => {
      const customActions = {
        createTypes: jest.fn()
      }

      gatsbyNode.createSchemaCustomization({ actions: customActions })

      expect(customActions.createTypes).toHaveBeenCalledTimes(1)
    })
  })

  describe('createPages', () => {
    it('should create home page and content pages', async () => {
      await gatsbyNode.createPages({
        actions: mockActions,
        graphql: mockGraphQL,
        reporter: mockReporter
      })

      // Should create home page
      expect(mockActions.createPage).toHaveBeenCalledWith({
        component: path.resolve('../theme/src/templates/home.js'),
        path: '/'
      })

      // Should create pages for each MDX node
      expect(mockActions.createPage).toHaveBeenCalledWith({
        path: '/blog/test-post',
        component: expect.stringContaining('post.js'),
        context: {
          id: 'test-1'
        }
      })

      expect(mockActions.createPage).toHaveBeenCalledWith({
        path: '/music/test-song',
        component: expect.stringContaining('media.js'),
        context: {
          id: 'test-2'
        }
      })

      expect(mockActions.createPage).toHaveBeenCalledTimes(3) // home + 2 content pages
    })

    it('should handle GraphQL errors', async () => {
      const errorResult = {
        errors: ['GraphQL error']
      }
      mockGraphQL.mockResolvedValueOnce(errorResult)

      await gatsbyNode.createPages({
        actions: mockActions,
        graphql: mockGraphQL,
        reporter: mockReporter
      })

      expect(mockReporter.panic).toHaveBeenCalledWith('error loading content', ['GraphQL error'])
      expect(mockActions.createPage).toHaveBeenCalledTimes(1) // Only home page
    })
  })

  describe('onCreateNode', () => {
    const mockCreateNodeField = jest.fn()

    beforeEach(() => {
      mockCreateNodeField.mockClear()
    })

    it('should create fields for MDX nodes', () => {
      const node = {
        id: 'test-node',
        internal: {
          type: 'Mdx'
        },
        frontmatter: {
          title: 'Test Title',
          slug: 'test-slug',
          category: 'blog',
          type: 'post'
        },
        fields: {}
      }

      const parent = {
        name: 'test-file'
      }

      mockGetNode.mockReturnValue(parent)

      gatsbyNode.onCreateNode({
        node,
        getNode: mockGetNode,
        actions: { createNodeField: mockCreateNodeField },
        reporter: mockReporter
      })

      const expectedCalls = [
        { name: 'category', node, value: 'blog' },
        { name: 'type', node, value: 'post' },
        { name: 'slug', node, value: 'test-slug' },
        { name: 'id', node, value: 'test-node' },
        { name: 'title', node, value: 'Test Title' },
        { name: 'path', node, value: '/test-slug' }
      ]
      expect(mockCreateNodeField.mock.calls.map(args => args[0])).toEqual(expect.arrayContaining(expectedCalls))
    })

    it('should handle missing slug with panic', () => {
      const node = {
        id: 'test-node',
        internal: {
          type: 'Mdx'
        },
        frontmatter: {
          title: 'Test Title'
          // No slug
        }
      }

      const parent = {
        name: 'test-file'
      }

      mockGetNode.mockReturnValue(parent)

      gatsbyNode.onCreateNode({
        node,
        getNode: mockGetNode,
        actions: { createNodeField: mockCreateNodeField },
        reporter: mockReporter
      })

      expect(mockReporter.panic).toHaveBeenCalledWith(
        'Can not create node with title: Test Title there is no relative path or frontmatter to set the "slug" field'
      )
    })

    it('should handle index slug correctly', () => {
      const node = {
        id: 'test-node',
        internal: {
          type: 'Mdx'
        },
        frontmatter: {
          title: 'Test Title',
          slug: 'index'
        },
        fields: {}
      }

      const parent = {
        name: 'test-file'
      }

      mockGetNode.mockReturnValue(parent)

      gatsbyNode.onCreateNode({
        node,
        getNode: mockGetNode,
        actions: { createNodeField: mockCreateNodeField },
        reporter: mockReporter
      })

      expect(mockCreateNodeField).toHaveBeenCalledWith({
        name: 'slug',
        node,
        value: ''
      })
    })

    it('should not process non-MDX nodes', () => {
      const node = {
        id: 'test-node',
        internal: {
          type: 'File'
        }
      }

      gatsbyNode.onCreateNode({
        node,
        getNode: mockGetNode,
        actions: { createNodeField: mockCreateNodeField },
        reporter: mockReporter
      })

      expect(mockCreateNodeField).not.toHaveBeenCalled()
    })
  })
})
