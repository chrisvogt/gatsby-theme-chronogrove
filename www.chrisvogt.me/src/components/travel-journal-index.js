/** @jsx jsx */
/* global Image, IntersectionObserver */
import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { jsx, Box } from 'theme-ui'
import { Link } from 'gatsby'

import Category from '../../../theme/src/components/category'
import {
  CLOUDINARY_FEATURED_PORTRAIT_2X,
  optimizeCloudinaryFillDimensionsSrc,
  optimizeCloudinaryThumbnailSrc
} from '../../../theme/src/helpers/cloudinaryThumbnailUrl'

function optimizedStampThumbnail(src) {
  if (typeof src !== 'string' || src.length === 0) return undefined
  const o = optimizeCloudinaryThumbnailSrc(src)
  return o || undefined
}

function optimizedFeaturedPortrait(src) {
  if (typeof src !== 'string' || src.length === 0) return undefined
  const o = optimizeCloudinaryFillDimensionsSrc(
    src,
    CLOUDINARY_FEATURED_PORTRAIT_2X.width,
    CLOUDINARY_FEATURED_PORTRAIT_2X.height
  )
  return o || undefined
}

/** Same timing as instagram-widget-item carousel rotation */
const FEATURED_CAROUSEL_INTERVAL_MS = 3000
const FEATURED_CAROUSEL_CROSSFADE_MS = 300
const FEATURED_CAROUSEL_MAX_SLIDES = 8

const preloadFeaturedImage = url => {
  if (!url || typeof window === 'undefined') return
  const img = new Image()
  img.src = url
}

const Thumb = ({ sizePx, sx, url }) => (
  <Box
    aria-hidden
    sx={{
      width: `${sizePx}px`,
      maxWidth: '100%',
      aspectRatio: '3 / 4',
      flexShrink: 0,
      bg: 'muted',
      ...(url ? { backgroundImage: `url(${url})` } : {}),
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      borderRadius: '11px',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'muted',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      ...sx
    }}
  />
)

/** Stacked-frames cue (same role as instagram-widget-item carousel icon) — inline SVG so www has no FontAwesome dependency */
const FeaturedGalleryCueIcon = () => (
  <Box as='svg' aria-hidden viewBox='0 0 24 24' sx={{ width: '15px', height: '15px', display: 'block', flexShrink: 0 }}>
    <rect x='11.5' y='8.5' width='9.5' height='9.5' rx='1.75' fill='white' opacity={0.4} />
    <rect x='3' y='5' width='12.5' height='12.5' rx='1.75' fill='white' />
  </Box>
)

const featuredHeroFrameSx = {
  width: '100%',
  maxWidth: ['min(396px, 100%)', null, null, 'none'],
  mx: ['auto'],
  aspectRatio: '3 / 4',
  borderRadius: '11px',
  overflow: 'hidden',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'muted',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  bg: 'muted'
}

/**
 * Carousel behaviour aligned with instagram-widget-item: timed advance, opacity crossfade, preload next,
 * and dot indicators whenever the carousel is "active." Here, active means in view or hovered.
 *
 * @param {{ slideKeys: string[], title: string }} props
 */
