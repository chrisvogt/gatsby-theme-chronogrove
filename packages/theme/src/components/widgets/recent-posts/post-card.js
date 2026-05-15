/** @jsx jsx */
import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { nullableString, nullableStringArray } from '@chronogrove/ui/prop-types-helpers'
import { jsx, Box as ThemeBox } from 'theme-ui'
import { Heading, Card } from '@theme-ui/components'
import { Link } from 'gatsby'
import Category from '../../category'
import ImageThumbnails from './image-thumbnails'
import YouTube from '../../../shortcodes/youtube'

/**
 * Extract YouTube video ID from embed URL
 * e.g., https://www.youtube.com/embed/fiocCvDeAYQ -> fiocCvDeAYQ
 */
export const getYouTubeVideoId = url => {
  if (!url) return null
  const match = url.match(/\/embed\/([^?]+)/)
  return match ? match[1] : null
}

/**
 * Build YouTube embed URL with additional parameters
 * Handles URLs that may already have query parameters (e.g., ?si=...)
 */
export const buildYouTubeEmbedUrl = url => {
  if (!url) return url
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}rel=0&modestbranding=1`
}

const HORIZONTAL_PREVIEW_ASPECT = '1.9 / 1'
/** Fixed width for the headline-row thumb (height follows aspect ratio); 5.625rem = 4.5rem × 1.25 */
const HEADLINE_THUMB_WIDTH = '5.625rem'

/** Preview URL for horizontal cards: banner, else first thumbnail */
const getHorizontalPreviewUrl = (banner, thumbnails) => {
  if (banner) return banner
  if (thumbnails && thumbnails.length > 0) return thumbnails[0]
  return null
}

/** Card body extracted from wrapper so definitions are stable across renders */
function PostCardInner({
  banner,
  category,
  date,
  excerpt,
  link,
  title,
  horizontal,
  thumbnails,
  youtubeSrc,
  soundcloudId,
  hasMediaEmbed,
  hasSoundCloud,
  hasYouTube,
  horizontalPreviewUrl
}) {
  return (
    <Card
      variant='actionCard'
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: hasMediaEmbed ? 'none' : 'translateY(-4px)'
        }
      }}
    >
      <ThemeBox
        className='card-content'
        sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', flex: 1 }}
      >
        {/* Horizontal index: text-first; small image floats left in headline row */}
        {horizontal && !hasMediaEmbed && (
          <HorizontalTextBlock
            category={category}
            date={date}
            excerpt={excerpt}
            hasMediaEmbed={hasMediaEmbed}
            headlinePreviewUrl={horizontalPreviewUrl}
            horizontal
            link={link}
            title={title}
          />
        )}

        {/* Vertical layout (recaps, default) */}
        {!horizontal && (
          <Fragment>
            {/* Show thumbnails above text for vertical cards (Recaps) */}
            {thumbnails && thumbnails.length > 0 && (
              <ThemeBox className='card-thumbnails' sx={{ flexShrink: 0, mb: 2 }}>
                <ImageThumbnails images={thumbnails} maxImages={4} />
              </ThemeBox>
            )}

            {/* Show banner for posts without thumbnails and no media embed */}
            {banner && (!thumbnails || thumbnails.length === 0) && !hasMediaEmbed && (
              <ThemeBox className='card-media' sx={{ flexShrink: 0, mb: 2 }}>
                <ThemeBox
                  sx={{
                    backgroundImage: `url(${banner})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    borderRadius: '8px',
                    width: '100%',
                    height: 'auto',
                    aspectRatio: '1.9 / 1',
                    transition: 'all 2.5s ease'
                  }}
                />
              </ThemeBox>
            )}

            <ThemeBox sx={{ flexShrink: 0 }}>
              <HorizontalTextBlock
                category={category}
                date={date}
                excerpt={excerpt}
                hasMediaEmbed={hasMediaEmbed}
                headlinePreviewUrl={null}
                horizontal={false}
                link={link}
                title={title}
              />
            </ThemeBox>
          </Fragment>
        )}

        {/* Horizontal: media embeds stay full-width below the row */}
        {horizontal && hasMediaEmbed && (
          <ThemeBox sx={{ flexShrink: 0 }}>
            <HorizontalTextBlock
              category={category}
              date={date}
              excerpt={excerpt}
              hasMediaEmbed={hasMediaEmbed}
              headlinePreviewUrl={null}
              horizontal
              link={link}
              title={title}
            />
          </ThemeBox>
        )}

        {/* YouTube embed */}
        {hasYouTube && (
          <ThemeBox className='card-youtube' sx={{ marginTop: 'auto', width: '100%' }}>
            <YouTube
              compact
              title={title}
              url={buildYouTubeEmbedUrl(youtubeSrc)}
              sx={{
                mt: 3,
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
              }}
            />
          </ThemeBox>
        )}

        {/* SoundCloud embed */}
        {hasSoundCloud && (
          <ThemeBox
            className='card-soundcloud'
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              width: '100%',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              marginTop: 'auto'
            }}
          >
            <ThemeBox
              as='iframe'
              width='100%'
              scrolling='no'
              frameBorder='no'
              allow='autoplay'
              src={`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${soundcloudId}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`}
              title={title}
              sx={{
                display: 'block',
                border: 'none',
                flex: 1,
                minHeight: '166px'
              }}
            />
          </ThemeBox>
        )}
      </ThemeBox>
    </Card>
  )
}

