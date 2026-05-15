/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Box, Card } from '@theme-ui/components'
import { navigate as gatsbyNavigate } from 'gatsby'
import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
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

  /** Flat cover only: probe URL off the DOM so the visible `<img>` needs no handlers (a11y lint). */
  const [flatCoverMediaStatus, setFlatCoverMediaStatus] = useState('pending')

  useEffect(() => {
    if (!flatCover) {
      setFlatCoverMediaStatus('pending')
      return
    }

    if (!imageUrl) {
      setFlatCoverMediaStatus('failed')
      return
    }

    setFlatCoverMediaStatus('pending')
    let cancelled = false
    const probe = new window.Image()
    const onLoad = () => {
      if (!cancelled) setFlatCoverMediaStatus('ready')
    }
    const onErr = () => {
      if (!cancelled) setFlatCoverMediaStatus('failed')
    }
    probe.addEventListener('load', onLoad)
    probe.addEventListener('error', onErr)
    probe.src = imageUrl

    return () => {
      cancelled = true
      probe.removeEventListener('load', onLoad)
      probe.removeEventListener('error', onErr)
    }
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

  const flatCoverBusy = flatCoverMediaStatus === 'pending'
  let flatCoverInner = null
  if (flatCoverMediaStatus === 'failed') {
    flatCoverInner = (
      <Box
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
      </Box>
    )
  } else if (flatCoverMediaStatus === 'ready') {
    flatCoverInner = (
      <Box
        as='img'
        data-testid='book-preview-thumbnail'
        src={imageUrl}
        alt={title}
        loading='lazy'
        decoding='async'
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
    )
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
      <Box
        as='button'
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
          <Box sx={{ width: '100%', paddingBottom: '100%', position: 'relative' }}>
            <Box
              data-testid='book-preview-flat'
              aria-busy={flatCoverBusy}
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
              {flatCoverInner}
            </Box>
          </Box>
        ) : (
          <Book3D thumbnailURL={imageUrl} title={title} introDelay={introDelay} />
        )}
      </Box>
    </Card>
  )
}

const nullableString = PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])])

BookLink.propTypes = {
  id: PropTypes.string.isRequired,
  thumbnailURL: nullableString,
  title: PropTypes.string.isRequired,
  suppressNavigation: PropTypes.bool,
  introDelay: PropTypes.number,
  flatCover: PropTypes.bool
}

export default BookLink
