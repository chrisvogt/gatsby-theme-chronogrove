'use client'

import { useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Card, Container, Flex, Grid, Heading, Text, Badge, Link } from '@theme-ui/components'
import { useColorMode } from 'theme-ui'
import { TextBlock, RectShape } from 'react-placeholder/lib/placeholders'
import 'react-placeholder/lib/reactPlaceholder.css'

import NextLink from 'next/link'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

import { actionCardPinnedLayoutSx } from '@chronogrove/ui/action-card-layout'
import Header from '@chronogrove/ui/header'
import { SkipNavLink, SkipNavContent } from '@chronogrove/ui/skip-nav'
import Button from '@chronogrove/ui/button'
import ActionButton from '@chronogrove/ui/action-button'
import Pagination from '@chronogrove/ui/pagination'
import PaginationButton from '@chronogrove/ui/pagination-button'
import PageHeader from '@chronogrove/ui/page-header'
import ColorToggle from '@chronogrove/ui/color-toggle'
import LazyLoad from '@chronogrove/ui/lazy-load'
import CategoryLabel from '@chronogrove/ui/category-label'
import MutedCardFooter from '@chronogrove/ui/muted-card-footer'
import MetricBadge from '@chronogrove/ui/metric-badge'
import { ExternalLinkIcon } from '@chronogrove/ui/external-link-icon'
import MetricCard from '@chronogrove/ui/metric-card'
import StatusCard from '@chronogrove/ui/status-card'
import WidgetSection from '@chronogrove/ui/widget-section'
import WidgetHeader from '@chronogrove/ui/widget-header'
import { WidgetCallToAction } from '@chronogrove/ui/widget-call-to-action'
import ThumbnailStrip from '@chronogrove/ui/thumbnail-strip'
import ImageThumbnails from '@chronogrove/ui/image-thumbnails'
import {
  HomeDashboardGrid,
  homeDashboardMainInnerMaxWidthSx,
  homeDashboardMainShellSx,
  homeDashboardPageOuterSx
} from '@chronogrove/ui/home-dashboard-layout'

/** Stable demo assets for thumbnail components (no Cloudinary; pass-through `optimizeSrc` in the UI package). */
const DEMO_THUMB_IMAGES = [
  'https://picsum.photos/seed/chronogrove-t1/256/256',
  'https://picsum.photos/seed/chronogrove-t2/256/256',
  'https://picsum.photos/seed/chronogrove-t3/256/256',
  'https://picsum.photos/seed/chronogrove-t4/256/256',
  'https://picsum.photos/seed/chronogrove-t5/256/256'
]

const previewShellSx = {
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'panel-divider',
  borderRadius: 'default',
  bg: 'tableBackground',
  overflow: 'hidden'
}

const previewChromeSx = {
  px: 3,
  py: '10px',
  borderBottom: '1px solid',
  borderColor: 'panel-divider',
  bg: 'tableBackground'
}

const previewDividerSx = {
  border: 0,
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderColor: 'panel-divider',
  my: 0
}

const demoLabelSx = {
  fontSize: 2,
  fontWeight: 'bold',
  fontFamily: 'heading',
  letterSpacing: 'normal',
  color: 'text',
  mb: 2,
  display: 'block'
}

const widgetHeadingSx = {
  fontSize: [4, 5],
  display: 'flex',
  alignItems: 'baseline',
  m: 0,
  py: 0,
  lineHeight: 1,
  color: 'text',
  textTransform: 'none',
  letterSpacing: 'normal',
  fontFamily: 'heading'
}

const navLinkSx = {
  display: 'block',
  py: 2,
  px: 2,
  borderRadius: '6px',
  color: 'textMuted',
  textDecoration: 'none',
  fontSize: 1,
  letterSpacing: '0.02em',
  transition: 'background-color 0.2s ease, color 0.2s ease',
  '&:hover, &:focus': {
    color: 'text',
    bg: 'tableBackground',
    outline: 'none'
  }
}

