/** @jsx jsx */
import { jsx, useThemeUI } from 'theme-ui'
import { createPortal } from 'react-dom'
import { useEffect, useRef } from 'react'
import { Themed } from '@theme-ui/mdx'
import { faTimes, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import isDarkMode from '../../../helpers/isDarkMode'

const DiscogsModal = ({ isOpen, onClose, release }) => {
  const { colorMode } = useThemeUI()
  const darkMode = isDarkMode(colorMode)
  const modalRef = useRef(null)
  const previousActiveElement = useRef(null)

  // Handle escape key
  useEffect(() => {
    const handleEscape = e => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Store the previously focused element
      previousActiveElement.current = document.activeElement
      // Focus the modal
      if (modalRef.current) {
        modalRef.current.focus()
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      // Restore focus to the previously focused element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus()
      }
    }
  }, [isOpen, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen || !release) return null

  const { basicInformation = {} } = release
  const {
    title,
    year,
    artists = [],
    genres = [],
    styles = [],
    formats = [],
    labels = [],
    cdnCoverUrl,
    coverImage,
    resourceUrl
  } = basicInformation

  const artistNames = artists.map(artist => artist.name).join(', ')
  const genreList = genres.join(', ')
  const styleList = styles.join(', ')
  const labelInfo = labels.map(label => `${label.name}${label.catno ? ` (${label.catno})` : ''}`).join(', ')
  const formatInfo = formats
    .map(format => `${format.name}${format.qty ? ` (${format.qty})` : ''}${format.text ? ` - ${format.text}` : ''}`)
    .join(', ')

  const coverImageUrl = cdnCoverUrl || coverImage

  return createPortal(
    <div
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 3,
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)'
      }}
      onClick={e => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
      role='dialog'
      aria-modal='true'
      aria-labelledby='modal-title'
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        sx={{
          backgroundColor: darkMode ? '#252e3c' : 'white',
          color: darkMode ? '#fff' : '#000',
          borderRadius: '10px',
          boxShadow: 'xl',
          border: '1px solid',
          borderColor: darkMode ? '#3a4a5c' : '#e1e5e9',
          borderLeft: '2px solid',
          borderLeftColor: 'primary',
          maxWidth: ['95vw', '90vw', '800px'],
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative',
          width: '100%'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 3,
            right: 3,
            background: 'none',
            border: '1px solid',
            borderColor: darkMode ? '#3a4a5c' : '#e1e5e9',
            color: darkMode ? '#fff' : '#000',
            cursor: 'pointer',
            padding: 2,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            transition: 'all 0.2s ease',
            zIndex: 1,
            '&:hover': {
              backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              transform: 'scale(1.1)',
              borderColor: 'primary'
            },
            '&:focus': {
              outline: '2px solid',
              outlineColor: 'primary',
              outlineOffset: '2px'
            }
          }}
          aria-label='Close modal'
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <div sx={{ padding: 4, paddingTop: 5 }}>
          {/* Header with title */}
          <div sx={{ mb: 4 }}>
            <Themed.h2 id='modal-title' sx={{ margin: 0, fontSize: [4, 5], lineHeight: 1.2 }}>
              {title || 'Unknown Title'}
            </Themed.h2>
            <Themed.p sx={{ margin: 0, fontSize: [2, 3], color: darkMode ? '#a0aec0' : '#718096', mt: 1 }}>
              {artistNames || 'Unknown Artist'}
            </Themed.p>
            {year && (
              <Themed.p sx={{ margin: 0, fontSize: 2, color: darkMode ? '#a0aec0' : '#718096', mt: 1 }}>
                {year}
              </Themed.p>
            )}
          </div>

          {/* Content grid */}
          <div
            sx={{
              display: 'grid',
              gridTemplateColumns: ['1fr', '1fr 1fr'],
              gap: 4,
              alignItems: 'start'
            }}
          >
            {/* Cover image */}
            <div
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '300px'
              }}
            >
              {coverImageUrl ? (
                <Themed.img
                  src={coverImageUrl}
                  alt={`${title} album cover`}
                  sx={{
                    maxWidth: '100%',
                    maxHeight: '400px',
                    borderRadius: 2,
                    boxShadow: 'lg',
                    objectFit: 'contain'
                  }}
                />
              ) : (
                <div
                  sx={{
                    width: '200px',
                    height: '200px',
                    backgroundColor: darkMode ? '#2d3748' : '#f7fafc',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: darkMode ? '#a0aec0' : '#718096',
                    fontSize: 1
                  }}
                >
                  No Image Available
                </div>
              )}
            </div>

            {/* Details */}
            <div sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Genres */}
              {genreList && (
                <div>
                  <Themed.h4 sx={{ margin: 0, fontSize: 2, color: darkMode ? '#a0aec0' : '#718096', mb: 1 }}>
                    Genres
                  </Themed.h4>
                  <Themed.p sx={{ margin: 0, fontSize: 1 }}>{genreList}</Themed.p>
                </div>
              )}

              {/* Styles */}
              {styleList && (
                <div>
                  <Themed.h4 sx={{ margin: 0, fontSize: 2, color: darkMode ? '#a0aec0' : '#718096', mb: 1 }}>
                    Styles
                  </Themed.h4>
                  <Themed.p sx={{ margin: 0, fontSize: 1 }}>{styleList}</Themed.p>
                </div>
              )}

              {/* Labels */}
              {labelInfo && (
                <div>
                  <Themed.h4 sx={{ margin: 0, fontSize: 2, color: darkMode ? '#a0aec0' : '#718096', mb: 1 }}>
                    Labels
                  </Themed.h4>
                  <Themed.p sx={{ margin: 0, fontSize: 1 }}>{labelInfo}</Themed.p>
                </div>
              )}

              {/* Formats */}
              {formatInfo && (
                <div>
                  <Themed.h4 sx={{ margin: 0, fontSize: 2, color: darkMode ? '#a0aec0' : '#718096', mb: 1 }}>
                    Formats
                  </Themed.h4>
                  <Themed.p sx={{ margin: 0, fontSize: 1 }}>{formatInfo}</Themed.p>
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 3,
              mt: 4,
              pt: 4,
              borderTop: '1px solid',
              borderTopColor: darkMode ? '#3a4a5c' : '#e1e5e9'
            }}
          >
            <button
              onClick={onClose}
              sx={{
                padding: [2, 3],
                backgroundColor: 'transparent',
                color: darkMode ? '#a0aec0' : '#718096',
                border: '1px solid',
                borderColor: darkMode ? '#3a4a5c' : '#e1e5e9',
                borderRadius: '10px',
                fontSize: 1,
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                  borderColor: darkMode ? '#a0aec0' : '#718096'
                },
                '&:focus': {
                  outline: '2px solid',
                  outlineColor: 'primary',
                  outlineOffset: '2px'
                }
              }}
            >
              Close
            </button>
            {resourceUrl && (
              <a
                href={resourceUrl}
                target='_blank'
                rel='noopener noreferrer'
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  padding: [2, 3],
                  backgroundColor: 'primary',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '10px',
                  fontSize: 1,
                  fontWeight: 'bold',
                  transition: 'all 0.2s ease',
                  border: '1px solid',
                  borderColor: 'primary',
                  '&:hover': {
                    backgroundColor: 'primaryHover',
                    transform: 'translateY(-1px)',
                    boxShadow: 'lg'
                  }
                }}
              >
                <FontAwesomeIcon icon={faExternalLinkAlt} />
                View on Discogs
              </a>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default DiscogsModal
