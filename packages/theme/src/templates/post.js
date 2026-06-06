/** @jsx jsx */
import { Container, jsx } from 'theme-ui'
import PropTypes from 'prop-types'
import { Themed } from '@theme-ui/mdx'
import { graphql } from 'gatsby'

import Category from '../components/category'
import { articleColumnContainerSx } from '../constants/article-column-container-sx'
import Layout from '../components/layout'
import PageHeader from '../components/blog/page-header'
import Seo from '../components/seo'
import useSiteMetadata from '../hooks/use-site-metadata'

const PostTemplate = ({ children, data }) => {
  const { mdx } = data
  const { siteUrl = '', baseURL = '' } = useSiteMetadata()

  const category = mdx.fields.category
  const date = mdx.frontmatter.date
  const title = mdx.frontmatter.title
  const description = mdx.frontmatter.description
  const banner = mdx.frontmatter.banner
  const keywords = mdx.frontmatter.keywords
  const path = mdx.fields.path

  // Build canonical URL from site metadata
  const canonicalUrl = `${baseURL || siteUrl || ''}${path}`

  return (
    <Layout>
      <Themed.div sx={{ py: 3 }}>
        <Container sx={articleColumnContainerSx}>
          <article className='h-entry c1v0-blog-post' id={mdx.id}>
            {category && <Category type={category} sx={{ mb: 2 }} />}

            <PageHeader>{title}</PageHeader>

            <Themed.div
              sx={{
                color: 'textMuted',
                fontFamily: 'sans',
                fontSize: 1
              }}
            >
              <time className='dt-published created'>Published {date}</time>
            </Themed.div>

            {/* Hidden microformats data */}
            <div style={{ display: 'none' }}>
              <a className='u-url' href={canonicalUrl} />
              <span className='u-uid'>{mdx.id}</span>
              {description && <div className='p-summary'>{description}</div>}
              {banner && <img className='u-photo' src={banner} alt='' />}
              {category && <span className='p-category'>{category}</span>}
              {keywords &&
                keywords.map((keyword, index) => (
                  <span key={index} className='p-category'>
                    {keyword}
                  </span>
                ))}
            </div>

            <div className='e-content article-content'>{children}</div>
          </article>
        </Container>
      </Themed.div>
    </Layout>
  )
}

const mdxHeadPropType = PropTypes.shape({
  id: PropTypes.string,
  fields: PropTypes.shape({
    category: PropTypes.string,
    path: PropTypes.string
  }),
  frontmatter: PropTypes.shape({
    banner: PropTypes.string,
    date: PropTypes.string,
    description: PropTypes.string,
    title: PropTypes.string,
    keywords: PropTypes.arrayOf(PropTypes.string)
  })
}).isRequired

PostTemplate.propTypes = {
  children: PropTypes.node.isRequired,
  data: PropTypes.shape({
    mdx: mdxHeadPropType
  }).isRequired
}

/* eslint-disable react/prop-types -- Gatsby's Head API export cannot have propTypes attached
   post-declaration in the MDX eval context; props are validated via the GraphQL query shape. */
function Head({ data }) {
  const { mdx } = data
  const banner = mdx.frontmatter.banner
  const description = mdx.frontmatter.description
  const title = mdx.frontmatter.title
  const category = mdx.fields.category

  // Format category for display (capitalize first letter)
  const categoryDisplay = category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Blog'

  // Breadcrumb structured data for SEO
  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.chrisvogt.me'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: categoryDisplay,
        item: `https://www.chrisvogt.me/${category || 'blog'}`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: title
      }
    ]
  }

  return (
    <Seo article={true} canonicalPath={mdx.fields.path} description={description} image={banner} title={title}>
      <script type='application/ld+json'>{JSON.stringify(breadcrumbData)}</script>
    </Seo>
  )
}

/* eslint-enable react/prop-types */
export { Head }

export const pageQuery = graphql`
  query ($id: String!) {
    mdx(fields: { id: { eq: $id } }) {
      body
      id
      fields {
        category
        path
      }
      frontmatter {
        banner
        date(formatString: "MMMM DD, YYYY")
        description
        keywords
        title
      }
    }
  }
`

export default PostTemplate
