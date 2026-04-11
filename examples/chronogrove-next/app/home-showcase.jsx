'use client'

import { useState } from 'react'
import { Box, Card, Container, Flex, Grid, Heading, Text, Badge, Link } from '@theme-ui/components'
import { useColorMode } from 'theme-ui'
import { TextBlock, RectShape } from 'react-placeholder/lib/placeholders'
import 'react-placeholder/lib/reactPlaceholder.css'

import { SkipNavLink, SkipNavContent } from '@chronogrove/ui/skip-nav'
import Button from '@chronogrove/ui/button'
import ActionButton from '@chronogrove/ui/action-button'
import PaginationButton from '@chronogrove/ui/pagination-button'
import ColorToggle from '@chronogrove/ui/color-toggle'
import LazyLoad from '@chronogrove/ui/lazy-load'

/**
 * Docs-style preview surface (like shadcn / Radix examples): one bordered region per section,
 * not a stack of glass cards.
 */
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

/** Subheading above each demo group (sentence case — not theme `text.title`). */
const demoLabelSx = {
  fontSize: 2,
  fontWeight: 'bold',
  fontFamily: 'heading',
  letterSpacing: 'normal',
  color: 'text',
  mb: 2,
  display: 'block'
}

/** Calmer hover for the one actionCard demo we keep. */
const showcaseActionCardSx = {
  ...previewShellSx,
  p: [3, 4],
  bg: 'panel-background',
  backdropFilter: 'blur(12px) saturate(150%)',
  WebkitBackdropFilter: 'blur(12px) saturate(150%)',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  '&:hover, &:focus': {
    transform: 'none',
    boxShadow: 'md'
  }
}

const homeGridColumns = [
  null,
  null,
  'minmax(200px, 0.375fr) minmax(0, 1.625fr)',
  'minmax(200px, 0.4fr) minmax(0, 1.6fr)'
]

