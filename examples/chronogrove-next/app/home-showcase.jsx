'use client'

import { useState } from 'react'
import { Box, Card, Container, Flex, Grid, Heading, Text, Badge, Link } from '@theme-ui/components'
import { useColorMode } from 'theme-ui'

import { SkipNavLink, SkipNavContent } from '@chronogrove/ui/skip-nav'
import PageHeader from '@chronogrove/ui/page-header'
import Button from '@chronogrove/ui/button'
import ActionButton from '@chronogrove/ui/action-button'
import PaginationButton from '@chronogrove/ui/pagination-button'
import ColorToggle from '@chronogrove/ui/color-toggle'
import LazyLoad from '@chronogrove/ui/lazy-load'
import { actionCardPinnedLayoutSx } from '@chronogrove/ui/action-card-layout'

/** Same stack as GitHub pinned cards: `cards.actionCard` + pinned layout (see `pinned-item-card.js`). */
const demoActionCardSx = { ...actionCardPinnedLayoutSx, p: [3, 4] }

const navLinkSx = {
  display: 'block',
  py: 1,
  color: 'textMuted',
  textDecoration: 'none',
  fontSize: 1,
  borderLeft: '2px solid transparent',
  pl: 2,
  ml: -2,
  transition: 'color 0.15s ease, border-color 0.15s ease',
  '&:hover': {
    color: 'primary',
    borderLeftColor: 'primary'
  }
}

function Section({ id, title, description, children }) {
  return (
    <Box id={id} as='section' sx={{ mb: [4, 5], scrollMarginTop: '5rem' }}>
      <Heading as='h2' variant='text.title' sx={{ mb: 2 }}>
        {title}
      </Heading>
      {description ? (
        <Text sx={{ color: 'textMuted', maxWidth: '48rem', mb: 3, fontSize: [2, 3], lineHeight: 1.6 }}>
          {description}
        </Text>
      ) : null}
      {children}
    </Box>
  )
}

/** Intentionally not a Card — dashed “skeleton” like widgets use before content mounts. */
function LazyPlaceholder() {
  return (
    <Box
      sx={{
        minHeight: '200px',
        borderRadius: 'card',
        border: '1px dashed',
        borderColor: 'panel-divider',
        bg: 'tableBackground',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 3,
        textAlign: 'center'
      }}
    >
      <Text sx={{ color: 'textMuted', fontSize: 2 }}>
        Placeholder — subtree loads when this region enters the viewport
      </Text>
    </Box>
  )
}

function LazyLoadedPanel() {
  return (
    <Card variant='actionCard' sx={demoActionCardSx}>
      <Heading as='h3' sx={{ fontSize: 3, mb: 2, fontFamily: 'heading' }}>
        Deferred content
      </Heading>
      <Text sx={{ color: 'textMuted', lineHeight: 1.65 }}>
        Widgets such as the GitHub contribution graph use{' '}
        <Text as='span' sx={{ fontFamily: 'monospace', fontSize: 1 }}>
          LazyLoad
        </Text>{' '}
        with a sized placeholder (
        <Text as='span' sx={{ fontFamily: 'monospace', fontSize: 1 }}>
          minHeight: 200px
        </Text>
        ) so the shell is visible and layout stays stable—same pattern as{' '}
        <Text as='span' sx={{ fontFamily: 'monospace', fontSize: 1 }}>
          examples/…/github-widget
        </Text>
        .
      </Text>
    </Card>
  )
}

