/** @jsx jsx */
import { jsx, useThemeUI } from 'theme-ui'
import { createPortal } from 'react-dom'
import { Fragment, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { nullableObject, nullableString } from '@chronogrove/ui/prop-types-helpers'
import { Themed } from '@theme-ui/mdx'
import { faTimes, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { RectShape } from 'react-placeholder/lib/placeholders'
import isDarkMode from '../../../helpers/isDarkMode'
import { getDiscogsCollectionAddedMs, getDiscogsReleaseYear } from './sort-discogs-releases'

import 'react-placeholder/lib/reactPlaceholder.css'

function formatCollectionAddedLocal(ms) {
  if (!Number.isFinite(ms) || ms <= 0) return null
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(ms))
  } catch {
    return null
  }
}

function discogsModalTargetIgnoresArrowKeys(el) {
  const tag = el?.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
  return Boolean(el?.closest?.('[contenteditable="true"]'))
}

function canBrowseDiscogsReleasesWithArrows(onSelectRelease, orderedReleases, release) {
  return (
    typeof onSelectRelease === 'function' &&
    Array.isArray(orderedReleases) &&
    orderedReleases.length >= 2 &&
    Boolean(release)
  )
}

function useDiscogsModalFocus(isOpen, modalRef, previousActiveElementRef) {
  useEffect(() => {
    if (isOpen) {
      previousActiveElementRef.current = document.activeElement
      queueMicrotask(() => {
        modalRef.current?.focus()
      })
    } else {
      previousActiveElementRef.current?.focus?.()
    }
  }, [isOpen, modalRef, previousActiveElementRef])
}

function useDiscogsModalKeyboard(isOpen, onClose, release, orderedReleases, onSelectRelease) {
  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = e => {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return

      if (!canBrowseDiscogsReleasesWithArrows(onSelectRelease, orderedReleases, release)) {
        return
      }

      if (discogsModalTargetIgnoresArrowKeys(e.target)) {
        return
      }

      const idx = orderedReleases.findIndex(r => r && r.id === release.id)
      if (idx === -1) return

      const delta = e.key === 'ArrowRight' ? 1 : -1
      const next = orderedReleases[idx + delta]
      if (!next) return

      e.preventDefault()
      onSelectRelease(next)
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose, release, orderedReleases, onSelectRelease])
}

function useDiscogsModalBodyScrollLock(isOpen) {
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
}

function DiscogsModalCoverSection({ coverImageUrl, title, darkMode, imageLoaded, setImageLoaded, insetSurface }) {
  if (!coverImageUrl) {
    return (
      <div
        sx={{
          width: '100%',
          height: '100%',
          backgroundColor: insetSurface,
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
    )
  }

  return (
    <Fragment>
      {!imageLoaded && (
        <div
          className='show-loading-animation'
          sx={{
            position: 'absolute',
            inset: 0,
            borderRadius: 2,
            overflow: 'hidden'
          }}
        >
          <RectShape
            color={darkMode ? '#3a3a4a' : '#efefef'}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '8px'
            }}
          />
        </div>
      )}
      <Themed.img
        src={coverImageUrl}
        alt={`${title} album cover`}
        onLoad={() => setImageLoaded(true)}
        sx={{
          position: 'relative',
          maxWidth: '100%',
          maxHeight: '100%',
          width: 'auto',
          height: 'auto',
          borderRadius: 2,
          boxShadow: 'lg',
          objectFit: 'contain',
          opacity: imageLoaded ? 1 : 0,
          transition: 'opacity 0.2s ease-in-out'
        }}
      />
    </Fragment>
  )
}