const homeMainShellSx = {
  position: 'relative',
  borderTopRightRadius: '3em',
  borderTopLeftRadius: '.5em',
  px: [3, 4],
  pt: [2, 3],
  pb: [4, 5]
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

function Section({ id, title, description, children }) {
  return (
    <Box id={id} as='section' sx={{ mb: [4, 5], scrollMarginTop: '5rem' }}>
      <Heading as='h2' sx={{ ...widgetHeadingSx, mb: description ? 2 : 3 }}>
        {title}
      </Heading>
      {description ? (
        <Text sx={{ color: 'textMuted', maxWidth: '44rem', mb: 0, fontSize: [2, 3], lineHeight: 1.65 }}>
          {description}
        </Text>
      ) : null}
      <Box sx={{ mt: description ? [2, 3] : 0, display: 'flex', flexDirection: 'column', gap: [3] }}>{children}</Box>
    </Box>
  )
}

/** Preview container + optional top chrome bar. */
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

function DemoBlock({ label, children }) {
  return (
    <Box sx={{ p: [2, 3] }}>
      {label ? <Text sx={demoLabelSx}>{label}</Text> : null}
      {children}
    </Box>
  )
}

/**
 * Skeleton for the lazy demo — same building blocks as theme widgets (react-placeholder + show-loading-animation).
 * The GitHub widget’s contribution graph uses a plain min-height box; Steam game cards and pinned repo cards use
 * RectShape/TextBlock like this.
 */
function LazyPlaceholder() {
  const [colorMode] = useColorMode()
  const placeholderColor = colorMode === 'dark' ? '#3a3a4a' : '#efefef'

  return (
    <Box
      role='status'
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
        in{' '}
        <Text as='span' sx={{ fontFamily: 'monospace', fontSize: 1 }}>
          theme/…/github-widget
        </Text>
        .
      </Text>
    </Box>
  )
}

export default function HomeShowcase() {
  const [colorMode] = useColorMode()
  const [page, setPage] = useState(1)

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
                gap: 3
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
                <Text sx={{ color: 'textMuted', fontSize: [2, 3], lineHeight: 1.6, maxWidth: '36rem', m: 0 }}>
                  Next.js App Router reference · color mode{' '}
                  <Text as='span' sx={{ fontFamily: 'monospace', color: 'primary' }}>
                    {colorMode === 'dark' ? 'dark' : 'default'}
                  </Text>
                </Text>
              </Box>
              <Flex sx={{ alignItems: 'center', gap: 2, flexShrink: 0 }}>
                <Badge variant='outline'>@chronogrove/ui</Badge>
                <ColorToggle />
              </Flex>
            </Flex>
          </Container>
        </Box>

        <Box sx={{ minHeight: '500px', pt: 3, px: 0 }}>
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
              {['Overview', 'Buttons', 'Tokens', 'Lazy load'].map((label, i) => {
                const href = ['#overview', '#buttons', '#tokens', '#lazy'][i]
                return (
                  <Link key={href} href={href} sx={sectionNavLinkSx}>
                    {label}
                  </Link>
                )
              })}
            </Flex>

            <Grid columns={homeGridColumns} gap={[null, 4]}>
              <Box
                as='aside'
                sx={{ mb: [4, null], display: ['none', null, 'block'], position: 'sticky', top: '1.5em' }}
              >
                <Text sx={{ fontSize: [2, 3], fontFamily: 'heading', fontWeight: 'bold', color: 'text', mb: 2 }}>
                  On this page
                </Text>
                <Box as='nav' aria-label='Section navigation' sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  <Link href='#overview' sx={navLinkSx}>
                    Overview
                  </Link>
                  <Link href='#buttons' sx={navLinkSx}>
                    Buttons
                  </Link>
                  <Link href='#tokens' sx={navLinkSx}>
                    Tokens & links
                  </Link>
                  <Link href='#lazy' sx={navLinkSx}>
                    Lazy load
                  </Link>
                </Box>
                <Text sx={{ color: 'textMuted', fontSize: 0, mt: 3, lineHeight: 1.6 }}>
                  Skip link targets{' '}
                  <Text as='span' sx={{ fontFamily: 'monospace' }}>
                    SkipNavContent
                  </Text>
                  .
                </Text>
              </Box>

              <Box>
                <Box sx={homeMainShellSx}>
                  <Box sx={{ maxWidth: '1200px' }}>
                    <Box id='overview' sx={{ scrollMarginTop: '5rem', mb: [3, 4] }}>
                      <Box sx={{ lineHeight: '2.5em', mb: [3, 4] }}>
                        <Heading
                          as='h1'
                          sx={{
                            mb: 0,
                            pb: 0,
                            fontSize: 'calc(1.5rem + 2vw)',
                            fontFamily: 'heading',
                            color: 'text',
                            lineHeight: 1.2
                          }}
                        >
                          Starter & reference
                        </Heading>
                      </Box>
                      <Text
                        as='p'
                        sx={{
                          fontSize: [2, 3],
                          fontWeight: 'body',
                          fontFamily: 'body',
                          color: 'textMuted',
                          lineHeight: 1.65,
                          maxWidth: '42rem',
                          m: 0,
                          mb: 0
                        }}
                      >
                        Layout follows common component-doc patterns: one flat preview block per section (border + muted
                        fill), not a wall of glass cards. Widget dashboards still use{' '}
                        <Text as='span' sx={{ fontFamily: 'monospace', fontSize: '0.92em' }}>
                          Card variant=&quot;actionCard&quot;
                        </Text>{' '}
                        — we show that once below. Main shell matches{' '}
                        <Text as='span' sx={{ fontFamily: 'monospace', fontSize: '0.92em' }}>
                          theme/src/templates/home.js
                        </Text>
                        ; background stack:{' '}
                        <Text as='span' sx={{ fontFamily: 'monospace', fontSize: '0.92em' }}>
                          ChronogroveAnimatedPageBackground
                        </Text>
                        . See{' '}
                        <Text as='span' sx={{ fontFamily: 'monospace', fontSize: '0.92em' }}>
                          packages/ui/README.md
                        </Text>
                        .
                      </Text>
                    </Box>

                    <Section
                      id='buttons'
                      title='Buttons'
                      description='Theme UI filled buttons, outline-style ActionButtons, and pagers — same pieces as the Gatsby theme.'
                    >
                      <DemoPreview>
                        <DemoBlock label='Theme UI Button'>
                          <Text sx={{ color: 'textMuted', fontSize: 1, mb: 2, lineHeight: 1.6 }}>
                            Default uses{' '}
                            <Text as='span' sx={{ fontFamily: 'monospace' }}>
                              buttons.primary
                            </Text>
                            ;{' '}
                            <Text as='span' sx={{ fontFamily: 'monospace' }}>
                              variant=&quot;secondary&quot;
                            </Text>{' '}
                            is Theme UI’s second filled style (less emphasis than primary).
                          </Text>
                          <Flex sx={{ flexWrap: 'wrap', gap: 2 }}>
                            <Button type='button'>Publish</Button>
                            <Button type='button' variant='secondary'>
                              Back
                            </Button>
                          </Flex>
                        </DemoBlock>
                        <Box as='hr' sx={previewDividerSx} />
                        <DemoBlock label='ActionButton'>
                          <Text sx={{ color: 'textMuted', fontSize: 1, mb: 2, lineHeight: 1.6 }}>
                            Outline / tinted controls for widgets —{' '}
                            <Text as='span' sx={{ fontFamily: 'monospace' }}>
                              variant=&quot;secondary&quot;
                            </Text>{' '}
                            uses a muted palette for alternate actions (not a separate component type).
                          </Text>
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
                        <DemoBlock label='PaginationButton'>
                          <Text sx={{ color: 'textMuted', fontSize: 1, mb: 2, lineHeight: 1.6 }}>
                            Defaults match{' '}
                            <Text as='span' sx={{ fontFamily: 'monospace' }}>
                              theme/src/components/pagination.js
                            </Text>
                            .
                          </Text>
                          <Flex sx={{ alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                            <PaginationButton
                              type='button'
                              aria-label='Previous page'
                              disabled={page <= 1}
                              onClick={() => setPage(p => Math.max(1, p - 1))}
                            >
                              ‹
                            </PaginationButton>
                            {[1, 2, 3, 4, 5].map(n => (
                              <PaginationButton
                                key={n}
                                type='button'
                                active={page === n}
                                onClick={() => setPage(n)}
                                aria-current={page === n ? 'page' : undefined}
                                aria-label={`Page ${n}`}
                              >
                                {n}
                              </PaginationButton>
                            ))}
                            <PaginationButton
                              type='button'
                              aria-label='Next page'
                              disabled={page >= 5}
                              onClick={() => setPage(p => Math.min(5, p + 1))}
                            >
                              ›
                            </PaginationButton>
                            <Text sx={{ color: 'textMuted', ml: 2 }}>Page {page}</Text>
                          </Flex>
                        </DemoBlock>
                      </DemoPreview>

                      <Box sx={{ mt: 3 }}>
                        <Text sx={{ ...demoLabelSx, mb: 2 }}>Frosted widget card</Text>
                        <Text sx={{ color: 'textMuted', fontSize: 1, mb: 3, maxWidth: '40rem', lineHeight: 1.6 }}>
                          Pinned repos and widget shells use the frosted card — shown once so the preview above can stay
                          light.
                        </Text>
                        <Card variant='actionCard' sx={showcaseActionCardSx}>
                          <Text sx={{ fontFamily: 'heading', fontSize: 2, color: 'text', mb: 2 }}>
                            Example action card
                          </Text>
                          <Text sx={{ color: 'textMuted', fontSize: 1, lineHeight: 1.6, m: 0 }}>
                            Same variant as GitHub pinned items — glass border, primary accent edge.
                          </Text>
                        </Card>
                      </Box>
                    </Section>

                    <Section
                      id='tokens'
                      title='Tokens & typography'
                      description='Badges, links, and the optional small-caps label token for dense UI.'
                    >
                      <DemoPreview title='Examples'>
                        <DemoBlock label='Headings'>
                          <Heading as='h3' sx={{ fontSize: [4, 5], fontFamily: 'heading', color: 'text', m: 0, mb: 2 }}>
                            Widget section title
                          </Heading>
                          <Text sx={{ color: 'textMuted', fontSize: 1, m: 0 }}>
                            Matches{' '}
                            <Text as='span' sx={{ fontFamily: 'monospace' }}>
                              widget-header.js
                            </Text>{' '}
                            (
                            <Text as='span' sx={{ fontFamily: 'monospace' }}>
                              fontSize: [4, 5]
                            </Text>
                            ).
                          </Text>
                        </DemoBlock>
                        <Box as='hr' sx={previewDividerSx} />
                        <DemoBlock label='Dense label token'>
                          <Text sx={{ color: 'textMuted', fontSize: 1, mb: 2, lineHeight: 1.6 }}>
                            <Text as='span' sx={{ fontFamily: 'monospace' }}>
                              theme.text.title
                            </Text>{' '}
                            — micro-label style (avoid for page headings):
                          </Text>
                          <Text variant='text.title' sx={{ display: 'inline-block', fontSize: 1, color: 'textMuted' }}>
                            theme.text.title
                          </Text>
                        </DemoBlock>
                        <Box as='hr' sx={previewDividerSx} />
                        <DemoBlock label='Badges'>
                          <Flex sx={{ flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                            <Badge variant='primary'>primary</Badge>
                            <Badge variant='outline'>outline</Badge>
                            <Badge variant='metrics'>metrics</Badge>
                          </Flex>
                        </DemoBlock>
                        <Box as='hr' sx={previewDividerSx} />
                        <DemoBlock label='Widget CTA'>
                          <Link
                            href='https://github.com/chrisvogt/gatsby-theme-chronogrove'
                            sx={{ variant: 'links.widgetCta' }}
                          >
                            Widget CTA link →
                          </Link>
                        </DemoBlock>
                      </DemoPreview>
                    </Section>

                    <Section
                      id='lazy'
                      title='Lazy load'
                      description='Placeholder until the block intersects the viewport (pinned repos use the same helper). Scroll the page to this section to load the subtree.'
                    >
                      <DemoPreview>
                        <DemoBlock label='IntersectionObserver + placeholder'>
                          <Text sx={{ color: 'textMuted', fontSize: 1, mb: 3, lineHeight: 1.65 }}>
                            SSR is skeleton-only; after hydration the observer runs. The skeleton uses{' '}
                            <Text as='span' sx={{ fontFamily: 'monospace', fontSize: '0.92em' }}>
                              react-placeholder
                            </Text>{' '}
                            like pinned repos and Steam cards; the contribution graph in{' '}
                            <Text as='span' sx={{ fontFamily: 'monospace', fontSize: '0.92em' }}>
                              github-widget
                            </Text>{' '}
                            only reserves height (
                            <Text as='span' sx={{ fontFamily: 'monospace', fontSize: '0.92em' }}>
                              minHeight: 200px
                            </Text>
                            ). Negative bottom{' '}
                            <Text as='span' sx={{ fontFamily: 'monospace', fontSize: '0.92em' }}>
                              rootMargin
                            </Text>{' '}
                            reduces instant loads when the section barely peeks in.
                          </Text>
                          <Box sx={{ pt: 2 }}>
                            <LazyLoad
                              placeholder={<LazyPlaceholder />}
                              useInViewOptions={{
                                initialInView: false,
                                rootMargin: '0px 0px -32% 0px',
                                threshold: 0
                              }}
                            >
                              <LazyLoadedContent />
                            </LazyLoad>
                          </Box>
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
                      <Text>
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
            </Grid>
          </Container>
        </Box>
      </SkipNavContent>
    </>
  )
}