const FeaturedHeroCarousel = ({ slideKeys, title }) => {
  const keysLine = (Array.isArray(slideKeys) ? slideKeys : []).join('|')
  const urls = useMemo(
    () =>
      (Array.isArray(slideKeys) ? slideKeys : [])
        .slice(0, FEATURED_CAROUSEL_MAX_SLIDES)
        .map(s => optimizedFeaturedPortrait(s))
        .filter(Boolean),
    [keysLine]
  )

  const [currentIndex, setCurrentIndex] = useState(0)
  const [inView, setInView] = useState(false)
  const [isMouseOver, setIsMouseOver] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const rootRef = useRef(null)
  const intervalRef = useRef(null)
  const timeoutRef = useRef(null)
  const slidesLenRef = useRef(0)
  slidesLenRef.current = urls.length

  const hasCarousel = urls.length > 1
  const currentSrc = urls[currentIndex] || urls[0]
  /** Active while in view (IntersectionObserver) or hovered — same crossfade/interval pattern as Instagram carousel items */
  const isActive = hasCarousel && (inView || isMouseOver)

  useEffect(() => {
    const el = rootRef.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return undefined
    }
    const observer = new IntersectionObserver(([entry]) => setInView(!!entry?.isIntersecting), {
      threshold: 0.2,
      rootMargin: '48px'
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    setCurrentIndex(0)
    setIsTransitioning(false)
  }, [keysLine])

  useEffect(() => {
    if (hasCarousel && isActive && urls.length > 0) {
      const next = (currentIndex + 1) % urls.length
      preloadFeaturedImage(urls[next])
    }
  }, [currentIndex, hasCarousel, isActive, keysLine, urls])

  useEffect(() => {
    if (hasCarousel && isActive) {
      urls.forEach(preloadFeaturedImage)
    }
  }, [hasCarousel, isActive, keysLine, urls])

  useEffect(() => {
    const clearTimers = () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      setIsTransitioning(false)
    }

    clearTimers()
    if (!hasCarousel || !isActive) {
      return clearTimers
    }

    intervalRef.current = window.setInterval(() => {
      setIsTransitioning(true)
      timeoutRef.current = window.setTimeout(() => {
        const len = slidesLenRef.current
        setCurrentIndex(prev => (len > 0 ? (prev + 1) % len : 0))
        setIsTransitioning(false)
        timeoutRef.current = null
      }, FEATURED_CAROUSEL_CROSSFADE_MS)
    }, FEATURED_CAROUSEL_INTERVAL_MS)

    return clearTimers
  }, [hasCarousel, isActive, keysLine])

  const handleMouseEnter = () => {
    setIsMouseOver(true)
  }

  const handleMouseLeave = () => {
    setIsMouseOver(false)
  }

  if (urls.length === 0) {
    return (
      <Box aria-hidden sx={{ ...featuredHeroFrameSx }} data-testid='travel-featured-hero'>
        <Box sx={{ position: 'absolute', inset: 0 }} />
      </Box>
    )
  }

  const altPrefix = typeof title === 'string' ? title.trim() || 'Trip' : 'Trip'

  return (
    <Box
      ref={rootRef}
      aria-label={hasCarousel ? `Photo carousel for ${altPrefix}` : undefined}
      data-testid='travel-featured-hero'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{ ...featuredHeroFrameSx }}
    >
      {hasCarousel ? (
        <Box
          aria-hidden
          data-testid='travel-featured-carousel-icon'
          sx={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 2,
            color: 'white',
            backgroundColor: 'rgba(20, 20, 31, 0.72)',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <FeaturedGalleryCueIcon />
        </Box>
      ) : null}

      {hasCarousel && isActive ? (
        <Box
          data-testid='travel-featured-carousel-indicators'
          sx={{
            position: 'absolute',
            bottom: 10,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '5px',
            zIndex: 2,
            alignItems: 'center',
            px: 2,
            py: '5px',
            borderRadius: '999px',
            backgroundColor: 'rgba(12, 12, 20, 0.45)'
          }}
        >
          {urls.slice(0, 5).map((_, idx) => {
            const n = urls.length
            const show = idx === currentIndex % Math.min(5, n)
            return (
              <span
                aria-hidden
                key={`travel-feature-dot-${idx}`}
                sx={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: show ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.42)',
                  transition: 'background-color 0.2s ease'
                }}
              />
            )
          })}
          {urls.length > 5 ? (
            <Box as='span' sx={{ color: 'white', fontSize: '11px', lineHeight: '7px', pl: '2px', opacity: 0.9 }}>
              +{urls.length - 5}
            </Box>
          ) : null}
        </Box>
      ) : null}

      <Box
        as='img'
        key={currentIndex}
        decoding='async'
        loading='lazy'
        alt={
          urls.length === 1 ? `${altPrefix}: cover photo` : `${altPrefix}: photo ${currentIndex + 1} of ${urls.length}`
        }
        src={currentSrc}
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          opacity: isTransitioning ? 0 : 1,
          transition: 'opacity 0.28s ease-in-out'
        }}
      />
    </Box>
  )
}

const MetaFeatured = ({ category, date }) => (
  <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', columnGap: 2, rowGap: 1, mb: 3 }}>
    {category ? <Category type={category} /> : null}
    {category && date ? (
      <Box aria-hidden sx={{ opacity: 0.45 }}>
        •
      </Box>
    ) : null}
    {date ? (
      <Box as='time' sx={{ fontFamily: 'sans', fontSize: 1, color: 'textMuted' }}>
        {date}
      </Box>
    ) : null}
  </Box>
)

