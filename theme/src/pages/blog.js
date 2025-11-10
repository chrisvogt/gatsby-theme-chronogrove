/** @jsx jsx */
import { Container, jsx, Box, Heading, Text } from 'theme-ui'
import { Themed } from '@theme-ui/mdx'
import { Flex } from '@theme-ui/components'
import { Fragment } from 'react'
import { graphql } from 'gatsby'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLaptopCode, faUser, faNewspaper } from '@fortawesome/free-solid-svg-icons'

import AnimatedPageBackground from '../components/animated-page-background'
import { getPosts } from '../hooks/use-recent-posts'
import { getCategoryGroup } from '../helpers/categoryHelpers'
import Layout from '../components/layout'
import PageHeader from '../components/blog/page-header'
import PostCard from '../components/widgets/recent-posts/post-card'

// Section Header Component
const SectionHeader = ({ icon, title, count }) => (
  <Box sx={{ mb: 4, mt: 3 }}>
    <Flex sx={{ alignItems: 'center', gap: 3 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: theme => `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
          color: 'background',
          fontSize: 3
        }}
      >
        <FontAwesomeIcon icon={icon} />
      </Box>
      <Box>
        <Heading as='h2' sx={{ fontSize: [3, 4], mb: 1, fontFamily: 'heading' }}>
          {title}
        </Heading>
        {count > 0 && (
          <Text sx={{ fontSize: 1, color: 'textMuted', fontFamily: 'sans' }}>
            {count} {count === 1 ? 'post' : 'posts'}
          </Text>
        )}
      </Box>
    </Flex>
  </Box>
)

const BlogIndexPage = ({ data }) => {
  const allPosts = getPosts(data)

  // Group posts by category, excluding music and photography
  const groupedPosts = allPosts.reduce((acc, post) => {
    const category = post.fields.category || 'other'
    const group = getCategoryGroup(category, post.frontmatter.title)

    // Skip music and photography posts - they have dedicated pages
    if (group === 'music' || group === 'photography') {
      return acc
    }

    if (!acc[group]) {
      acc[group] = []
    }

    acc[group].push(post)
    return acc
  }, {})

  // Category metadata (removed music and photography)
  const categoryMeta = {
    personal: { title: 'Personal & Recaps', icon: faUser },
    technology: { title: 'Technology', icon: faLaptopCode },
    other: { title: 'All Posts', icon: faNewspaper }
  }

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
            <Container sx={{ flexGrow: 1, maxWidth: '1400px', px: [3, 4, 5] }}>
              <PageHeader>Blog</PageHeader>

              {/* Category Sections */}
              {['personal', 'technology', 'other'].map(categoryKey => {
                const posts = groupedPosts[categoryKey]
                if (!posts || posts.length === 0) return null

                const meta = categoryMeta[categoryKey]

                // Get featured post (first with banner, or just first post)
                const featuredPost = posts.find(p => p.frontmatter.banner) || posts[0]
                const remainingPosts = posts.filter(p => p.fields.id !== featuredPost.fields.id)

                return (
                  <Box key={categoryKey}>
                    <SectionHeader icon={meta.icon} title={meta.title} count={posts.length} />

                    {/* Featured Post - Horizontal on Large Screens */}
                    {featuredPost && (
                      <Box sx={{ mb: 4 }}>
                        <PostCard
                          banner={featuredPost.frontmatter.banner}
                          category={featuredPost.fields.category}
                          date={featuredPost.frontmatter.date}
                          excerpt={featuredPost.frontmatter.excerpt}
                          horizontal={true}
                          key={featuredPost.fields.id}
                          link={featuredPost.fields.path}
                          title={featuredPost.frontmatter.title}
                        />
                      </Box>
                    )}

                    {/* Remaining Posts Grid */}
                    {remainingPosts.length > 0 && (
                      <Box
                        sx={{
                          display: 'grid',
                          gridGap: 4,
                          gridTemplateColumns: [
                            '1fr',
                            'repeat(2, 1fr)',
                            remainingPosts.length === 1 ? '1fr' : 'repeat(2, 1fr)',
                            remainingPosts.length >= 3 ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)'
                          ],
                          mb: 4
                        }}
                      >
                        {remainingPosts.map(post => (
                          <PostCard
                            banner={post.frontmatter.banner}
                            category={post.fields.category}
                            date={post.frontmatter.date}
                            excerpt={post.frontmatter.excerpt}
                            key={post.fields.id}
                            link={post.fields.path}
                            title={post.frontmatter.title}
                          />
                        ))}
                      </Box>
                    )}
                  </Box>
                )
              })}

              {/* Empty State */}
              {Object.keys(groupedPosts).length === 0 && (
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
            title
          }
        }
      }
    }
  }
`

export default BlogIndexPage