const sectionNavLinkSx = {
  ...navLinkSx,
  display: 'inline-block',
  py: 1,
  mr: 2,
  mb: 1
}

const sectionKickerSx = {
  fontSize: 0,
  color: 'textMuted',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  fontFamily: 'heading',
  fontWeight: 'bold',
  mb: 2,
  display: 'block'
}

const NAV = [
  { label: 'Overview', href: '#overview' },
  { label: 'Widget preview', href: '#widget-demo' },
  { label: 'Controls', href: '#controls' },
  { label: 'Layout', href: '#layout' },
  { label: 'Post thumbnails', href: '#thumbnails' },
  { label: 'Tokens', href: '#tokens' },
  { label: 'Lazy load', href: '#lazy' }
]

function Section({ id, title, description, children }) {
  return (
    <Box id={id} as='section' sx={{ mb: [4, 5], scrollMarginTop: '5rem' }}>
      <Heading as='h2' sx={{ ...widgetHeadingSx, mb: description ? 2 : 3 }}>
        {title}
      </Heading>
      {description ? (
        <Text sx={{ color: 'textMuted', maxWidth: '46rem', mb: 0, fontSize: [2, 3], lineHeight: 1.65 }}>
          {description}
        </Text>
      ) : null}
      <Box sx={{ mt: description ? [2, 3] : 0, display: 'flex', flexDirection: 'column', gap: [3] }}>{children}</Box>
    </Box>
  )
}

Section.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  children: PropTypes.node.isRequired
}

function DemoPreview({ title: previewTitle = 'Preview', children }) {
  return (
    <Box sx={previewShellSx}>
      <Box sx={previewChromeSx}>
        <Text sx={{ fontSize: 0, fontFamily: 'monospace', color: 'textMuted', m: 0 }}>{previewTitle}</Text>
      </Box>
      {children}
    </Box>
  )
}

DemoPreview.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired
}

function DemoBlock({ label, children }) {
  return (
    <Box sx={{ p: [2, 3] }}>
      {label ? <Text sx={demoLabelSx}>{label}</Text> : null}
      {children}
    </Box>
  )
}

DemoBlock.propTypes = {
  label: PropTypes.node,
  children: PropTypes.node.isRequired
}

