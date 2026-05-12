/** @jsx jsx */
import { Container, jsx, Box } from 'theme-ui'
import { Themed } from '@theme-ui/mdx'
import { Flex } from '@theme-ui/components'
import { graphql } from 'gatsby'

import { articleColumnContainerSx } from 'gatsby-theme-chronogrove/src/constants/article-column-container-sx'
import {
  CategoryIndexHeroChrome,
  categoryIndexEmptyStateBoxSx,
  categoryIndexMainColumnFlexSx,
  categoryIndexPostListSectionSx
} from '../../../theme/src/components/category-index-layout'
import { getPosts } from '../../../theme/src/hooks/use-recent-posts'
import Layout from '../../../theme/src/components/layout'
import PageHeader from '../../../theme/src/components/blog/page-header'
import TravelJournalIndex from '../components/travel-journal-index'
import Seo from '../../../theme/src/components/seo'

const TravelPage = ({ data }) => {
  const posts =
    getPosts(data)?.filter(post => post.fields.category === 'travel' || post.fields.category?.startsWith('travel/')) ||
    []

  return (
    <CategoryIndexHeroChrome>
      <Layout transparentBackground>
        <Flex sx={categoryIndexMainColumnFlexSx}>
          <Container sx={{ ...articleColumnContainerSx, flexGrow: 1 }}>
            <PageHeader>Travel</PageHeader>

            <Themed.p>Narrative posts and photo galleries from trips and destinations.</Themed.p>

            {posts.length > 0 ? (
              <Box as='section' aria-label='Travel posts' sx={categoryIndexPostListSectionSx}>
                <TravelJournalIndex posts={posts} />
              </Box>
            ) : (
              <Box sx={categoryIndexEmptyStateBoxSx}>
                <Themed.p sx={{ fontSize: 3, color: 'textMuted' }}>No travel posts yet. Check back soon!</Themed.p>
              </Box>
            )}
          </Container>
        </Flex>
      </Layout>
    </CategoryIndexHeroChrome>
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
