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
} from '../../../../packages/theme/src/components/category-index-layout'
import { DEFAULT_MUSIC_INDEX_LEAD } from '../../../../packages/theme/src/constants/category-index-leads'
import { getPosts } from '../../../../packages/theme/src/hooks/use-recent-posts'
import useSiteMetadata from '../../../../packages/theme/src/hooks/use-site-metadata'
import Layout from '../../../../packages/theme/src/components/layout'
import PageHeader from '../../../../packages/theme/src/components/blog/page-header'
import PostTimelineIndex from '../../../../packages/theme/src/components/blog/post-timeline-index'
import Seo from '../../../../packages/theme/src/components/seo'
import ColorModeImage from '../../../../packages/theme/src/shortcodes/color-mode-image'

/** Same assets as `content/blog/2025-01-07-my-piano-repertoire.mdx` */
const REPERTOIRE_URL = 'https://repertoire.chrisvogt.me/'
const REPERTOIRE_SCREENSHOT_LIGHT =
  'https://res.cloudinary.com/chrisvogt/image/upload/v1778490047/chrisvogt-me/photo/repertoire-screenshot-light.png'
const REPERTOIRE_SCREENSHOT_DARK =
  'https://res.cloudinary.com/chrisvogt/image/upload/v1778490048/chrisvogt-me/photo/repertoire-screenshot-dark.png'

/** Matches timeline media frames (`post-timeline-index`) + theme card blur (`theme.js` PostCard). */
const repertoirePromoThumbFrameSx = {
  borderRadius: '11px',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'muted',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  flexShrink: 0,
  lineHeight: 0,
  overflow: 'hidden',
  /** Narrow column on phones keeps height low while staying beside copy */
  width: ['clamp(96px, 27vw, 132px)', null, 'clamp(132px, 22vw, 200px)'],
  maxWidth: 'none',
  alignSelf: 'flex-start'
}

export function MusicRepertoirePromo() {
  return (
    <Box
      aria-labelledby='music-repertoire-promo-heading'
      as='section'
      data-testid='music-repertoire-promo'
      sx={{ mb: [4, null, null, '2.875rem'] }}
    >
      <Box
        as='a'
        href={REPERTOIRE_URL}
        sx={{
          backdropFilter: 'blur(12px) saturate(150%)',
          WebkitBackdropFilter: 'blur(12px) saturate(150%)',
          bg: 'panel-background',
          borderColor: 'muted',
          borderRadius: '11px',
          borderStyle: 'solid',
          borderWidth: '1px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
          color: 'inherit',
          display: 'block',
          overflow: 'hidden',
          textDecoration: 'none',
          transition: 'border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease',
          '&:hover': {
            borderColor: 'primary',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1), 0 8px 24px rgba(66, 46, 163, 0.12)',
            transform: 'translateY(-1px)',
            '& #music-repertoire-promo-cta': {
              bg: 'primary',
              borderColor: 'primary',
              color: 'background'
            }
          },
          '&:focus-visible': {
            outline: '2px solid',
            outlineColor: 'primary',
            outlineOffset: '3px'
          }
        }}
      >
        <Flex
          sx={{
            alignItems: 'flex-start',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            gap: [2, null, 3, 4],
            justifyContent: 'space-between',
            p: [2, null, null, 3]
          }}
        >
          <Box sx={{ flex: '1 1 auto', minWidth: 0, pt: [0, null, '2px'] }}>
            <Box
              sx={{
                color: 'primary',
                fontFamily: 'heading',
                fontSize: [0],
                letterSpacing: '0.05em',
                lineHeight: 1.3,
                mb: '0.5rem',
                textTransform: 'uppercase'
              }}
            >
              Repertoire
            </Box>
            <Box
              as='h2'
              id='music-repertoire-promo-heading'
              sx={{
                fontFamily: 'serif',
                fontSize: [2, null, null, 3],
                fontWeight: 400,
                lineHeight: [1.34, null, null, 1.36],
                mt: 0,
                mb: 2
              }}
            >
              My piano repertoire
            </Box>
            <Themed.p
              sx={{
                color: 'text',
                fontSize: [1, null, null, 2],
                lineHeight: 1.7,
                m: 0,
                maxWidth: '38rem'
              }}
            >
              Browse the full list online—performance notes, transposition, and sheet music links.
            </Themed.p>
            <Box
              id='music-repertoire-promo-cta'
              sx={{
                alignItems: 'center',
                borderColor: 'primary',
                borderRadius: '7px',
                borderStyle: 'solid',
                borderWidth: '1px',
                color: 'primary',
                display: 'inline-flex',
                fontFamily: 'body',
                fontSize: [1],
                fontWeight: 600,
                justifyContent: 'center',
                letterSpacing: '0.02em',
                lineHeight: 1.25,
                mt: ['1rem', null, null, '1.125rem'],
                px: ['0.875rem', null, null, '1rem'],
                py: ['0.5rem', null, null, '0.5625rem'],
                transition: 'background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease'
              }}
            >
              Visit repertoire.chrisvogt.me
            </Box>
          </Box>
          <Box aria-hidden sx={repertoirePromoThumbFrameSx}>
            <ColorModeImage
              alt=''
              dark={REPERTOIRE_SCREENSHOT_DARK}
              light={REPERTOIRE_SCREENSHOT_LIGHT}
              loading='lazy'
              sx={{
                display: 'block',
                height: 'auto',
                width: '100%'
              }}
            />
          </Box>
        </Flex>
      </Box>
    </Box>
  )
}

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
                <PostTimelineIndex afterFeatured={<MusicRepertoirePromo />} posts={posts} timelineAsideMedia />
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
