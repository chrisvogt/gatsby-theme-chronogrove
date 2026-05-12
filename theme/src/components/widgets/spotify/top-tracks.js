/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Heading } from '@theme-ui/components'
import { Themed } from '@theme-ui/mdx'
import { useEffect, useMemo, useState } from 'react'

import { useAudioPlayerStore } from '../../../stores/audio-player-store'
import useSwipePagination from '../../../hooks/use-swipe-pagination'

import MediaItemGrid from './media-item-grid'
import Pagination from '../../pagination'

/** Matches prior single-view density (12 tiles); backend may return up to 24 tracks. */
const TRACKS_PER_PAGE = 12

const TopTracks = ({ isLoading, tracks = [] }) => {
  const setSpotifyTrack = useAudioPlayerStore(state => state.setSpotifyTrack)

  const handleTrackClick = spotifyURL => {
    setSpotifyTrack(spotifyURL)
  }

  const pages = useMemo(() => {
    const mapped = tracks.map(track => {
      const { artists = [], albumImages = [], id, name, spotifyURL } = track

      const thumbnail = albumImages.find(image => image.width === 300) || {}
      const { url: thumbnailURL } = thumbnail

      return {
        id,
        name,
        spotifyURL,
        thumbnailURL,
        details: `${name} – ${artists.join(', ')}`
      }
    })

    if (!mapped.length) {
      return [[]]
    }

    const pageCount = Math.ceil(mapped.length / TRACKS_PER_PAGE)
    return Array.from({ length: pageCount }, (_, pageIndex) => {
      const start = pageIndex * TRACKS_PER_PAGE
      return mapped.slice(start, start + TRACKS_PER_PAGE)
    })
  }, [tracks])

  const totalPages = Math.max(1, pages.length)
  const [currentPage, setCurrentPage] = useState(1)

  const {
    getTransform,
    handleMouseDown,
    handleMouseLeave,
    handleMouseMove,
    handleMouseUp,
    handlePageChange,
    handlePointerCancel,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    isDragging,
    isTransitioning
  } = useSwipePagination({
    currentPage,
    totalPages,
    onPageChange: setCurrentPage
  })

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const tracksIdentityKey = tracks.map(t => t.id).join(',')
  useEffect(() => {
    setCurrentPage(1)
  }, [tracksIdentityKey])

  return (
    <div sx={{ mb: 4 }}>
      <div sx={{ display: 'flex', flex: 1, alignItems: 'center' }}>
        <Heading as='h3' sx={{ fontSize: [3, 4] }}>
          Top Tracks
        </Heading>
      </div>

      <Themed.p>Tracks I&apos;ve played most over the last four weeks.</Themed.p>

      <div
        sx={{
          overflow: 'hidden',
          position: 'relative',
          width: '100%',
          maxWidth: '100%',
          pb: 4,
          mb: -4
        }}
      >
        {isLoading ? (
          <MediaItemGrid isLoading items={[]} onTrackClick={handleTrackClick} />
        ) : (
          <div
            data-testid='spotify-top-tracks-carousel'
            sx={{
              display: 'flex',
              width: `${totalPages * 100}%`,
              transform: getTransform(),
              transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: totalPages > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
              userSelect: 'none',
              touchAction: 'pan-y'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
          >
            {pages.map((pageItems, pageIndex) => (
              <div
                key={`spotify-top-tracks-page-${pageIndex + 1}`}
                aria-hidden={pageIndex !== currentPage - 1}
                data-testid={`spotify-top-tracks-page-${pageIndex + 1}`}
                sx={{
                  width: `${100 / totalPages}%`,
                  flexShrink: 0,
                  minWidth: 0,
                  boxSizing: 'border-box',
                  pr: 3,
                  pb: 1
                }}
              >
                <MediaItemGrid
                  interactionDisabled={isDragging || isTransitioning}
                  isLoading={false}
                  items={pageItems}
                  onTrackClick={handleTrackClick}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {!isLoading && totalPages > 1 ? (
        <Pagination currentPage={currentPage} onPageChange={handlePageChange} totalPages={totalPages} />
      ) : null}
    </div>
  )
}

export default TopTracks