export default function HomeShowcase() {
  const [colorMode] = useColorMode()
  const [page, setPage] = useState(1)

  return (
    <>
      <SkipNavLink />
      <SkipNavContent as='main'>
        <Card
          variant='actionCard'
          sx={{
            borderRadius: 0,
            borderLeft: 'none',
            borderRight: 'none',
            borderTop: 'none',
            borderBottom: '1px solid',
            borderColor: 'panel-divider',
            backdropFilter: 'blur(12px) saturate(150%)'
          }}
        >
          <Container>
            <Flex
              sx={{
                py: 3,
                flexDirection: ['column', 'row'],
                alignItems: ['flex-start', 'center'],
                justifyContent: 'space-between',
                gap: 3
              }}
            >
              <Box>
                <Text
                  sx={{
                    fontFamily: 'heading',
                    fontWeight: 'bold',
                    fontSize: [2, 3],
                    color: 'text',
                    letterSpacing: '0.05em'
                  }}
                >
                  Chronogrove UI
                </Text>
                <Text sx={{ color: 'textMuted', fontSize: 1, mt: 1 }}>
                  Next.js reference · mode{' '}
                  <Text as='span' sx={{ fontFamily: 'monospace', color: 'primary' }}>
                    {colorMode === 'dark' ? 'dark' : 'default'}
                  </Text>
                </Text>
              </Box>
              <Flex sx={{ alignItems: 'center', gap: 2 }}>
                <Badge variant='outline'>@chronogrove/ui</Badge>
                <ColorToggle />
              </Flex>
            </Flex>
          </Container>
        </Card>

        <Container sx={{ py: [3, 4] }}>
          <Flex
            sx={{
              display: ['flex', null, null, 'none'],
              flexWrap: 'wrap',
              gap: 2,
              mb: 3,
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
                <Link
                  key={href}
                  href={href}
                  sx={{ ...navLinkSx, display: 'inline-block', borderLeft: 'none', pl: 0, ml: 0 }}
                >
                  {label}
                </Link>
              )
            })}
          </Flex>
          <Grid columns={[1, null, null, 'minmax(200px, 0.36fr) minmax(0, 1.64fr)']} gap={[4, null, null, 4]}>
            <Box
              as='aside'
              sx={{
                display: ['none', null, null, 'block'],
                position: 'sticky',
                top: '1rem',
                alignSelf: 'start'
              }}
            >
              <Text variant='text.title' sx={{ mb: 2, display: 'block' }}>
                On this page
              </Text>
              <Text as='nav' aria-label='Section navigation' sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
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
              </Text>
              <Text sx={{ color: 'textMuted', fontSize: 0, mt: 3, lineHeight: 1.5 }}>
                Skip link targets this main region (
                <Text as='span' sx={{ fontFamily: 'monospace' }}>
                  SkipNavContent
                </Text>
                ).
              </Text>
            </Box>

            <Card
              variant='actionCard'
              sx={{
                position: 'relative',
                borderTopRightRadius: '3em',
                borderTopLeftRadius: '.5em',
                borderBottom: 'none',
                px: [3, 4],
                pt: [3, 4],
                pb: [4, 5],
                border: '1px solid',
                borderColor: 'panel-divider',
                boxShadow: 'default',
                backdropFilter: 'blur(12px) saturate(150%)'
              }}
            >
              <Box sx={{ maxWidth: '1200px' }}>
                <Box id='overview' sx={{ mb: [4, 5], scrollMarginTop: '5rem' }}>
                  <PageHeader>Starter & reference</PageHeader>
                  <Heading
                    as='p'
                    sx={{
                      fontSize: ['calc(1.15rem + 0.6vw)', null, 'calc(1.25rem + 0.5vw)'],
                      fontWeight: 'body',
                      fontFamily: 'body',
                      color: 'textMuted',
                      lineHeight: 1.65,
                      maxWidth: '42rem',
                      mb: 0
                    }}
                  >
                    Uses Theme UI{' '}
                    <Text as='span' sx={{ fontFamily: 'monospace', fontSize: '0.92em' }}>
                      Card variant=&quot;actionCard&quot;
                    </Text>{' '}
                    (theme{' '}
                    <Text as='span' sx={{ fontFamily: 'monospace', fontSize: '0.92em' }}>
                      cards.actionCard
                    </Text>
                    , same layout sx as GitHub pinned cards) and{' '}
                    <Text as='span' sx={{ fontFamily: 'monospace', fontSize: '0.92em' }}>
                      ChronogroveAnimatedPageBackground
                    </Text>{' '}
                    like the Gatsby home stack. Wire Emotion SSR and color-mode scripts per{' '}
                    <Text as='span' sx={{ fontFamily: 'monospace', fontSize: '0.92em' }}>
                      packages/ui/README.md
                    </Text>
                    .
                  </Heading>
                </Box>

                <Section
                  id='buttons'
                  title='Buttons'
                  description='Primitives used across the theme: solid Theme UI buttons for forms, ActionButton for “show more” / outline actions, PaginationButton for paging controls (same defaults as theme Pagination).'
                >
                  <Grid columns={[1, null, 2]} gap={4}>
                    <Card variant='actionCard' sx={demoActionCardSx}>
                      <Heading as='h3' sx={{ fontSize: 2, mb: 3, fontFamily: 'heading' }}>
                        Button
                      </Heading>
                      <Text sx={{ color: 'textMuted', mb: 3, fontSize: 1, lineHeight: 1.6 }}>
                        Primary and secondary map to{' '}
                        <Text as='span' sx={{ fontFamily: 'monospace' }}>
                          buttons.primary
                        </Text>{' '}
                        /{' '}
                        <Text as='span' sx={{ fontFamily: 'monospace' }}>
                          buttons.secondary
                        </Text>{' '}
                        (see theme button tests).
                      </Text>
                      <Flex sx={{ flexWrap: 'wrap', gap: 2 }}>
                        <Button type='button'>Primary</Button>
                        <Button type='button' variant='secondary'>
                          Secondary
                        </Button>
                      </Flex>
                    </Card>
                    <Card variant='actionCard' sx={demoActionCardSx}>
                      <Heading as='h3' sx={{ fontSize: 2, mb: 3, fontFamily: 'heading' }}>
                        ActionButton
                      </Heading>
                      <Text sx={{ color: 'textMuted', mb: 3, fontSize: 1, lineHeight: 1.6 }}>
                        Widgets use primary + large for expand actions; secondary for alternate emphasis.
                      </Text>
                      <Flex sx={{ flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                        <ActionButton type='button' size='large'>
                          Show more
                        </ActionButton>
                        <ActionButton type='button' variant='secondary' size='small'>
                          Secondary
                        </ActionButton>
                        <ActionButton
                          href='https://github.com/chrisvogt/gatsby-theme-chronogrove'
                          target='_blank'
                          rel='noreferrer'
                        >
                          Repo
                        </ActionButton>
                      </Flex>
                    </Card>
                  </Grid>
                  <Card variant='actionCard' sx={{ ...demoActionCardSx, mt: 4 }}>
                    <Heading as='h3' sx={{ fontSize: 2, mb: 3, fontFamily: 'heading' }}>
                      PaginationButton
                    </Heading>
                    <Text sx={{ color: 'textMuted', mb: 3, fontSize: 1, lineHeight: 1.6 }}>
                      Matches{' '}
                      <Text as='span' sx={{ fontFamily: 'monospace' }}>
                        theme/src/components/pagination.js
                      </Text>{' '}
                      (primary / medium by default).
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
                  </Card>
                </Section>

                <Section
                  id='tokens'
                  title='Tokens & typography'
                  description='Title style, badges, and widget CTA links as on the live site.'
                >
                  <Grid columns={[1, 2, 3]} gap={3}>
                    <Card variant='actionCard' sx={demoActionCardSx}>
                      <Text variant='text.title' sx={{ display: 'block', mb: 2 }}>
                        Section label
                      </Text>
                      <Text sx={{ color: 'textMuted', fontSize: 1 }}>variant=&quot;text.title&quot;</Text>
                    </Card>
                    <Card variant='actionCard' sx={demoActionCardSx}>
                      <Badge variant='primary'>primary</Badge>
                      <Badge variant='outline' sx={{ ml: 2 }}>
                        outline
                      </Badge>
                      <Badge variant='metrics' sx={{ ml: 2 }}>
                        metrics
                      </Badge>
                    </Card>
                    <Card variant='actionCard' sx={demoActionCardSx}>
                      <Link
                        href='https://github.com/chrisvogt/gatsby-theme-chronogrove'
                        sx={{ variant: 'links.widgetCta' }}
                      >
                        Widget CTA link →
                      </Link>
                    </Card>
                  </Grid>
                </Section>

                <Section
                  id='lazy'
                  title='Lazy load'
                  description='Reserve height with a visible placeholder, then mount heavy UI when the region intersects the viewport (see GitHub widget).'
                >
                  <LazyLoad placeholder={<LazyPlaceholder />}>
                    <LazyLoadedPanel />
                  </LazyLoad>
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
                    <Link href='https://github.com/chrisvogt/gatsby-theme-chronogrove' sx={{ color: 'primary' }}>
                      gatsby-theme-chronogrove
                    </Link>
                    {' · '}
                    <Text as='span' sx={{ fontFamily: 'monospace' }}>
                      packages/ui/README.md
                    </Text>
                  </Text>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Container>
      </SkipNavContent>
    </>
  )
}