PostCardInner.propTypes = {
  banner: nullableString,
  category: PropTypes.string,
  date: PropTypes.string,
  excerpt: nullableString,
  horizontal: PropTypes.bool.isRequired,
  hasMediaEmbed: PropTypes.bool.isRequired,
  hasSoundCloud: PropTypes.bool.isRequired,
  hasYouTube: PropTypes.bool.isRequired,
  horizontalPreviewUrl: nullableString,
  link: PropTypes.string.isRequired,
  soundcloudId: nullableString,
  thumbnails: nullableStringArray,
  title: PropTypes.string.isRequired,
  youtubeSrc: nullableString
}

const HorizontalTextBlock = ({
  category,
  date,
  excerpt,
  hasMediaEmbed,
  headlinePreviewUrl = null,
  horizontal,
  link,
  title
}) => {
  const showHeadlineWithPreview = horizontal && !hasMediaEmbed && headlinePreviewUrl

  const mediaTitleHeadingSx = {
    mt: 0,
    mb: 0,
    fontFamily: 'serif',
    fontSize: horizontal ? 2 : 3,
    lineHeight: 1.35,
    ...(hasMediaEmbed ? { transition: 'color 0.2s ease' } : {})
  }

  const inlinePreviewHeadingSx = {
    flex: '1 1 0',
    minWidth: 0,
    mt: 0,
    mb: 0,
    fontFamily: 'serif',
    fontSize: 2,
    lineHeight: 1.35,
    textAlign: 'left'
  }

  const defaultHeadingSx = {
    mt: 0,
    mb: 2,
    fontFamily: 'serif',
    fontSize: horizontal ? 2 : 3,
    lineHeight: 1.3
  }

  const headline = (() => {
    if (hasMediaEmbed) {
      return (
        <Link
          to={link}
          sx={{
            textDecoration: 'none',
            color: 'inherit',
            '&:hover h3': {
              color: 'primary'
            }
          }}
        >
          <Heading as='h3' sx={mediaTitleHeadingSx}>
            {title}
          </Heading>
        </Link>
      )
    }
    if (showHeadlineWithPreview) {
      return (
        <ThemeBox
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 3,
            mb: 2
          }}
        >
          <Heading as='h3' sx={inlinePreviewHeadingSx}>
            {title}
          </Heading>
          <ThemeBox
            aria-hidden
            className='card-headline-preview'
            sx={{
              flexShrink: 0,
              width: HEADLINE_THUMB_WIDTH,
              aspectRatio: HORIZONTAL_PREVIEW_ASPECT,
              borderRadius: '6px',
              overflow: 'hidden',
              backgroundImage: `url(${headlinePreviewUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              border: '1px solid',
              borderColor: 'muted',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)'
            }}
          />
        </ThemeBox>
      )
    }
    return (
      <Heading as='h3' sx={defaultHeadingSx}>
        {title}
      </Heading>
    )
  })()

  return (
    <>
      {headline}

      {(category || date) && (
        <ThemeBox
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
            mb: excerpt || hasMediaEmbed ? 3 : 0
          }}
        >
          {category && <Category type={category} />}
          {category && date && (
            <ThemeBox as='span' sx={{ color: 'textMuted', fontSize: 0, opacity: 0.5 }}>
              •
            </ThemeBox>
          )}
          {date && (
            <ThemeBox as='time' className='created' sx={{ color: 'textMuted', fontFamily: 'sans', fontSize: 0 }}>
              {date}
            </ThemeBox>
          )}
        </ThemeBox>
      )}

      {excerpt && !hasMediaEmbed && (
        <ThemeBox
          as='p'
          className='description'
          sx={{
            mt: 0,
            mb: 0,
            fontSize: [1, 2],
            lineHeight: 1.6,
            color: 'text'
          }}
        >
          {excerpt}
        </ThemeBox>
      )}
    </>
  )
}

HorizontalTextBlock.propTypes = {
  category: PropTypes.string,
  date: PropTypes.string,
  excerpt: nullableString,
  hasMediaEmbed: PropTypes.bool.isRequired,
  headlinePreviewUrl: nullableString,
  horizontal: PropTypes.bool.isRequired,
  link: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
}

const PostCard = ({
  banner,
  category,
  date,
  excerpt,
  link,
  title,
  horizontal = false,
  thumbnails = null,
  youtubeSrc = null,
  soundcloudId = null
}) => {
  const videoId = getYouTubeVideoId(youtubeSrc)
  const hasYouTube = !!videoId
  const hasSoundCloud = !!soundcloudId
  const hasMediaEmbed = hasYouTube || hasSoundCloud

  const horizontalPreviewUrl = horizontal && !hasMediaEmbed ? getHorizontalPreviewUrl(banner, thumbnails) : null

  const innerProps = {
    banner,
    category,
    date,
    excerpt,
    horizontal,
    link,
    title,
    thumbnails,
    youtubeSrc,
    soundcloudId,
    hasSoundCloud,
    hasMediaEmbed,
    hasYouTube,
    horizontalPreviewUrl
  }

  const outerSx = { display: 'flex', height: '100%', color: 'var(--theme-ui-colors-panel-text)' }

  // If media embed is present, don't wrap the whole card in a link
  if (hasMediaEmbed) {
    return (
      <ThemeBox sx={outerSx}>
        <PostCardInner {...innerProps} />
      </ThemeBox>
    )
  }

  // Standard card wrapped in link
  return (
    <Link sx={{ ...outerSx, textDecoration: 'none' }} to={link}>
      <PostCardInner {...innerProps} />
    </Link>
  )
}

PostCard.propTypes = {
  banner: nullableString,
  category: PropTypes.string,
  date: PropTypes.string,
  excerpt: nullableString,
  horizontal: PropTypes.bool,
  isRecap: PropTypes.bool,
  link: PropTypes.string.isRequired,
  soundcloudId: nullableString,
  thumbnails: nullableStringArray,
  title: PropTypes.string.isRequired,
  youtubeSrc: nullableString
}

export default PostCard