const Featured = ({ post }) => {
  const { excerpt, thumbnails, title, date } = post.frontmatter
  const category = post.fields.category
  const href = post.fields.path

  const slideKeys = useMemo(
    () =>
      [
        ...new Set(
          (Array.isArray(thumbnails) ? thumbnails : [])
            .filter(s => typeof s === 'string')
            .map(s => s.trim())
            .filter(Boolean)
        )
      ].slice(0, FEATURED_CAROUSEL_MAX_SLIDES),
    [JSON.stringify(Array.isArray(thumbnails) ? thumbnails : [])]
  )

  return (
    <Box
      as='article'
      data-testid='travel-featured-entry'
      sx={{
        mb: [4, null, null, '2.875rem'],
        pb: [3, null, null, '3.375rem'],
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'muted'
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gap: [3, null, null, '2.125rem'],
          alignItems: 'center',
          gridTemplateColumns: '1fr',
          '@media screen and (min-width: 48em)': {
            gridTemplateColumns: 'minmax(0, clamp(232px, 32vw, 380px)) minmax(0, 1fr)'
          }
        }}
      >
        <FeaturedHeroCarousel slideKeys={slideKeys} title={typeof title === 'string' ? title : ''} />
        <Box sx={{ minWidth: 0 }}>
          <Box
            data-testid='travel-entry-link-featured'
            as={Link}
            sx={{
              textDecoration: 'none',
              color: 'inherit',
              '& h2:hover': { color: 'primary' },
              '&:focus-visible': {
                outline: '2px solid',
                outlineOffset: '3px',
                borderRadius: 'sm',
                outlineColor: 'primary'
              }
            }}
            to={href}
          >
            <Box
              as='h2'
              sx={{
                fontFamily: 'serif',
                fontSize: [4, null, null, 'clamp(2.1875rem, 3vw, 2.6875rem)'],
                mt: 0,
                mb: 3,
                lineHeight: 1.22
              }}
            >
              {title}
            </Box>
          </Box>
          <MetaFeatured category={category} date={date} />
          {excerpt ? (
            <Box
              as='p'
              sx={{
                m: 0,
                fontSize: [2, null, null, '1.05rem'],
                lineHeight: [1.6, null, null, 1.65],
                maxWidth: '44rem',
                color: 'text'
              }}
            >
              {excerpt}
            </Box>
          ) : null}
          <TravelReadMoreLink href={href} title={typeof title === 'string' ? title : null} variant='featured' />
        </Box>
      </Box>
    </Box>
  )
}

const TravelReadMoreLink = ({ emphasis = false, href, title, variant = 'timeline' }) => {
  const label = typeof title === 'string' && title.trim().length > 0 ? title.trim() : 'this trip'
  const featured = variant === 'featured'

  return (
    <Box
      as={Link}
      aria-label={`Read full post: ${label}`}
      data-testid='travel-read-more-link'
      sx={{
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'primary',
        borderRadius: '7px',
        borderStyle: 'solid',
        borderWidth: '1px',
        color: 'primary',
        display: 'inline-flex',
        fontFamily: 'body',
        fontSize: featured ? [1] : [0],
        fontWeight: 600,
        letterSpacing: featured ? '0.02em' : '0.06em',
        lineHeight: 1.25,
        mt: featured
          ? ['1rem', null, null, '1.125rem']
          : emphasis
            ? ['0.875rem', null, null, '0.8125rem']
            : ['0.6875rem', null, null, '0.75rem'],
        px: featured ? ['0.875rem', null, null, '1rem'] : ['0.625rem'],
        py: featured ? ['0.5rem', null, null, '0.5625rem'] : ['0.325rem'],
        textDecoration: 'none',
        textTransform: featured ? 'none' : 'uppercase',
        transition: 'background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease',
        '&:hover': {
          bg: 'primary',
          color: 'background'
        },
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: 'primary',
          outlineOffset: '3px'
        }
      }}
      to={href}
    >
      Read more
    </Box>
  )
}

const StampDenseMeta = ({ category, date }) => (
  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: [2], alignItems: 'center', mb: '0.675rem', mt: '0.0625rem' }}>
    {category ? <Category type={category} /> : null}
    {category && date ? (
      <Box aria-hidden sx={{ opacity: 0.45 }}>
        •
      </Box>
    ) : null}
    {date ? (
      <Box
        as='time'
        sx={{
          fontFamily: 'sans',
          fontSize: [0],
          color: 'textMuted',
          letterSpacing: '0.04em',
          textTransform: 'uppercase'
        }}
      >
        {date}
      </Box>
    ) : null}
  </Box>
)