function LazyPlaceholder() {
  const [colorMode] = useColorMode()
  const placeholderColor = colorMode === 'dark' ? '#3a3a4a' : '#efefef'

  return (
    <Box
      as='output'
      aria-live='polite'
      aria-busy='true'
      sx={{
        p: [3, 4],
        borderLeft: '4px solid',
        borderColor: 'panel-divider',
        bg: 'tableBackground'
      }}
    >
      <div className='show-loading-animation'>
        <Flex sx={{ alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <RectShape color={placeholderColor} style={{ width: 56, height: 22, borderRadius: 6, flexShrink: 0 }} />
          <Box sx={{ flex: '1 1 12rem', minWidth: 0, maxWidth: '100%' }}>
            <TextBlock rows={1} color={placeholderColor} />
          </Box>
        </Flex>
        <TextBlock rows={2} color={placeholderColor} />
      </div>
    </Box>
  )
}

function LazyLoadedContent() {
  return (
    <Box
      sx={{
        p: [3, 4],
        borderLeft: '4px solid',
        borderColor: 'primary',
        bg: 'tableBackground'
      }}
    >
      <Flex sx={{ alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <Badge variant='primary'>Loaded</Badge>
        <Heading as='h3' sx={{ fontSize: [2, 3], fontFamily: 'heading', color: 'text', m: 0 }}>
          Deferred content
        </Heading>
      </Flex>
      <Text sx={{ color: 'textMuted', lineHeight: 1.65, m: 0, fontSize: [2, 3] }}>
        Same pattern as{' '}
        <Text as='span' sx={{ fontFamily: 'monospace', fontSize: 1 }}>
          LazyLoad
        </Text>{' '}
        in the theme GitHub widget.
      </Text>
    </Box>
  )
}

/**
 * One bounded “home widget” slice: `WidgetHeader` + `ProfileMetricsBadge` (from `@chronogrove/ui`), metric grid,
 * status strip, body rhythm, and a pinned-repo style actionCard — same primitives as the Gatsby home dashboard.
 */
function WidgetCompositionDemo() {
  const headerMetrics = [{ id: 'commits', value: 847, displayName: 'commits' }]
  const widgetAside = (
    <WidgetCallToAction href='https://github.com/chrisvogt/gatsby-theme-chronogrove'>
      View on GitHub <span className='read-more-icon'>&rarr;</span>
    </WidgetCallToAction>
  )

  return (
    <Box>
      <Box sx={{ px: [2, 3], pt: [3, 4] }}>
        <CategoryLabel sx={{ mb: 2 }}>Example</CategoryLabel>
        <WidgetHeader aside={widgetAside} icon={faGithub} metrics={headerMetrics}>
          Sample widget
        </WidgetHeader>
      </Box>

      <Box sx={{ px: [2, 3], py: [3, 4] }}>
        <Text sx={sectionKickerSx}>Metrics (profile strip)</Text>
        <Grid sx={{ gap: 3, gridTemplateColumns: ['1fr', 'repeat(2, minmax(0, 1fr))', 'repeat(4, minmax(0, 1fr))'] }}>
          <MetricCard value='142' title='Friends' />
          <MetricCard value='892' title='Books read' />
          <MetricCard value='36' title='This year' />
          <MetricCard title='Pending' value='…' showPlaceholder />
        </Grid>

        <Box sx={{ mt: [3, 4] }}>
          <Text sx={sectionKickerSx}>Status</Text>
          <StatusCard message='Synced with provider · profile public' sx={{ mb: 0 }} />
        </Box>

        <WidgetSection styleOverrides={{ mb: 0, mt: [3, 4], pt: 0, pb: 0 }}>
          <Text sx={{ color: 'textMuted', lineHeight: 1.65, m: 0, fontSize: [2, 3] }}>
            Main content sits in{' '}
            <Text as='span' sx={{ fontFamily: 'monospace', fontSize: '0.88em' }}>
              WidgetSection
            </Text>{' '}
            for the same vertical spacing as the home dashboard.
          </Text>
        </WidgetSection>

        <Box sx={{ mt: [3, 4] }}>
          <Text sx={sectionKickerSx}>Pinned card (GitHub)</Text>
          <Card variant='actionCard' sx={{ ...actionCardPinnedLayoutSx, p: [3, 3], maxWidth: ['100%', '28rem'] }}>
            <Heading as='h3' sx={{ fontFamily: 'heading', fontSize: 3, color: 'text', m: 0, mb: 2, lineHeight: 1.25 }}>
              gatsby-theme-chronogrove
            </Heading>
            <Text sx={{ color: 'textMuted', fontSize: 1, lineHeight: 1.55, m: 0 }}>
              Glass panels, primary accent edge, hover lift — same variant as pinned repositories.
            </Text>
          </Card>
        </Box>
      </Box>
    </Box>
  )
}

export default function HomeShowcase() {
  const [colorMode] = useColorMode()
  const [paginationBarPage, setPaginationBarPage] = useState(3)

  return (
    <>
      <SkipNavLink />
      <SkipNavContent as='main'>
        <Box
          as='header'
          sx={{
            borderBottom: '1px solid',
            borderColor: 'panel-divider',
            bg: 'panel-background',
            backdropFilter: 'blur(14px) saturate(160%)',
            WebkitBackdropFilter: 'blur(14px) saturate(160%)',
            position: 'sticky',
            top: 0,
            zIndex: 2
          }}
        >
          <Container>
            <Flex
              sx={{
                flexDirection: ['column', 'row'],
                alignItems: ['flex-start', 'center'],
                justifyContent: 'space-between',
                gap: 3,
                py: [3, 3]
              }}
            >
              <Box>
                <Heading
                  as='p'
                  sx={{
                    fontFamily: 'heading',
                    fontWeight: 'bold',
                    fontSize: [3, 4],
                    color: 'text',
                    lineHeight: 1.25,
                    m: 0,
                    mb: 1
                  }}
                >
                  Chronogrove UI
                </Heading>
                <Text sx={{ color: 'textMuted', fontSize: [2, 3], lineHeight: 1.6, maxWidth: '38rem', m: 0 }}>
                  Next.js App Router · Theme UI + shared components from{' '}
                  <Text as='span' sx={{ fontFamily: 'monospace', color: 'primary' }}>
                    @chronogrove/ui
                  </Text>
                  {' · '}
                  <Text as='span' sx={{ fontFamily: 'monospace', color: 'primary' }}>
                    {colorMode === 'dark' ? 'dark' : 'default'}
                  </Text>
                </Text>
              </Box>
              <Flex sx={{ alignItems: 'center', gap: 2, flexShrink: 0 }}>
                <Badge variant='outline'>reference</Badge>
                <ColorToggle />
              </Flex>
            </Flex>
          </Container>
        </Box>

        <Box sx={{ ...homeDashboardPageOuterSx, pt: [3, 4], pb: [4, 5] }}>
          <Container>
            <Flex
              sx={{
                display: ['flex', null, null, 'none'],
                flexWrap: 'wrap',
                gap: 2,
                mb: [4, null],
                pb: 3,
                borderBottom: '1px solid',
                borderColor: 'panel-divider'
              }}
              as='nav'
              aria-label='Section navigation'
            >
              {NAV.map(({ label, href }) => (
                <Link key={href} href={href} sx={sectionNavLinkSx}>
                  {label}
                </Link>
              ))}
            </Flex>

            <HomeDashboardGrid
              asideSx={{ display: ['none', null, 'block'], position: 'sticky', top: '1.5em' }}
              aside={
                <>
                  <Text sx={{ fontSize: [2, 3], fontFamily: 'heading', fontWeight: 'bold', color: 'text', mb: 2 }}>
                    On this page
                  </Text>
                  <Box
                    as='nav'
                    aria-label='Section navigation'
                    sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}
                  >
                    {NAV.map(({ label, href }) => (
                      <Link key={href} href={href} sx={navLinkSx}>
                        {label}
                      </Link>
                    ))}
                  </Box>
                  <Text sx={{ color: 'textMuted', fontSize: 0, mt: 3, lineHeight: 1.6 }}>
                    Skip target:{' '}
                    <Text as='span' sx={{ fontFamily: 'monospace' }}>
                      SkipNavContent
                    </Text>
                  </Text>
                </>
              }
              main={
                <Box>
                  <Box sx={{ ...homeDashboardMainShellSx, pb: [4, 5] }}>
                    <Box sx={homeDashboardMainInnerMaxWidthSx}>
                      <Box id='overview' sx={{ scrollMarginTop: '5rem', mb: [4, 5] }}>
                        <Heading
                          as='h1'
                          sx={{
                            mb: 2,
                            fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
                            fontFamily: 'heading',
                            color: 'text',
                            lineHeight: 1.2
                          }}
                        >
                          What this page is for
                        </Heading>
                        <Text
                          as='p'
                          sx={{
                            fontSize: [2, 3],
                            color: 'textMuted',
                            lineHeight: 1.7,
                            maxWidth: '40rem',
                            m: 0
                          }}
                        >
                          It is a compact, realistic slice of the Gatsby home dashboard: shared WidgetHeader, metric
                          tiles, and pinned-style cards — not a flat list of disconnected controls. See{' '}
                          <Text as='span' sx={{ fontFamily: 'monospace', fontSize: '0.92em' }}>
                            packages/ui/README.md
                          </Text>{' '}
                          for package entry points.
                        </Text>
                      </Box>

                      <Section
                        id='widget-demo'
                        title='Widget composition'
                        description='Uses WidgetHeader from @chronogrove/ui (same module as gatsby-theme-chronogrove): optional icon, title, WidgetCallToAction aside, and ProfileMetricsBadge metrics — then MetricCard (including showPlaceholder), StatusCard, WidgetSection, and actionCard.'
                      >
                        <DemoPreview title='Composite widget (read-only demo)'>
                          <WidgetCompositionDemo />
                        </DemoPreview>

                        <Box sx={{ mt: 3 }}>
                          <DemoPreview title='Router CTA vs external link'>
                            <DemoBlock label={null}>
                              <Text sx={{ color: 'textMuted', fontSize: 1, mb: 2, lineHeight: 1.6 }}>
                                Internal routes use your framework link so soft navigation stays client-side; outbound
                                links stay plain anchors.
                              </Text>
                              <Flex sx={{ flexDirection: 'column', gap: 2, alignItems: 'flex-start' }}>
                                <WidgetCallToAction href='https://github.com/chrisvogt/gatsby-theme-chronogrove'>
                                  External <span className='read-more-icon'>&rarr;</span>
                                </WidgetCallToAction>
                                <WidgetCallToAction linkComponent={NextLink} href='/'>
                                  App Router home <span className='read-more-icon'>&rarr;</span>
                                </WidgetCallToAction>
                              </Flex>
                            </DemoBlock>
                          </DemoPreview>
                        </Box>
                      </Section>

                      <Section
                        id='controls'
                        title='Buttons & pagination'
                        description='Filled Theme UI buttons, outline ActionButtons for dense toolbars, and the pagination bar used in media and long lists.'
                      >
                        <DemoPreview title='Controls'>
                          <DemoBlock label='Button'>
                            <Flex sx={{ flexWrap: 'wrap', gap: 2 }}>
                              <Button type='button'>Publish</Button>
                              <Button type='button' variant='secondary'>
                                Back
                              </Button>
                            </Flex>
                          </DemoBlock>
                          <Box as='hr' sx={previewDividerSx} />
                          <DemoBlock label='ActionButton'>
                            <Flex sx={{ flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                              <ActionButton type='button' size='large'>
                                Show more
                              </ActionButton>
                              <ActionButton type='button' variant='secondary' size='small'>
                                Filter
                              </ActionButton>
                            </Flex>
                          </DemoBlock>
                          <Box as='hr' sx={previewDividerSx} />
                          <DemoBlock label='Pagination'>
                            <Pagination
                              currentPage={paginationBarPage}
                              totalPages={10}
                              onPageChange={setPaginationBarPage}
                              maxVisiblePages={5}
                            />
                          </DemoBlock>
                          <Box as='hr' sx={previewDividerSx} />
                          <DemoBlock label='PaginationButton (building block)'>
                            <Text sx={{ color: 'textMuted', fontSize: 1, mb: 2, lineHeight: 1.6, m: 0 }}>
                              Used inside Pagination for page numbers and prev/next; primary tint follows theme
                              colors.primary.
                            </Text>
                            <Flex sx={{ flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                              <PaginationButton active variant='primary'>
                                3
                              </PaginationButton>
                              <PaginationButton variant='primary'>4</PaginationButton>
                              <PaginationButton variant='secondary' size='small'>
                                5
                              </PaginationButton>
                              <PaginationButton disabled variant='primary'>
                                …
                              </PaginationButton>
                            </Flex>
                          </DemoBlock>
                        </DemoPreview>
                      </Section>

                      <Section
                        id='layout'
                        title='Layout primitives'
                        description='Blog-style post title (PageHeader) and decorative masthead shell (Header) — same exports the Gatsby theme uses for MDX/blog and layout chrome.'
                      >
                        <DemoPreview title='PageHeader · Header'>
                          <DemoBlock label='PageHeader (h1 · p-name)'>
                            <PageHeader>October in the Bay Area</PageHeader>
                            <Text sx={{ color: 'textMuted', fontSize: 1, m: 0, mt: 2, lineHeight: 1.6 }}>
                              Microformats{' '}
                              <Text as='span' sx={{ fontFamily: 'monospace', fontSize: '0.92em' }}>
                                p-name
                              </Text>{' '}
                              on the title for posts.
                            </Text>
                          </DemoBlock>
                          <Box as='hr' sx={previewDividerSx} />
                          <DemoBlock label='Header (variant: styles.Header)'>
                            <Header>
                              <Text sx={{ m: 0, color: 'text', fontFamily: 'heading', fontSize: 2 }}>
                                Masthead slot
                              </Text>
                            </Header>
                          </DemoBlock>
                        </DemoPreview>
                      </Section>

                      <Section
                        id='thumbnails'
                        title='Post thumbnails'
                        description='ThumbnailStrip (vertical stacked strip beside card copy) and ImageThumbnails (circular row above the title) — same exports as gatsby-theme-chronogrove recent-post cards. This page uses pass-through URLs; the Gatsby site wires ImageThumbnails with a Cloudinary optimizeSrc helper.'
                      >
                        <DemoPreview title='ThumbnailStrip · ImageThumbnails'>
                          <DemoBlock label='ThumbnailStrip'>
                            <Text sx={{ color: 'textMuted', fontSize: 1, mb: 3, lineHeight: 1.65, m: 0 }}>
                              Compact vertical strip with staggered overlap — useful as a side rail next to a headline
                              (horizontal post cards on the theme).
                            </Text>
                            <Flex sx={{ gap: [3, 4], alignItems: 'flex-start', flexWrap: 'wrap' }}>
                              <ThumbnailStrip images={DEMO_THUMB_IMAGES} maxImages={4} />
                              <Box sx={{ flex: '1 1 12rem', minWidth: 0 }}>
                                <Text
                                  sx={{
                                    fontFamily: 'heading',
                                    fontSize: 3,
                                    color: 'text',
                                    m: 0,
                                    mb: 2,
                                    lineHeight: 1.35
                                  }}
                                >
                                  Sample headline row
                                </Text>
                                <Text sx={{ color: 'textMuted', fontSize: 1, lineHeight: 1.6, m: 0 }}>
                                  Second row uses{' '}
                                  <Text as='span' sx={{ fontFamily: 'monospace', fontSize: '0.92em' }}>
                                    size=48
                                  </Text>{' '}
                                  for a larger strip.
                                </Text>
                                <Box sx={{ mt: 3 }}>
                                  <ThumbnailStrip images={DEMO_THUMB_IMAGES} maxImages={3} size={48} />
                                </Box>
                              </Box>
                            </Flex>
                          </DemoBlock>
                          <Box as='hr' sx={previewDividerSx} />
                          <DemoBlock label='ImageThumbnails'>
                            <Text sx={{ color: 'textMuted', fontSize: 1, mb: 2, lineHeight: 1.65, m: 0 }}>
                              Circular row used on vertical recap cards when a post exposes multiple thumbnails.
                            </Text>
                            <ImageThumbnails images={DEMO_THUMB_IMAGES} maxImages={4} />
                            <Heading
                              as='h3'
                              sx={{ fontFamily: 'serif', fontSize: 3, color: 'text', m: 0, mt: 2, lineHeight: 1.35 }}
                            >
                              Title after thumbnail row
                            </Heading>
                          </DemoBlock>
                        </DemoPreview>
                      </Section>

                      <Section
                        id='tokens'
                        title='Labels, cards, links'
                        description='Small patterns used inside widgets: category label, muted footer, MetricBadge, outbound-link icon, typography tokens, and badges.'
                      >
                        <DemoPreview title='Patterns'>
                          <DemoBlock label='CategoryLabel · card with MutedCardFooter'>
                            <CategoryLabel>Travel Photography</CategoryLabel>
                            <Card variant='primary' sx={{ mt: 2, p: 3, maxWidth: '22rem' }}>
                              <Text sx={{ fontFamily: 'heading', fontSize: 2, color: 'text', m: 0, mb: 2 }}>
                                Album notes
                              </Text>
                              <Text sx={{ color: 'textMuted', fontSize: 1, lineHeight: 1.6, m: 0, mb: 2 }}>
                                Short description body.
                              </Text>
                              <MutedCardFooter>Updated this week</MutedCardFooter>
                            </Card>
                          </DemoBlock>
                          <Box as='hr' sx={previewDividerSx} />
                          <DemoBlock label='Outbound glyph'>
                            <Text sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'textMuted', m: 0 }}>
                              Documentation <ExternalLinkIcon aria-hidden />
                            </Text>
                          </DemoBlock>
                          <Box as='hr' sx={previewDividerSx} />
                          <DemoBlock label='Headings · dense label · badges'>
                            <Heading
                              as='h3'
                              sx={{ fontSize: [4, 5], fontFamily: 'heading', color: 'text', m: 0, mb: 2 }}
                            >
                              Widget title
                            </Heading>
                            <Text
                              variant='text.title'
                              sx={{ display: 'inline-block', fontSize: 1, color: 'textMuted', mb: 2 }}
                            >
                              theme.text.title
                            </Text>
                            <Flex sx={{ flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                              <Badge variant='primary'>primary</Badge>
                              <Badge variant='outline'>outline</Badge>
                              <MetricBadge variant='metrics'>metrics (MetricBadge)</MetricBadge>
                            </Flex>
                          </DemoBlock>
                          <Box as='hr' sx={previewDividerSx} />
                          <DemoBlock label='Widget CTA link style'>
                            <Link
                              href='https://github.com/chrisvogt/gatsby-theme-chronogrove'
                              sx={{ variant: 'links.widgetCta' }}
                            >
                              links.widgetCta →
                            </Link>
                          </DemoBlock>
                        </DemoPreview>
                      </Section>

                      <Section
                        id='lazy'
                        title='Lazy load'
                        description='Content below the fold can wait until the block intersects the viewport (same helper as pinned repos and Steam cards). Scroll here to hydrate the placeholder.'
                      >
                        <DemoPreview title='IntersectionObserver'>
                          <DemoBlock label={null}>
                            <Text sx={{ color: 'textMuted', fontSize: 1, mb: 3, lineHeight: 1.65, m: 0 }}>
                              Skeleton uses{' '}
                              <Text as='span' sx={{ fontFamily: 'monospace', fontSize: '0.92em' }}>
                                react-placeholder
                              </Text>{' '}
                              with{' '}
                              <Text as='span' sx={{ fontFamily: 'monospace', fontSize: '0.92em' }}>
                                show-loading-animation
                              </Text>
                              .
                            </Text>
                            <LazyLoad
                              placeholder={<LazyPlaceholder />}
                              useInViewOptions={{
                                initialInView: false,
                                rootMargin: '0px 0px -240px 0px',
                                threshold: 0
                              }}
                            >
                              <LazyLoadedContent />
                            </LazyLoad>
                          </DemoBlock>
                        </DemoPreview>
                      </Section>

                      <Box
                        as='footer'
                        sx={{
                          mt: 5,
                          pt: 4,
                          borderTop: '1px solid',
                          borderColor: 'panel-divider',
                          color: 'textMuted',
                          fontSize: 1
                        }}
                      >
                        <Text sx={{ m: 0 }}>
                          <Link
                            href='https://github.com/chrisvogt/gatsby-theme-chronogrove'
                            sx={{ variant: 'links.widgetCta' }}
                          >
                            gatsby-theme-chronogrove
                          </Link>
                          {' · '}
                          <Text as='span' sx={{ fontFamily: 'monospace' }}>
                            packages/ui/README.md
                          </Text>
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              }
            />
          </Container>
        </Box>
      </SkipNavContent>
    </>
  )
}