function DiscogsModalTracklistSection({
  tracklist,
  darkMode,
  listPanelBorder,
  insetSurface,
  insetHeaderBg,
  insetRule
}) {
  if (!tracklist?.length) return null

  return (
    <div sx={{ mt: 4 }}>
      <Themed.h3 sx={{ margin: 0, fontSize: 3, mb: 3 }}>Tracklist</Themed.h3>
      <div
        sx={{
          backgroundColor: insetSurface,
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: listPanelBorder
        }}
      >
        <div
          sx={{
            display: 'grid',
            gridTemplateColumns: 'auto minmax(0, 1fr) auto',
            gap: 2,
            padding: 3,
            backgroundColor: insetHeaderBg,
            borderBottom: '1px solid',
            borderBottomColor: insetRule,
            fontSize: 1,
            fontWeight: 'bold',
            color: darkMode ? '#a0aec0' : '#718096'
          }}
        >
          <div>Position</div>
          <div sx={{ minWidth: 0 }}>Title</div>
          <div>Duration</div>
        </div>
        {tracklist.map((track, index) => (
          <div
            key={`${String(track.position ?? '—')}-${String(track.title ?? '')}-${index}`}
            sx={{
              display: 'grid',
              gridTemplateColumns: 'auto minmax(0, 1fr) auto',
              gap: 2,
              padding: 3,
              borderBottom: index < tracklist.length - 1 ? '1px solid' : 'none',
              borderBottomColor: insetRule,
              fontSize: 1,
              minWidth: 0,
              '&:hover': {
                backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.035)'
              }
            }}
          >
            <div sx={{ fontWeight: 'bold', color: darkMode ? '#e2e8f0' : '#2d3748' }}>{track.position || '—'}</div>
            <div
              sx={{
                color: darkMode ? '#e2e8f0' : '#2d3748',
                minWidth: 0,
                overflowWrap: 'break-word',
                wordBreak: 'break-word'
              }}
            >
              {track.title || 'Unknown Title'}
            </div>
            <div sx={{ color: darkMode ? '#a0aec0' : '#718096', textAlign: 'right' }}>{track.duration || '—'}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

DiscogsModalCoverSection.propTypes = {
  coverImageUrl: nullableString,
  title: nullableString,
  darkMode: PropTypes.bool.isRequired,
  imageLoaded: PropTypes.bool.isRequired,
  setImageLoaded: PropTypes.func.isRequired,
  insetSurface: PropTypes.string.isRequired
}

DiscogsModalTracklistSection.propTypes = {
  tracklist: PropTypes.arrayOf(PropTypes.object),
  darkMode: PropTypes.bool.isRequired,
  listPanelBorder: PropTypes.string.isRequired,
  insetSurface: PropTypes.string.isRequired,
  insetHeaderBg: PropTypes.string.isRequired,
  insetRule: PropTypes.string.isRequired
}

const DiscogsModal = ({ isOpen, onClose, release, orderedReleases, onSelectRelease }) => {
  const { colorMode } = useThemeUI()
  const darkMode = isDarkMode(colorMode)
  const modalRef = useRef(null)
  const previousActiveElement = useRef(null)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Reset image load state when release/cover changes
  const coverImageUrl = release?.basicInformation?.cdnCoverUrl || release?.basicInformation?.coverImage
  useEffect(() => {
    setImageLoaded(false)
  }, [coverImageUrl])

  useDiscogsModalFocus(isOpen, modalRef, previousActiveElement)
  useDiscogsModalKeyboard(isOpen, onClose, release, orderedReleases, onSelectRelease)
  useDiscogsModalBodyScrollLock(isOpen)

  if (!isOpen || !release) return null

  const { basicInformation = {}, resource = {} } = release
  const { title, artists = [], genres = [], styles = [] } = basicInformation

  // Extract additional data from resource object
  const { uri: discogsUrl, tracklist = [] } = resource

  // Use the new uri field from resource object for customer-facing links
  const finalDiscogsUrl = discogsUrl || basicInformation.resourceUrl

  const artistNames = (artists || []).map(artist => artist.name).join(', ')
  const genreList = (genres || []).join(', ')
  const styleList = (styles || []).join(', ')
  const collectionAddedText = formatCollectionAddedLocal(getDiscogsCollectionAddedMs(release))

  /** Match vinyl list register (`vinyl-collection_list`): frosted translucent panel + hairline border */
  const listPanelBg = darkMode ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.92)'
  const listPanelBorder = darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'
  const muted = darkMode ? '#a0aec0' : '#718096'
  const headerRule = darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'
  const insetRule = darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.075)'
  const insetSurface = darkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.55)'
  const insetHeaderBg = darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.035)'
  const parsedReleaseYear = getDiscogsReleaseYear(release)
  const yearStr = Number.isFinite(parsedReleaseYear) ? String(parsedReleaseYear) : ''
  const showYear = yearStr !== ''

  return createPortal(
    <div
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 3,
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)'
      }}
      role='dialog'
      aria-modal='true'
      aria-labelledby='modal-title'
    >
      <button
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          width: '100%',
          height: '100%',
          zIndex: -1
        }}
        onClick={onClose}
        aria-label='Close modal'
      />
      <div
        ref={modalRef}
        tabIndex={-1}
        sx={{
          backgroundColor: listPanelBg,
          color: darkMode ? '#fff' : '#000',
          borderRadius: 2,
          boxShadow: ['md', null, 'lg'],
          border: '1px solid',
          borderColor: listPanelBorder,
          borderLeft: '2px solid',
          borderLeftColor: 'primary',
          backdropFilter: 'saturate(1.12) blur(20px)',
          WebkitBackdropFilter: 'saturate(1.12) blur(20px)',
          width: ['100%', '100%', 'min(100%, 800px)'],
          maxWidth: ['95vw', '90vw', '800px'],
          minWidth: 0,
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative'
        }}
        onClick={e => e.stopPropagation()}
        onKeyDown={e => e.stopPropagation()}
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
            borderColor: listPanelBorder,
            color: darkMode ? '#fff' : '#000',
            backgroundColor: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.45)',
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
              backgroundColor: darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)',
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
          <header
            sx={{
              mb: 4,
              pb: 4,
              borderBottom: '1px solid',
              borderBottomColor: headerRule
            }}
          >
            <Themed.h2
              id='modal-title'
              sx={{
                margin: 0,
                fontSize: [4, 5],
                lineHeight: 1.15,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: 'inherit',
                overflowWrap: 'break-word',
                wordBreak: 'break-word'
              }}
            >
              {title || 'Unknown Title'}
            </Themed.h2>
            <p
              sx={{
                margin: 0,
                mt: 2,
                fontSize: [2, 3],
                lineHeight: 1.45,
                color: muted,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '0.4em'
              }}
            >
              <span sx={{ fontWeight: 500, color: darkMode ? '#e2e8f0' : '#2d3748' }}>
                {artistNames || 'Unknown Artist'}
              </span>
              {showYear && (
                <Fragment>
                  <span sx={{ color: muted, opacity: 0.85, userSelect: 'none' }} aria-hidden>
                    ·
                  </span>
                  <span sx={{ fontVariantNumeric: 'tabular-nums' }}>{yearStr}</span>
                </Fragment>
              )}
            </p>
          </header>

          {/* Content grid */}
          <div
            sx={{
              display: 'grid',
              gridTemplateColumns: ['1fr', '280px minmax(0, 1fr)'],
              gap: 4,
              alignItems: 'start'
            }}
          >
            {/* Cover image - fixed dimensions prevent layout shift */}
            <div
              sx={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '280px',
                height: '280px',
                flexShrink: 0
              }}
            >
              <DiscogsModalCoverSection
                coverImageUrl={coverImageUrl}
                title={title}
                darkMode={darkMode}
                imageLoaded={imageLoaded}
                setImageLoaded={setImageLoaded}
                insetSurface={insetSurface}
              />
            </div>

            {/* Details */}
            <div
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                minWidth: 0,
                overflowWrap: 'break-word',
                wordBreak: 'break-word'
              }}
            >
              {collectionAddedText && (
                <div>
                  <Themed.h4 sx={{ margin: 0, fontSize: 2, color: darkMode ? '#a0aec0' : '#718096', mb: 1 }}>
                    Added to collection
                  </Themed.h4>
                  <Themed.p sx={{ margin: 0, fontSize: 1 }}>{collectionAddedText}</Themed.p>
                </div>
              )}

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
            </div>
          </div>

          <DiscogsModalTracklistSection
            tracklist={tracklist}
            darkMode={darkMode}
            listPanelBorder={listPanelBorder}
            insetSurface={insetSurface}
            insetHeaderBg={insetHeaderBg}
            insetRule={insetRule}
          />

          {/* Action buttons */}
          <div
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 3,
              mt: 4,
              pt: 4,
              borderTop: '1px solid',
              borderTopColor: headerRule
            }}
          >
            <button
              onClick={onClose}
              sx={{
                padding: [2, 3],
                backgroundColor: 'transparent',
                color: darkMode ? '#a0aec0' : '#718096',
                border: '1px solid',
                borderColor: listPanelBorder,
                borderRadius: 2,
                fontSize: 1,
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.045)',
                  borderColor: muted
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
            {finalDiscogsUrl && (
              <a
                href={finalDiscogsUrl}
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

DiscogsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  release: nullableObject,
  orderedReleases: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSelectRelease: PropTypes.func.isRequired
}

export default DiscogsModal