const TimelineStamp = ({ emphasis, excerpt, href, thumbUrl, title, category, date }) => {
  const thumbPx = emphasis ? 92 : 72
  /** Theme UI font-size scale indexes – emphasis rows pop like magazine pull-quotes */
  const titleFont = emphasis ? [3, null, null, 4] : [2]

  return (
    <Box
      role='listitem'
      data-testid='travel-entry'
      sx={{
        position: 'relative',
        pl: ['0rem', null, null, '6.6875rem'],
        py: [2, null, null, '1.5rem'],
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'muted',
        '&:last-of-type': { borderBottom: 'none' },
        '&::before': {
          '@media screen and (max-width: 51.9375em)': { display: 'none !important', content: 'none' },
          '@media screen and (min-width: 52em)': {
            content: '""',
            position: 'absolute',
            left: '54px',
            top: emphasis ? '1.25rem' : '1rem',
            width: emphasis ? '13px' : '11px',
            height: emphasis ? '13px' : '11px',
            borderRadius: '999px',
            bg: emphasis ? 'primary' : 'textMuted',
            opacity: emphasis ? 1 : 0.5,
            border: theme => `2px solid ${theme.colors.background}`,
            transform: 'translateX(-50%)',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
            zIndex: 3
          }
        }
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: [3, null, null, 4], alignItems: 'flex-start' }}>
        <Box aria-hidden sx={{ mt: emphasis ? '-0.125rem' : '0.0625rem' }}>
          <Box as={Link} sx={{ display: 'block', lineHeight: 0 }} tabIndex={-1} to={href}>
            <Thumb sizePx={thumbPx} url={thumbUrl} />
          </Box>
        </Box>
        <Box sx={{ minWidth: 0, pt: emphasis ? '-0.125rem' : '0rem' }}>
          <Box
            data-testid='travel-entry-link'
            as={Link}
            sx={{
              display: 'block',
              textDecoration: 'none',
              color: 'inherit',
              '& h2:hover': { color: 'primary' },
              '&:focus-visible': {
                outline: '2px solid',
                outlineOffset: '2px',
                borderRadius: 'sm',
                outlineColor: 'primary'
              }
            }}
            to={href}
          >
            <Box
              as='h2'
              sx={{
                m: 0,
                mb: '0.5rem',
                fontFamily: 'serif',
                fontSize: titleFont,
                lineHeight: emphasis ? [1.3, null, null, 1.32] : 1.36
              }}
            >
              {title}
            </Box>
          </Box>
          {emphasis ? (
            <MetaFeatured category={category} date={date} />
          ) : (
            <StampDenseMeta category={category} date={date} />
          )}
          {excerpt ? (
            <Box
              as='p'
              sx={{
                m: 0,
                color: 'text',
                fontSize: emphasis ? [2, null, null, null] : [1, null, null, 2],
                lineHeight: emphasis ? 1.6 : 1.55,
                maxWidth: '38rem'
              }}
            >
              {excerpt}
            </Box>
          ) : null}
          <TravelReadMoreLink
            emphasis={emphasis}
            href={href}
            title={typeof title === 'string' ? title : null}
            variant='timeline'
          />
        </Box>
      </Box>
    </Box>
  )
}

/**
 * Featured trip + timeline "passport stamps" blending ideas 1, 3, and 4.
 * @param {{ posts: Array<{ fields: { category?: unknown, path: string }, frontmatter: { title?: unknown, thumbnails?: unknown, excerpt?: unknown, date?: unknown } }> }} props
 */
export default function TravelJournalIndex({ posts }) {
  if (!Array.isArray(posts) || posts.length === 0) return null

  const [first, ...rest] = posts

  return (
    <Fragment>
      {first ? <Featured post={first} /> : null}
      {rest.length > 0 ? (
        <Box
          role='list'
          sx={{
            position: 'relative',
            '&::before': {
              '@media screen and (max-width: 51.9375em)': {
                display: 'none'
              },
              '@media screen and (min-width: 52em)': {
                content: '""',
                position: 'absolute',
                left: '53px',
                top: '-0.5rem',
                bottom: '6px',
                width: '2px',
                borderRadius: '2px',
                bg: theme => `${theme.colors.muted}`,
                opacity: 0.55,
                transform: 'translateX(-50%)',
                zIndex: 1,
                pointerEvents: 'none'
              }
            }
          }}
        >
          {rest.map((post, i) => (
            <TimelineStamp
              key={`${post.fields.id ?? ''}-${post.fields.path ?? ''}-${String(i)}`}
              category={typeof post.fields.category === 'string' ? post.fields.category : null}
              date={typeof post.frontmatter.date === 'string' ? post.frontmatter.date : null}
              excerpt={typeof post.frontmatter.excerpt === 'string' ? post.frontmatter.excerpt : null}
              emphasis={i % 2 === 0}
              href={post.fields.path}
              thumbUrl={optimizedStampThumbnail(
                Array.isArray(post.frontmatter.thumbnails) ? post.frontmatter.thumbnails[0] : null
              )}
              title={typeof post.frontmatter.title === 'string' ? post.frontmatter.title : 'Untitled'}
            />
          ))}
        </Box>
      ) : null}
    </Fragment>
  )
}
