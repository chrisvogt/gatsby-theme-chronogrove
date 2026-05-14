const buildFeedItemUrl = (baseUrl, category, slug) => {
  const parsedCategory = category ? `/${category}/` : '/'
  return `${baseUrl}${parsedCategory}${slug}`
}

module.exports = {
  resolve: 'gatsby-plugin-feed',
  options: {
    query: `
      {
        site {
          siteMetadata {
            baseURL
            description
            title
          }
        }
      }
    `,
    feeds: [
      {
        serialize: ({ query: { site, allMdx } }) => {
          return allMdx.edges.map(edge => {
            const hasImage = Boolean(edge.node.frontmatter.banner)
            return Object.assign({}, edge.node.frontmatter, {
              category: edge.node.fields.category,
              date: edge.node.frontmatter.date,
              description: edge.node.excerpt,
              feed_url: site.siteMetadata.baseUrl + '/rss.xml',
              guid: buildFeedItemUrl(site.siteMetadata.baseURL, edge.node.fields.category, edge.node.fields.slug),
              ...(hasImage ? { image: edge.node.frontmatter.banner } : {}),
              url: buildFeedItemUrl(site.siteMetadata.baseURL, edge.node.fields.category, edge.node.fields.slug)
            })
          })
        },
        query: `{
          allMdx(sort: {frontmatter: {date: DESC}}) {
            edges {
              node {
                excerpt
                fields {
                  category
                  slug
                }
                frontmatter {
                  banner
                  date
                  title
                }
              }
            }
          }
        }`,
        output: '/rss.xml',
        generator: 'Gatsby 5',
        title: 'Chris Vogt – Blog',
        feed_url: 'https://www.chrisvogt.me',
        site_url: 'https://www.chrisvogt.me',
        docs: 'https://www.chrisvogt.me'
      }
    ]
  }
}
