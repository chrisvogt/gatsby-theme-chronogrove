/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Themed } from '@theme-ui/mdx'
import { Card } from '@theme-ui/components'
import { Link } from 'gatsby'
import Category from '../../category'
import ImageThumbnails from './image-thumbnails'

/**
 * Extract YouTube video ID from embed URL
 * e.g., https://www.youtube.com/embed/fiocCvDeAYQ -> fiocCvDeAYQ
 */
const getYouTubeVideoId = url => {
  if (!url) return null
  const match = url.match(/\/embed\/([^?]+)/)
  return match ? match[1] : null
}

/**
 * Build YouTube embed URL with additional parameters
 * Handles URLs that may already have query parameters (e.g., ?si=...)
 */
const buildYouTubeEmbedUrl = url => {
  if (!url) return url
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}rel=0&modestbranding=1`
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
  youtubeSrc = null
}) => {
  const videoId = getYouTubeVideoId(youtubeSrc)
  const hasYouTube = !!videoId

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
          transform: hasYouTube ? 'none' : 'translateY(-4px)'
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
        {/* Show thumbnails above text for vertical cards (Recaps) */}
        {!horizontal && thumbnails && thumbnails.length > 0 && (
          <div className='card-thumbnails' sx={{ flexShrink: 0, mb: 2 }}>
            <ImageThumbnails images={thumbnails} maxImages={4} />
          </div>
        )}

        {/* Show banner for posts without thumbnails and no YouTube */}
        {banner && (!thumbnails || thumbnails.length === 0) && !hasYouTube && (
          <div className='card-media' sx={{ flexShrink: 0, mb: 2 }}>
            <div
              sx={{
                backgroundImage: `url(${banner})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                borderRadius: '8px',
                width: horizontal ? ['100%', '200px'] : '100%',
                height: horizontal ? ['auto', '105px'] : 'auto',
                aspectRatio: '1.9 / 1',
                transition: 'all 2.5s ease'
              }}
            />
          </div>
        )}

        {/* Text content area */}
        <div sx={{ flexShrink: 0 }}>
          {/* Show thumbnails inside text area for horizontal cards (Photography) */}
          {horizontal && thumbnails && thumbnails.length > 0 && (
            <div className='card-thumbnails' sx={{ mb: 2 }}>
              <ImageThumbnails images={thumbnails} maxImages={4} />
            </div>
          )}

          {/* Title - linked when YouTube is present */}
          {hasYouTube ? (
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
              <Themed.h3
                sx={{
                  mt: 0,
                  mb: 2,
                  fontFamily: 'serif',
                  fontSize: horizontal ? 2 : 3,
                  lineHeight: 1.3,
                  transition: 'color 0.2s ease'
                }}
              >
                {title}
              </Themed.h3>
            </Link>
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

          {/* Metadata row: Category + Date on same line, below title */}
          {(category || date) && (
            <div
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2,
                mb: excerpt || hasYouTube ? 3 : 0
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

          {/* Excerpt - only shown when no YouTube */}
          {excerpt && !hasYouTube && (
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
        </div>

        {/* YouTube embed - pushed to bottom with margin-top: auto */}
        {hasYouTube && (
          <div
            className='card-youtube'
            sx={{
              position: 'relative',
              width: '100%',
              paddingBottom: '56.25%', // 16:9 aspect ratio
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              marginTop: 'auto' // Push to bottom of card
            }}
          >
            <iframe
              src={buildYouTubeEmbedUrl(youtubeSrc)}
              title={title}
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none'
              }}
            />
          </div>
        )}
      </div>
    </Card>
  )

  // If YouTube is present, don't wrap the whole card in a link
  if (hasYouTube) {
    return (
      <div
        sx={{
          display: 'flex',
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
        color: 'var(--theme-ui-colors-panel-text)',
        textDecoration: 'none'
      }}
      to={link}
    >
      <CardContent />
    </Link>
  )
}
