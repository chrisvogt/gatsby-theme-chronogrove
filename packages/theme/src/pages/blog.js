/** @jsx jsx */
import { Container, jsx, Box } from 'theme-ui'
import { Themed } from '@theme-ui/mdx'
import { Flex } from '@theme-ui/components'
import { graphql } from 'gatsby'

import {
  CategoryIndexHeroChrome,
  categoryIndexEmptyStateBoxSx,
  categoryIndexMainColumnFlexSx,
  categoryIndexPostListSectionSx
} from '../components/category-index-layout'
import { articleColumnContainerSx } from '../constants/article-column-container-sx'
import { getPosts } from '../hooks/use-recent-posts'
import { getCategoryGroup } from '../helpers/categoryHelpers'
import Layout from '../components/layout'
import PageHeader from '../components/blog/page-header'
import PostTimelineIndex from '../components/blog/post-timeline-index'
import { DEFAULT_BLOG_INDEX_LEAD } from '../constants/category-index-leads'
import useSiteMetadata from '../hooks/use-site-metadata'

/** Posts for /blog/: newest first, excluding music / photography / travel (dedicated indexes). */
const getBlogIndexPosts = allPosts =>
  allPosts.filter(post => {
    const group = getCategoryGroup(post.fields.category, post.frontmatter.title)
    return group !== 'music' && group !== 'photography' && group !== 'travel'
  })

const BlogIndexPage = ({ data }) => {
  const allPosts = getPosts(data)
  const posts = getBlogIndexPosts(allPosts)
  const { blogIndexLead } = useSiteMetadata() || {}
  const trimmedLead = typeof blogIndexLead === 'string' ? blogIndexLead.trim() : ''
  const lead = trimmedLead.length > 0 ? trimmedLead : DEFAULT_BLOG_INDEX_LEAD

  return (
    <CategoryIndexHeroChrome>
      <Layout transparentBackground>
        <Flex sx={categoryIndexMainColumnFlexSx}>
          <Container sx={{ ...articleColumnContainerSx, flexGrow: 1 }}>
            <PageHeader>Blog</PageHeader>

            <Themed.p>{lead}</Themed.p>

            {posts.length > 0 ? (
              <Box as='section' aria-label='Blog posts' sx={categoryIndexPostListSectionSx}>
                <PostTimelineIndex posts={posts} />
              </Box>
            ) : (
              <Box sx={categoryIndexEmptyStateBoxSx}>
                <Themed.p sx={{ fontSize: 3, color: 'textMuted' }}>No posts yet. Check back soon!</Themed.p>
              </Box>
            )}
          </Container>
        </Flex>
      </Layout>
    </CategoryIndexHeroChrome>
  )
}

export { default as Head } from './blog-head'

export const pageQuery = graphql`
  query QueryRecentPosts {
    allMdx(sort: { frontmatter: { date: DESC } }) {
      edges {
        node {
          fields {
            category
            id
            path
          }
          frontmatter {
            banner
            date(formatString: "MMMM DD, YYYY")
            description
            excerpt
            slug
            thumbnails
            title
          }
        }
      }
    }
  }
`

export default BlogIndexPage
