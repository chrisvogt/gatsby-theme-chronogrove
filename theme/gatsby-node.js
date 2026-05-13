const path = require('path')
const startCase = require('lodash/startCase')

/**
 * pnpm can install multiple physical copies of Theme UI (different peer-dependency graphs). React
 * context from `ColorModeProvider` in one `@theme-ui/color-modes` instance is then invisible to
 * `useColorMode` loaded from another — runtime error:
 * "[useColorMode] requires the ColorModeProvider component". Force webpack to resolve `theme-ui`
 * and the core Theme UI packages from the same tree as `ChronogroveThemeProvider` (see
 * `wrapRootElement.js`).
 */
function getThemeUiSingleInstanceAliases() {
  const themeUiPkgDir = path.dirname(require.resolve('theme-ui/package.json', { paths: [__dirname] }))
  const searchPaths = [themeUiPkgDir]
  const pkgs = ['theme-ui', '@theme-ui/color-modes', '@theme-ui/core', '@theme-ui/theme-provider']
  return pkgs.reduce((alias, pkg) => {
    alias[pkg] = path.dirname(require.resolve(`${pkg}/package.json`, { paths: searchPaths }))
    return alias
  }, {})
}

/**
 * Drop Gatsby’s ESLintWebpackPlugin. The workspace hoists ESLint 10, while Gatsby’s default
 * eslint-config-react-app → eslint-plugin-flowtype expects legacy ESLint internals (see
 * https://github.com/gatsbyjs/gatsby/issues/39033). Linting stays on `pnpm lint` at the repo root.
 */
exports.onCreateWebpackConfig = ({ actions, getConfig }) => {
  const config = getConfig()
  if (config.plugins?.length) {
    config.plugins = config.plugins.filter(plugin => !plugin || plugin.constructor.name !== 'ESLintWebpackPlugin')
  }

  const themeUiAliases = getThemeUiSingleInstanceAliases()
  config.resolve = config.resolve || {}
  const prevAlias = config.resolve.alias
  if (Array.isArray(prevAlias)) {
    for (const [name, aliasPath] of Object.entries(themeUiAliases)) {
      prevAlias.push({ name, alias: aliasPath })
    }
  } else {
    config.resolve.alias = {
      ...(typeof prevAlias === 'object' && prevAlias !== null ? prevAlias : {}),
      ...themeUiAliases
    }
  }

  actions.replaceWebpackConfig(config)
}

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
      path: nodePath,
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
      thumbnails: [String]
    }

    type SiteSiteMetadata implements Node {
      navigation: SiteSiteMetadataNavigation
      widgets: SiteSiteMetadataWidgets
      socialProfiles: [SiteSiteMetadataSocialProfile]
    }

    type SiteSiteMetadataNavigation {
      header: SiteSiteMetadataNavigationHeader
      footer: [SiteSiteMetadataNavigationItem]
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
      """If true, render with a plain anchor instead of Gatsby Link (e.g. odd static paths without a known file extension)."""
      nativeAnchor: Boolean
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

    # Stub for consumers (e.g. gatsby-theme-style-guide) that query themeUiConfig.
    # We apply theme in wrapRootElement; this avoids errors when not using gatsby-plugin-theme-ui.
    type ThemeUiConfig implements Node {
      id: ID!
      preset: String
      prismPreset: String
    }
    extend type Query {
      themeUiConfig: ThemeUiConfig
    }
  `

  createTypes(typeDefs)
}

exports.createResolvers = ({ createResolvers }) => {
  createResolvers({
    Query: {
      themeUiConfig: {
        resolve: () => ({ id: 'theme-ui-config-stub', preset: null, prismPreset: null })
      }
    }
  })
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
