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
import { DEFAULT_MUSIC_INDEX_LEAD } from '../../../theme/src/constants/category-index-leads'
import { getPosts } from '../../../theme/src/hooks/use-recent-posts'
import useSiteMetadata from '../../../theme/src/hooks/use-site-metadata'
import Layout from '../../../theme/src/components/layout'
import PageHeader from '../../../theme/src/components/blog/page-header'
import PostTimelineIndex from '../../../theme/src/components/blog/post-timeline-index'
import Seo from '../../../theme/src/components/seo'

const MusicPage = ({ data }) => {
  const posts = getPosts(data)?.filter(post => post.fields.category?.startsWith('music')) || []
  const { musicIndexLead } = useSiteMetadata() || {}
  const trimmedLead = typeof musicIndexLead === 'string' ? musicIndexLead.trim() : ''
  const musicLead = trimmedLead.length > 0 ? trimmedLead : DEFAULT_MUSIC_INDEX_LEAD

  return (
    <CategoryIndexHeroChrome>
      <Layout transparentBackground>
        <Flex sx={categoryIndexMainColumnFlexSx}>
          <Container sx={{ ...articleColumnContainerSx, flexGrow: 1 }}>
            <PageHeader>My Music</PageHeader>

            <Themed.p>{musicLead}</Themed.p>

            {posts.length > 0 ? (
              <Box as='section' aria-label='Music posts' sx={categoryIndexPostListSectionSx}>
                <PostTimelineIndex posts={posts} timelineAsideMedia />
              </Box>
            ) : (
              <Box sx={categoryIndexEmptyStateBoxSx}>
                <Themed.p sx={{ fontSize: 3, color: 'textMuted' }}>No music posts yet. Check back soon!</Themed.p>
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
    canonicalPath='/music/'
    title="Chris Vogt's Music - Original and Cover Songs"
    description="Explore Chris Vogt's collection of original songs and covers. Listen to unique tracks and discover the stories behind the music on chrisvogt.me."
  >
    <meta property='og:url' content='https://www.chrisvogt.me/music/' />
    <meta property='og:type' content='website' />
  </Seo>
)

export const pageQuery = graphql`
  query QueryMusicPosts {
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
            soundcloudId
            thumbnails
            title
            youtubeSrc
          }
        }
      }
    }
  }
`

export default MusicPage
