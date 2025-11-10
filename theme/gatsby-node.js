const path = require('path')
const startCase = require('lodash/startCase')

const getNodePath = node => {
  let nodePath = '/'

  const category = node.fields.category
  if (category) {
    nodePath += `${category}/`
  }

  const slug = node.frontmatter.slug
  if (slug) {
    nodePath += slug
  }

  return nodePath
}

exports.createPages = async ({ actions, graphql, reporter }) => {
  actions.createPage({
    component: path.resolve('../theme/src/templates/home.js'),
    path: '/'
  })

  const result = await graphql(`
    {
      allMdx {
        edges {
          node {
            id
            fields {
              category
              slug
              type
            }
            frontmatter {
              slug
            }
            internal {
              contentFilePath
            }
          }
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panic('error loading content', result.errors)
    return
  }

  result.data.allMdx.edges.forEach(({ node }) => {
    const nodePath = getNodePath(node)
    const template =
      node.fields.type === 'media'
        ? path.resolve('../theme/src/templates/media.js')
        : path.resolve('../theme/src/templates/post.js')

    actions.createPage({
      path: nodePath ? nodePath : '/',
      component: `${template}?__contentFilePath=${node.internal.contentFilePath}`,
      context: {
        id: node.id
      }
    })
  })
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  // Define custom types for siteMetadata and MDX frontmatter
  const typeDefs = `
    type MdxFrontmatter {
      excerpt: String
    }

    type SiteSiteMetadata implements Node {
      navigation: SiteSiteMetadataNavigation
      widgets: SiteSiteMetadataWidgets
      socialProfiles: [SiteSiteMetadataSocialProfile]
    }

    type SiteSiteMetadataNavigation {
      header: SiteSiteMetadataNavigationHeader
    }

    type SiteSiteMetadataNavigationHeader {
      left: [SiteSiteMetadataNavigationItem]
      home: [SiteSiteMetadataNavigationItem]
    }

    type SiteSiteMetadataNavigationItem {
      path: String!
      slug: String!
      text: String!
      title: String!
    }

    type SiteSiteMetadataWidgets {
      github: SiteSiteMetadataWidgetConfig
      instagram: SiteSiteMetadataWidgetConfig
      goodreads: SiteSiteMetadataWidgetConfig
      spotify: SiteSiteMetadataWidgetConfig
      steam: SiteSiteMetadataWidgetConfig
      flickr: SiteSiteMetadataWidgetConfig
      discogs: SiteSiteMetadataWidgetConfig
    }

    type SiteSiteMetadataWidgetConfig {
      username: String
      widgetDataSource: String
    }

    type SiteSiteMetadataHCard {
      email: String
      givenName: String
      familyName: String
      locality: String
      region: String
      countryName: String
      category: String
      photoURL: String
    }

    type SiteSiteMetadataSocialProfile {
      displayName: String!
      slug: String!
      href: String!
      icon: SiteSiteMetadataSocialProfileIcon!
    }

    type SiteSiteMetadataSocialProfileIcon {
      class: String!
      name: String!
      reactIcon: String!
      set: String!
    }
  `

  createTypes(typeDefs)
}

exports.onCreateNode = ({ node, getNode, actions, reporter }) => {
  const { createNodeField } = actions

  if (node.internal.type === 'Mdx') {
    const parent = getNode(node.parent)
    const title = node.frontmatter.title || startCase(parent.name)

    let slug = node.frontmatter.slug
    if (!slug) {
      reporter.panic(
        `Can not create node with title: ${title} there is no relative path or frontmatter to set the "slug" field`
      )
      return
    }

    if (slug === 'index') {
      slug = ''
    }

    const category = node.frontmatter.category
    if (category) {
      createNodeField({
        name: 'category',
        node,
        value: category
      })
    }

    const type = node.frontmatter.type
    if (type) {
      createNodeField({
        name: 'type',
        node,
        value: type
      })
    }

    createNodeField({
      name: 'slug',
      node,
      value: slug
    })

    createNodeField({
      name: 'id',
      node,
      value: node.id
    })

    if (node.internal.type === 'Mdx') {
      createNodeField({
        name: 'path',
        node,
        value: getNodePath(node)
      })
    }

    createNodeField({
      name: 'title',
      node,
      value: title
    })
  }
}
