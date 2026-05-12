/** @jsx jsx */
import React, { Fragment } from 'react'
import { jsx } from 'theme-ui'
import { Themed } from '@theme-ui/mdx'
import { Card } from '@theme-ui/components'
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

/** Small float beside headline — wide crop matches OG / banner art */
const HORIZONTAL_PREVIEW_ASPECT = '1.9 / 1'
/** Fixed width for the headline-row thumb (height follows aspect ratio); 5.625rem = 4.5rem × 1.25 */
const HEADLINE_THUMB_WIDTH = '5.625rem'

/** Preview URL for horizontal cards: banner, else first thumbnail */
const getHorizontalPreviewUrl = (banner, thumbnails) => {
  if (banner) return banner
  if (thumbnails && thumbnails.length > 0) return thumbnails[0]
  return null
}

export default ({
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

  // Card content without wrapper - used when YouTube embed is present
  const CardContent = () => (
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
      <div
        className='card-content'
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          flex: 1
        }}
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
              <div className='card-thumbnails' sx={{ flexShrink: 0, mb: 2 }}>
                <ImageThumbnails images={thumbnails} maxImages={4} />
              </div>
            )}

            {/* Show banner for posts without thumbnails and no media embed */}
            {banner && (!thumbnails || thumbnails.length === 0) && !hasMediaEmbed && (
              <div className='card-media' sx={{ flexShrink: 0, mb: 2 }}>
                <div
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
              </div>
            )}

            <div sx={{ flexShrink: 0 }}>
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
            </div>
          </Fragment>
        )}

        {/* Horizontal: media embeds stay full-width below the row */}
        {horizontal && hasMediaEmbed && (
          <div sx={{ flexShrink: 0 }}>
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
          </div>
        )}

        {/* YouTube embed */}
        {hasYouTube && (
          <div
            className='card-youtube'
            sx={{
              marginTop: 'auto',
              width: '100%'
            }}
          >
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
          </div>
        )}

        {/* SoundCloud embed */}
        {hasSoundCloud && (
          <div
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
            <iframe
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
          </div>
        )}
      </div>
    </Card>
  )

  // If media embed is present, don't wrap the whole card in a link
  if (hasMediaEmbed) {
    return (
      <div
        sx={{
          display: 'flex',
          height: '100%',
          color: 'var(--theme-ui-colors-panel-text)'
        }}
      >
        <CardContent />
      </div>
    )
  }

  // Standard card wrapped in link
  return (
    <Link
      sx={{
        display: 'flex',
        height: '100%',
        color: 'var(--theme-ui-colors-panel-text)',
        textDecoration: 'none'
      }}
      to={link}
    >
      <CardContent />
    </Link>
  )
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

  const titleHeading = (
    <Themed.h3
      sx={{
        mt: 0,
        mb: 0,
        fontFamily: 'serif',
        fontSize: horizontal ? 2 : 3,
        lineHeight: 1.35,
        transition: hasMediaEmbed ? 'color 0.2s ease' : undefined
      }}
    >
      {title}
    </Themed.h3>
  )

  return (
    <>
      {hasMediaEmbed ? (
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
          {titleHeading}
        </Link>
      ) : showHeadlineWithPreview ? (
        <div
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 3,
            mb: 2
          }}
        >
          <Themed.h3
            sx={{
              flex: '1 1 0',
              minWidth: 0,
              mt: 0,
              mb: 0,
              fontFamily: 'serif',
              fontSize: 2,
              lineHeight: 1.35,
              textAlign: 'left'
            }}
          >
            {title}
          </Themed.h3>
          <div
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
        </div>
      ) : (
        <Themed.h3
          sx={{
            mt: 0,
            mb: 2,
            fontFamily: 'serif',
            fontSize: horizontal ? 2 : 3,
            lineHeight: 1.3
          }}
        >
          {title}
        </Themed.h3>
      )}

      {(category || date) && (
        <div
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
            <span
              sx={{
                color: 'textMuted',
                fontSize: 0,
                opacity: 0.5
              }}
            >
              •
            </span>
          )}
          {date && (
            <time
              className='created'
              sx={{
                color: 'textMuted',
                fontFamily: 'sans',
                fontSize: 0
              }}
            >
              {date}
            </time>
          )}
        </div>
      )}

      {excerpt && !hasMediaEmbed && (
        <p
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
        </p>
      )}
    </>
  )
}
