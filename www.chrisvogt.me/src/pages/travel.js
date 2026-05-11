/** @jsx jsx */
import { Container, jsx, Box } from 'theme-ui'
import { Themed } from '@theme-ui/mdx'
import { Flex } from '@theme-ui/components'
import { Fragment } from 'react'
import { graphql } from 'gatsby'

import { articleColumnContainerSx } from 'gatsby-theme-chronogrove/src/constants/article-column-container-sx'
import AnimatedPageBackground from '../../../theme/src/components/animated-page-background'
import { getPosts } from '../../../theme/src/hooks/use-recent-posts'
import Layout from '../../../theme/src/components/layout'
import PageHeader from '../../../theme/src/components/blog/page-header'
import PostCard from '../../../theme/src/components/widgets/recent-posts/post-card'
import Seo from '../../../theme/src/components/seo'

const TravelPage = ({ data }) => {
  const posts =
    getPosts(data)?.filter(post => post.fields.category === 'travel' || post.fields.category?.startsWith('travel/')) ||
    []

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
              <PageHeader>Travel</PageHeader>

              <Themed.p>Narrative posts and photo galleries from trips and destinations.</Themed.p>

              {posts.length > 0 ? (
                <Box
                  as='section'
                  aria-label='Travel posts'
                  sx={{
                    display: 'grid',
                    gridGap: [2, 2, 3, 3],
                    gridTemplateColumns: '1fr',
                    mt: 4
                  }}
                >
                  {posts.map(post => (
                    <PostCard
                      key={post.fields.id}
                      category={post.fields.category}
                      date={post.frontmatter.date}
                      excerpt={post.frontmatter.excerpt}
                      link={post.fields.path}
                      thumbnails={post.frontmatter.thumbnails}
                      title={post.frontmatter.title}
                    />
                  ))}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 6, mt: 4 }}>
                  <Themed.p sx={{ fontSize: 3, color: 'textMuted' }}>No travel posts yet. Check back soon!</Themed.p>
                </Box>
              )}
            </Container>
          </Flex>
        </Layout>
      </div>
    </Fragment>
  )
}

export const Head = () => (
  <Seo
    canonicalPath='/travel/'
    title='Travel — Chris Vogt'
    description='Travel posts and photo galleries from trips and destinations. Narrative stories and photos from Belize, Alaska, the Caribbean, and more.'
  >
    <meta property='og:url' content='https://www.chrisvogt.me/travel/' />
    <meta property='og:type' content='website' />
  </Seo>
)

export const pageQuery = graphql`
  query TravelPagePosts {
    allMdx(sort: { frontmatter: { date: DESC } }) {
      edges {
        node {
          fields {
            category
            id
            path
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            excerpt
            thumbnails
            title
          }
        }
      }
    }
  }
`

export default TravelPage
