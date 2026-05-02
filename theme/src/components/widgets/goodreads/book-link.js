/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Card } from '@theme-ui/components'
import { navigate as gatsbyNavigate } from 'gatsby'
import { useEffect, useState } from 'react'
import Book3D from '../../artwork/book-3d'

const BookLink = ({
  id,
  thumbnailURL,
  title,
  suppressNavigation = false,
  introDelay = 0,
  // When true, use a static image instead of WebGL (limits contexts: one carousel page worth of Book3D).
  flatCover = false
}) => {
  // Append compression/format hints for imgix CDN images
  const imageUrl = (() => {
    try {
      const url = new URL(thumbnailURL)
      const isImgixDomain = url.host.endsWith('.imgix.net')
      return isImgixDomain ? `${thumbnailURL}?auto=compress&auto=format` : thumbnailURL
    } catch {
      return thumbnailURL
    }
  })()

  const [flatImgFailed, setFlatImgFailed] = useState(false)
  useEffect(() => {
    setFlatImgFailed(false)
  }, [imageUrl, flatCover])

  const handleClick = e => {
    e.preventDefault()
    e.stopPropagation()
    if (suppressNavigation) {
      return
    }
    const currentScroll = window.scrollY
    setTimeout(() => {
      gatsbyNavigate(`?bookId=${id}`, {
        replace: true,
        state: {
          noScroll: true,
          scrollPosition: currentScroll
        }
      })
    }, 0)
  }

  return (
    <Card
      variant='actionCard'
      sx={{
        minWidth: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)'
        }
      }}
    >
      <button
        data-testid='book-link'
        type='button'
        onClick={handleClick}
        title={title}
        sx={{
          appearance: 'none',
          background: 'transparent',
          border: 0,
          color: 'var(--theme-ui-colors-panel-text)',
          cursor: 'pointer',
          display: 'block',
          height: '100%',
          m: 0,
          p: 0,
          width: '100%',
          '&:focus': {
            outline: '2px solid',
            outlineColor: 'primary',
            outlineOffset: '2px'
          }
        }}
      >
        {flatCover ? (
          <div sx={{ width: '100%', paddingBottom: '100%', position: 'relative' }}>
            <div
              data-testid='book-preview-flat'
              role='img'
              aria-label={title}
              sx={{
                position: 'absolute',
                inset: 0,
                borderRadius: 2,
                overflow: 'hidden',
                bg: 'muted',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {!flatImgFailed ? (
                <img
                  data-testid='book-preview-thumbnail'
                  src={imageUrl}
                  alt=''
                  loading='lazy'
                  decoding='async'
                  onError={() => setFlatImgFailed(true)}
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <span
                  sx={{
                    p: 2,
                    fontSize: 1,
                    lineHeight: 'snug',
                    textAlign: 'center',
                    color: 'text',
                    wordBreak: 'break-word'
                  }}
                >
                  {title}
                </span>
              )}
            </div>
          </div>
        ) : (
          <Book3D thumbnailURL={imageUrl} title={title} introDelay={introDelay} />
        )}
      </button>
    </Card>
  )
}

export default BookLink
