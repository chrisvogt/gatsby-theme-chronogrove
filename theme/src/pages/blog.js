/** @jsx jsx */
import { Container, jsx, Box } from 'theme-ui'
import { Themed } from '@theme-ui/mdx'
import { Flex } from '@theme-ui/components'
import { Fragment } from 'react'
import { graphql } from 'gatsby'

import AnimatedPageBackground from '../components/animated-page-background'
import { articleColumnContainerSx } from '../constants/article-column-container-sx'
import { getPosts } from '../hooks/use-recent-posts'
import { getCategoryGroup } from '../helpers/categoryHelpers'
import Layout from '../components/layout'
import PageHeader from '../components/blog/page-header'
import PostCard from '../components/widgets/recent-posts/post-card'

/** Posts for /blog/: newest first, excluding music / photography / travel (dedicated indexes). */
const getBlogIndexPosts = allPosts =>
  allPosts.filter(post => {
    const group = getCategoryGroup(post.fields.category, post.frontmatter.title)
    return group !== 'music' && group !== 'photography' && group !== 'travel'
  })

const BlogIndexPage = ({ data }) => {
  const allPosts = getPosts(data)
  const posts = getBlogIndexPosts(allPosts)

  return (
    <Fragment>
      <AnimatedPageBackground overlayHeight='min(75vh, 1000px)' />
      <div
        sx={{
          position: 'relative',
          zIndex: 1
        }}
      >
        <Layout transparentBackground>
          <Flex
            sx={{
              flexDirection: 'column',
              flexGrow: 1,
              position: 'relative',
              py: 3
            }}
          >
            <Container sx={{ ...articleColumnContainerSx, flexGrow: 1 }}>
              <PageHeader>Blog</PageHeader>

              {posts.length > 0 ? (
                <Box
                  as='section'
                  aria-label='Blog posts'
                  sx={{
                    display: 'grid',
                    gridGap: 4,
                    gridTemplateColumns: '1fr',
                    mb: 4
                  }}
                >
                  {posts.map(post => {
                    const group = getCategoryGroup(post.fields.category, post.frontmatter.title)
                    const isRecap = group === 'recaps'

                    return (
                      <PostCard
                        banner={post.frontmatter.banner}
                        category={post.fields.category}
                        date={post.frontmatter.date}
                        excerpt={post.frontmatter.excerpt}
                        horizontal={!isRecap}
                        key={post.fields.id}
                        link={post.fields.path}
                        thumbnails={post.frontmatter.thumbnails}
                        title={post.frontmatter.title}
                      />
                    )
                  })}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Themed.p sx={{ fontSize: 3, color: 'textMuted' }}>No posts yet. Check back soon!</Themed.p>
                </Box>
              )}
            </Container>
          </Flex>
        </Layout>
      </div>
    </Fragment>
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
