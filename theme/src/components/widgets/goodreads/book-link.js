/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Card } from '@theme-ui/components'
import { navigate as gatsbyNavigate } from 'gatsby'
import Book3D from '../../artwork/book-3d'

const BookLink = ({ id, thumbnailURL, title, suppressNavigation = false, introDelay = 0 }) => {
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
        <Book3D thumbnailURL={imageUrl} title={title} introDelay={introDelay} />
      </button>
    </Card>
  )
}

export default BookLink
