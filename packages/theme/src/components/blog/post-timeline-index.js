/** @jsx jsx */
/* global Image, IntersectionObserver */
import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { jsx, Box } from 'theme-ui'
import { Link } from 'gatsby'

import Category from '../category'
import YouTube from '../../shortcodes/youtube'
import { buildYouTubeEmbedUrl, getYouTubeVideoId } from '../widgets/recent-posts/post-card'
import {
  CLOUDINARY_FEATURED_PORTRAIT_2X,
  optimizeCloudinaryFillDimensionsSrc,
  optimizeCloudinaryThumbnailSrc
} from '../../helpers/cloudinary-thumbnail-url'

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

function nextFeaturedCarouselIndex(prev, slideCount) {
  return slideCount > 0 ? (prev + 1) % slideCount : 0
}

const preloadFeaturedImage = url => {
  if (!url || typeof window === 'undefined') return
  const img = new Image()
  img.src = url
}

function resolveTimelineStampThumbRaw(post) {
  const thumbs = post?.frontmatter?.thumbnails
  if (Array.isArray(thumbs) && thumbs[0]) return thumbs[0]
  const banner = post?.frontmatter?.banner
  return typeof banner === 'string' ? banner : null
}

function timelineRestPostKey(post, index) {
  const rawId = post?.fields?.id
  const path = post?.fields?.path
  const idPart = typeof rawId === 'string' || typeof rawId === 'number' ? String(rawId) : ''
  const pathPart = typeof path === 'string' ? path : ''
  return `${idPart}-${pathPart}-${index}`
}

/** Uniform timeline stamp thumbnail width (3:4 aspect); keeps the left column visually aligned row-to-row */
const TIMELINE_STAMP_THUMB_PX = 80

function soundcloudPlayerSrc(trackId) {
  return `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${trackId}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`
}

/**
 * YouTube (compact) + SoundCloud player for music-style timeline rows / featured cell.
 * Matches PostCard embed params; no thumbnail fallback when media mode is active.
 */
const TimelineEmbedAside = ({ soundcloudId, sx = {}, title, youtubeSrc }) => {
  const hasYt = !!getYouTubeVideoId(youtubeSrc)
  const hasSc = !!soundcloudId
  const label = typeof title === 'string' ? title : 'Track'

  if (!hasYt && !hasSc) {
    return (
      <Box
        aria-hidden
        sx={{
          aspectRatio: '16 / 9',
          bg: 'muted',
          borderRadius: '11px',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'muted',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          ...sx
        }}
      />
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%', ...sx }}>
      {hasYt ? (
        <YouTube
          compact
          title={label}
          url={buildYouTubeEmbedUrl(youtubeSrc)}
          sx={{
            borderRadius: '11px',
            overflow: 'hidden',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
          }}
        />
      ) : null}
      {hasSc ? (
        <Box
          sx={{
            borderRadius: '11px',
            overflow: 'hidden',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Box
            allow='autoplay'
            as='iframe'
            frameBorder='no'
            scrolling='no'
            src={soundcloudPlayerSrc(soundcloudId)}
            title={label}
            width='100%'
            sx={{
              border: 'none',
              display: 'block',
              height: '166px'
            }}
          />
        </Box>
      ) : null}
    </Box>
  )
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
 * @param {{ slideKeys: string[], title: string, tid: (s: string) => string, featuredImageAltFallback: string }} props
 */
const FeaturedHeroCarousel = ({ slideKeys, title, tid, featuredImageAltFallback }) => {
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

    const advanceFeaturedCarouselSlide = () => {
      const len = slidesLenRef.current
      setCurrentIndex(prev => nextFeaturedCarouselIndex(prev, len))
      setIsTransitioning(false)
      timeoutRef.current = null
    }

    intervalRef.current = window.setInterval(() => {
      setIsTransitioning(true)
      timeoutRef.current = window.setTimeout(advanceFeaturedCarouselSlide, FEATURED_CAROUSEL_CROSSFADE_MS)
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
      <Box aria-hidden sx={{ ...featuredHeroFrameSx }} data-testid={tid('featured-hero')}>
        <Box sx={{ position: 'absolute', inset: 0 }} />
      </Box>
    )
  }

  const altPrefix = typeof title === 'string' ? title.trim() || featuredImageAltFallback : featuredImageAltFallback

  return (
    <Box
      ref={rootRef}
      aria-label={hasCarousel ? `Photo carousel for ${altPrefix}` : undefined}
      data-testid={tid('featured-hero')}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{ ...featuredHeroFrameSx }}
    >
      {hasCarousel ? (
        <Box
          aria-hidden
          data-testid={tid('featured-carousel-icon')}
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
          data-testid={tid('featured-carousel-indicators')}
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
                key={`${tid('feature-dot')}-${idx}`}
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

const Featured = ({
  featuredImageAltFallback,
  post,
  readMoreAriaFallback,
  showBottomSeparator = true,
  tid,
  timelineAsideMedia = false
}) => {
  const fm = post.frontmatter
  const { banner, excerpt, thumbnails, title, date, soundcloudId, youtubeSrc } = fm
  const category = post.fields.category
  const href = post.fields.path

  const slideKeys = useMemo(() => {
    if (timelineAsideMedia) return []
    const b = typeof banner === 'string' ? banner.trim() : ''
    const fromThumbs = (Array.isArray(thumbnails) ? thumbnails : [])
      .filter(s => typeof s === 'string')
      .map(s => s.trim())
      .filter(Boolean)
    const ordered = [b, ...fromThumbs].filter(Boolean)
    return [...new Set(ordered)].slice(0, FEATURED_CAROUSEL_MAX_SLIDES)
  }, [timelineAsideMedia, JSON.stringify({ banner, thumbnails })])

  const leftColumn = timelineAsideMedia ? (
    <Box data-testid={tid('featured-embed-aside')} sx={{ minWidth: 0, width: '100%' }}>
      <TimelineEmbedAside soundcloudId={soundcloudId} title={title} youtubeSrc={youtubeSrc} />
    </Box>
  ) : (
    <FeaturedHeroCarousel
      featuredImageAltFallback={featuredImageAltFallback}
      slideKeys={slideKeys}
      tid={tid}
      title={typeof title === 'string' ? title : ''}
    />
  )

  return (
    <Box
      as='article'
      data-bottom-rule={showBottomSeparator ? 'true' : 'false'}
      data-testid={tid('featured-entry')}
      sx={{
        mb: [4, null, null, '2.875rem'],
        pb: [3, null, null, '3.375rem'],
        ...(showBottomSeparator
          ? {
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderBottomColor: 'muted'
            }
          : {})
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gap: [3, null, null, '2.125rem'],
          alignItems: 'start',
          gridTemplateColumns: '1fr',
          '@media screen and (min-width: 48em)': {
            gridTemplateColumns: timelineAsideMedia
              ? 'minmax(0, clamp(180px, 32vw, 260px)) minmax(0, 1fr)'
              : 'minmax(0, clamp(232px, 32vw, 380px)) minmax(0, 1fr)'
          }
        }}
      >
        {leftColumn}
        <Box sx={{ minWidth: 0 }}>
          <Box
            data-testid={tid('entry-link-featured')}
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
          <TimelineReadMoreLink
            href={href}
            readMoreAriaFallback={readMoreAriaFallback}
            tid={tid}
            title={typeof title === 'string' ? title : null}
            variant='featured'
          />
        </Box>
      </Box>
    </Box>
  )
}

const TimelineReadMoreLink = ({ emphasis = false, href, readMoreAriaFallback, tid, title, variant = 'timeline' }) => {
  const label = typeof title === 'string' && title.trim().length > 0 ? title.trim() : readMoreAriaFallback
  const featured = variant === 'featured'

  let readMoreMarginTop = ['0.6875rem', null, null, '0.75rem']
  if (featured) {
    readMoreMarginTop = ['1rem', null, null, '1.125rem']
  } else if (emphasis) {
    readMoreMarginTop = ['0.875rem', null, null, '0.8125rem']
  }

  return (
    <Box
      as={Link}
      aria-label={`Read full post: ${label}`}
      data-testid={tid('read-more-link')}
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
        mt: readMoreMarginTop,
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

function TimelineStampLeadMedia({ timelineAsideMedia, tid, soundcloudId, title, youtubeSrc, href, thumbUrl }) {
  if (timelineAsideMedia) {
    return (
      <Box
        data-testid={tid('entry-embed-aside')}
        sx={{
          flexShrink: 0,
          maxWidth: '100%',
          minWidth: 0,
          width: ['100%', null, 'clamp(180px, 32vw, 260px)']
        }}
      >
        <TimelineEmbedAside soundcloudId={soundcloudId} title={title} youtubeSrc={youtubeSrc} />
      </Box>
    )
  }
  return (
    <Box aria-hidden sx={{ flexShrink: 0, mt: 0, width: `${TIMELINE_STAMP_THUMB_PX}px`, maxWidth: '100%' }}>
      <Box as={Link} sx={{ display: 'block', lineHeight: 0 }} tabIndex={-1} to={href}>
        <Thumb sizePx={TIMELINE_STAMP_THUMB_PX} url={thumbUrl} />
      </Box>
    </Box>
  )
}

function TimelineStampArticleColumn({
  category,
  date,
  emphasis,
  excerpt,
  href,
  readMoreAriaFallback,
  tid,
  title,
  titleFont
}) {
  return (
    <Box sx={{ minWidth: 0, pt: 0 }}>
      <Box
        data-testid={tid('entry-link')}
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
      {emphasis ? <MetaFeatured category={category} date={date} /> : <StampDenseMeta category={category} date={date} />}
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
      <TimelineReadMoreLink
        emphasis={emphasis}
        href={href}
        readMoreAriaFallback={readMoreAriaFallback}
        tid={tid}
        title={typeof title === 'string' ? title : null}
        variant='timeline'
      />
    </Box>
  )
}

const TimelineStamp = ({
  category,
  date,
  emphasis,
  excerpt,
  href,
  readMoreAriaFallback,
  soundcloudId,
  thumbUrl,
  tid,
  timelineAsideMedia = false,
  title,
  youtubeSrc
}) => {
  /** Theme UI font-size scale indexes – emphasis rows pop like magazine pull-quotes */
  const titleFont = emphasis ? [3, null, null, 4] : [2]

  return (
    <Box
      as='li'
      data-testid={tid('entry')}
      sx={{
        position: 'relative',
        listStyle: 'none',
        pl: timelineAsideMedia ? ['0rem', null, null, '0rem'] : ['0rem', null, null, '6.6875rem'],
        py: [2, null, null, '1.5rem'],
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'muted',
        '&:last-of-type': { borderBottom: 'none' },
        ...(timelineAsideMedia
          ? {}
          : {
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
            })
      }}
    >
      <Box
        sx={{
          alignItems: timelineAsideMedia ? ['stretch', null, 'flex-start'] : 'flex-start',
          display: 'flex',
          flexDirection: timelineAsideMedia ? ['column', null, 'row'] : 'row',
          gap: [3, null, null, 4]
        }}
      >
        <TimelineStampLeadMedia
          href={href}
          soundcloudId={soundcloudId}
          thumbUrl={thumbUrl}
          tid={tid}
          timelineAsideMedia={timelineAsideMedia}
          title={title}
          youtubeSrc={youtubeSrc}
        />
        <TimelineStampArticleColumn
          category={category}
          date={date}
          emphasis={emphasis}
          excerpt={excerpt}
          href={href}
          readMoreAriaFallback={readMoreAriaFallback}
          tid={tid}
          title={title}
          titleFont={titleFont}
        />
      </Box>
    </Box>
  )
}

/**
 * Featured masthead + timeline stamps (blog index, travel index, music index, etc.).
 *
 * @param {{
 *   posts: Array<{ fields: { category?: unknown, id?: unknown, path: string }, frontmatter: { title?: unknown, thumbnails?: unknown, banner?: unknown, excerpt?: unknown, date?: unknown, youtubeSrc?: unknown, soundcloudId?: unknown } }>,
 *   dataTestIdPrefix?: string,
 *   featuredImageAltFallback?: string,
 *   readMoreAriaFallback?: string,
 *   timelineAsideMedia?: boolean,
 *   afterFeatured?: import('react').ReactNode
 * }} props
 */
export default function PostTimelineIndex({
  posts,
  dataTestIdPrefix = 'post-timeline',
  featuredImageAltFallback = 'Post',
  readMoreAriaFallback = 'this post',
  timelineAsideMedia = false,
  afterFeatured = null
}) {
  if (!Array.isArray(posts) || posts.length === 0) return null

  const tid = suffix => `${dataTestIdPrefix}-${suffix}`
  const [first, ...rest] = posts

  return (
    <Fragment>
      {first ? (
        <Featured
          featuredImageAltFallback={featuredImageAltFallback}
          post={first}
          readMoreAriaFallback={readMoreAriaFallback}
          showBottomSeparator={!afterFeatured}
          tid={tid}
          timelineAsideMedia={timelineAsideMedia}
        />
      ) : null}
      {afterFeatured}
      {rest.length > 0 ? (
        <Box
          as='ul'
          sx={{
            position: 'relative',
            listStyle: 'none',
            m: 0,
            p: 0,
            ...(timelineAsideMedia
              ? {}
              : {
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
                })
          }}
        >
          {rest.map((post, i) => {
            const thumbRaw = resolveTimelineStampThumbRaw(post)

            return (
              <TimelineStamp
                key={timelineRestPostKey(post, i)}
                category={typeof post.fields.category === 'string' ? post.fields.category : null}
                date={typeof post.frontmatter.date === 'string' ? post.frontmatter.date : null}
                excerpt={typeof post.frontmatter.excerpt === 'string' ? post.frontmatter.excerpt : null}
                emphasis={i % 2 === 0}
                href={post.fields.path}
                readMoreAriaFallback={readMoreAriaFallback}
                soundcloudId={post.frontmatter.soundcloudId}
                thumbUrl={optimizedStampThumbnail(thumbRaw)}
                tid={tid}
                timelineAsideMedia={timelineAsideMedia}
                title={typeof post.frontmatter.title === 'string' ? post.frontmatter.title : 'Untitled'}
                youtubeSrc={post.frontmatter.youtubeSrc}
              />
            )
          })}
        </Box>
      ) : null}
    </Fragment>
  )
}
