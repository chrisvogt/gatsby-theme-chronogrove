/** @jsx jsx */
import { jsx, useThemeUI } from 'theme-ui'
import { Box, Card, Heading, Select } from '@theme-ui/components'
import { Themed } from '@theme-ui/mdx'
import { useState, useRef, useEffect, useMemo } from 'react'
import isDarkMode from '../../../helpers/isDarkMode'
import Pagination from '../../pagination'
import useSwipePagination from '../../../hooks/use-swipe-pagination'
import DiscogsModal from './discogs-modal'
import VinylRecordSkeleton from './vinyl-record-skeleton'
import {
  DEFAULT_DISCOGS_SORT_MODE,
  DISCOGS_SORT_ADDED,
  DISCOGS_SORT_ALPHABETICAL,
  DISCOGS_SORT_ALPHABETICAL_ARTIST,
  DISCOGS_SORT_RELEASE_YEAR,
  getDiscogsReleaseYear,
  sortDiscogsReleases
} from './sort-discogs-releases'

const DISCOGS_SORT_OPTIONS = [
  { value: DISCOGS_SORT_ADDED, label: 'Date added (newest first)' },
  { value: DISCOGS_SORT_RELEASE_YEAR, label: 'Release year (newest first)' },
  { value: DISCOGS_SORT_ALPHABETICAL, label: 'Album title (A–Z)' },
  { value: DISCOGS_SORT_ALPHABETICAL_ARTIST, label: 'Artist (A–Z)' }
]

const DISCOGS_VIEW_GRID = 'grid'
const DISCOGS_VIEW_LIST = 'list'
const DEFAULT_DISCOGS_VIEW_MODE = DISCOGS_VIEW_GRID

/** List layout: fewer records per carousel slide than the old dense list (chunk = columns × this). Matches grid rows (2) for similar page counts. */
const LIST_ROWS_PER_PAGE = 2

/** Widest breakpoint column count; used only for skeleton slot counts during loading */
const MAX_VINYL_GRID_COLUMNS = 5

const VinylCollection = ({ isLoading, releases = [] }) => {
  const { colorMode, theme } = useThemeUI()
  const darkModeActive = isDarkMode(colorMode)
  const [currentVinylId, setCurrentVinylId] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [exitingVinylId, setExitingVinylId] = useState(null)
  const leaveTimeoutRef = useRef(null)

  // Modal state
  const [selectedRelease, setSelectedRelease] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [collectionSortMode, setCollectionSortMode] = useState(DEFAULT_DISCOGS_SORT_MODE)
  const [collectionViewMode, setCollectionViewMode] = useState(DEFAULT_DISCOGS_VIEW_MODE)
  const sortControlsDisabled = isLoading || !releases.length
  const viewControlsDisabled = sortControlsDisabled

  const sortedReleases = useMemo(
    () => sortDiscogsReleases(Array.isArray(releases) ? releases : [], collectionSortMode),
    [releases, collectionSortMode]
  )

  const primaryHex = typeof theme?.colors?.primary === 'string' ? theme.colors.primary : '#422EA3'
  const primaryRgb = theme?.colors?.primaryRgb ?? '66, 46, 163'

  const makeToggleSx = disabled => active => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: ['10px', '11px'],
    fontWeight: active ? 'bold' : 'body',
    lineHeight: 1.25,
    px: 2,
    py: '4px',
    minHeight: ['24px', '28px'],
    borderRadius: '6px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    outline: 'none',
    opacity: disabled ? 0.5 : 1,
    border: active ? `1px solid ${primaryHex}` : `1px solid rgba(${primaryRgb}, 0.25)`,
    color: active ? 'white' : primaryHex,
    bg: active ? primaryHex : `rgba(${primaryRgb}, 0.1)`,
    transition: 'background 0.2s ease, color 0.2s ease, border-color 0.2s ease, transform 0.15s ease',
    '&:hover:not(:disabled)': {
      bg: active ? primaryHex : `rgba(${primaryRgb}, 0.2)`,
      transform: darkModeActive ? 'none' : 'scale(1.02)'
    },
    '&:focus-visible:not(:disabled)': {
      boxShadow: `0 0 0 2px rgba(${primaryRgb}, 0.35)`
    },
    '&:active:not(:disabled)': {
      transform: 'scale(0.98)'
    }
  })

  const viewToggleSx = makeToggleSx(viewControlsDisabled)

  const sortSelectSx = useMemo(
    () => ({
      fontSize: ['11px', 1],
      fontWeight: 'body',
      lineHeight: 1.25,
      px: 2,
      py: '6px',
      minHeight: ['28px', '30px'],
      borderRadius: '6px',
      border: `1px solid rgba(${primaryRgb}, 0.35)`,
      color: 'text',
      bg: darkModeActive ? 'rgba(0,0,0,0.25)' : `rgba(${primaryRgb}, 0.08)`,
      cursor: sortControlsDisabled ? 'not-allowed' : 'pointer',
      outline: 'none',
      opacity: sortControlsDisabled ? 0.5 : 1,
      width: ['100%', 'auto'],
      minWidth: ['100%', 'min(100%, 260px)', '272px'],
      maxWidth: '100%',
      fontFamily: 'body',
      transition: 'background 0.2s ease, border-color 0.2s ease, box-shadow 0.15s ease',
      '&:focus-visible:not(:disabled)': {
        boxShadow: `0 0 0 2px rgba(${primaryRgb}, 0.35)`
      },
      '&:disabled': {
        cursor: 'not-allowed'
      }
    }),
    [primaryRgb, darkModeActive, sortControlsDisabled]
  )

  /** Carousel slides: grid = columns × 2 rows; list = same chunk size (`columns × 2`) inside a bordered “register” scroll. */
  const GRID_ROWS_PER_PAGE = 2
  const LOADING_PAGE_COUNT = 3

  const columnsPerBreakpoint = [3, 4, 4, 5, 5]
  const [currentBreakpointIndex, setCurrentBreakpointIndex] = useState(4) // Default to largest breakpoint

  const paginationData = useMemo(() => {
    const currentColumns = columnsPerBreakpoint[currentBreakpointIndex]
    const itemsPerRow = currentColumns
    const logicalItemsPerPage =
      collectionViewMode === DISCOGS_VIEW_LIST ? itemsPerRow * LIST_ROWS_PER_PAGE : itemsPerRow * GRID_ROWS_PER_PAGE

    const skeletonItemsPerPage =
      collectionViewMode === DISCOGS_VIEW_LIST
        ? MAX_VINYL_GRID_COLUMNS * LIST_ROWS_PER_PAGE
        : MAX_VINYL_GRID_COLUMNS * GRID_ROWS_PER_PAGE

    const itemsOnLastPage = sortedReleases.length % logicalItemsPerPage
    const hasPartialLastPage = itemsOnLastPage > 0 && itemsOnLastPage < itemsPerRow

    const totalPages =
      isLoading && !sortedReleases.length
        ? LOADING_PAGE_COUNT
        : Math.ceil(sortedReleases.length / logicalItemsPerPage) || 1

    return {
      currentColumns,
      itemsPerRow,
      logicalItemsPerPage,
      skeletonItemsPerPage,
      totalPages,
      hasPartialLastPage,
      itemsOnLastPage: itemsOnLastPage || logicalItemsPerPage
    }
  }, [currentBreakpointIndex, sortedReleases.length, isLoading, collectionViewMode])

  const { logicalItemsPerPage, skeletonItemsPerPage, totalPages } = paginationData

  // Detect current breakpoint based on window width
  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth
      let breakpointIndex

      if (width < 640) {
        breakpointIndex = 0 // Mobile: 3 columns
      } else if (width < 768) {
        breakpointIndex = 1 // Small: 4 columns
      } else if (width < 1024) {
        breakpointIndex = 2 // Medium: 4 columns
      } else if (width < 1280) {
        breakpointIndex = 3 // Large: 5 columns
      } else {
        breakpointIndex = 4 // XL (≥1280): 5 columns
      }

      setCurrentBreakpointIndex(breakpointIndex)
    }

    updateBreakpoint()
    window.addEventListener('resize', updateBreakpoint)
    return () => window.removeEventListener('resize', updateBreakpoint)
  }, [])

  // Adjust current page if it becomes invalid after breakpoint change
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  // Reset page when pagination capacity changes (logical items per carousel slide differs by breakpoint,
  // grid vs list, etc.), not arbitrary Theme UI breakpoint index—for example xl large vs xl ≥1280 are both
  // five columns in grid mode and previously shared identical density.
  // Sort mode always resets to avoid showing the wrong slide’s items.
  useEffect(() => {
    setCurrentPage(1)
  }, [logicalItemsPerPage, collectionSortMode])

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

  // Modal handlers
  const handleVinylClick = release => {
    if (isDragging || isTransitioning) return
    setSelectedRelease(release)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedRelease(null)
  }

  const vinylItems = sortedReleases.map(release => {
    const { id, basicInformation = {} } = release
    const { title, artists = [], cdnThumbUrl, resourceUrl } = basicInformation || {}
    const artistName = (artists || []).map(artist => artist.name).join(', ')
    const ry = getDiscogsReleaseYear(release)
    const displayYear = Number.isFinite(ry) ? String(ry) : ''
    const details = `${title || 'Unknown'} (${displayYear || 'Unknown'}) - ${artistName || 'Unknown Artist'}`

    return {
      id,
      title,
      displayYear,
      artistName,
      cdnThumbUrl,
      resourceUrl,
      details
    }
  })

  // Split items into pages; when loading assume LOADING_PAGE_COUNT full pages so carousel/pagination space is reserved
  const pages = []
  if (isLoading && !vinylItems.length) {
    for (let p = 0; p < LOADING_PAGE_COUNT; p++) {
      pages.push(Array.from({ length: skeletonItemsPerPage }, (_, i) => ({ _placeholder: true, id: `ph-p${p}-${i}` })))
    }
  } else {
    for (let i = 0; i < totalPages; i++) {
      const start = i * logicalItemsPerPage
      const end = Math.min(start + logicalItemsPerPage, vinylItems.length)
      pages.push(vinylItems.slice(start, end))
    }
  }

  return (
    <div sx={{ mb: 4, maxWidth: '100%', overflow: 'hidden' }}>
      <Box
        sx={{
          alignItems: 'baseline',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
          mb: 2,
          display: 'flex'
        }}
      >
        <Heading as='h3' sx={{ fontSize: [3, 4], mb: 0 }}>
          Vinyl Collection
        </Heading>
        <Box
          sx={{
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: [2, 3],
            display: 'flex',
            justifyContent: 'flex-end',
            flex: 1
          }}
        >
          <Box
            sx={{
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: ['8px', 2],
              display: 'flex',
              flex: ['1 1 100%', '0 1 auto'],
              justifyContent: ['stretch', 'flex-end']
            }}
          >
            <Box
              as='label'
              htmlFor='vinyl-collection-sort-select'
              sx={{
                fontSize: [0, 1],
                fontWeight: 'medium',
                color: 'text',
                flexShrink: 0,
                userSelect: 'none'
              }}
            >
              Sort by
            </Box>
            <Select
              id='vinyl-collection-sort-select'
              value={collectionSortMode}
              onChange={e => setCollectionSortMode(e.target.value)}
              disabled={sortControlsDisabled}
              sx={sortSelectSx}
            >
              {DISCOGS_SORT_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </Box>
          <Box
            role='radiogroup'
            aria-label='Vinyl collection layout'
            sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1, display: 'flex' }}
          >
            <span
              sx={{ fontSize: [0, 1], fontWeight: 'medium', mr: [0, 1], color: 'text' }}
              id='vinyl-collection-view-label'
            >
              View:
            </span>
            <Box
              as='button'
              type='button'
              aria-label='Show vinyl collection as a grid'
              aria-pressed={collectionViewMode === DISCOGS_VIEW_GRID}
              disabled={viewControlsDisabled}
              sx={viewToggleSx(collectionViewMode === DISCOGS_VIEW_GRID)}
              onClick={() => setCollectionViewMode(DISCOGS_VIEW_GRID)}
            >
              Grid
            </Box>
            <Box
              as='button'
              type='button'
              aria-label='Show vinyl collection as a list'
              aria-pressed={collectionViewMode === DISCOGS_VIEW_LIST}
              disabled={viewControlsDisabled}
              sx={viewToggleSx(collectionViewMode === DISCOGS_VIEW_LIST)}
              onClick={() => setCollectionViewMode(DISCOGS_VIEW_LIST)}
            >
              List
            </Box>
          </Box>
        </Box>
      </Box>

      <Themed.p sx={{ mt: 0 }}>My owned vinyl records from Discogs.</Themed.p>

      {/* Carousel Container */}
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
        <div
          data-testid='vinyl-carousel'
          sx={{
            display: 'flex',
            width: `${totalPages * 100}%`,
            transform: getTransform(),
            transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: isDragging ? 'grabbing' : 'grab',
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
              key={pageIndex}
              sx={{
                width: `${100 / totalPages}%`,
                flexShrink: 0,
                minWidth: 0,
                boxSizing: 'border-box',
                overflowX: 'clip',
                overflowY: 'visible',
                pr: 3,
                pb: 1
              }}
            >
              {collectionViewMode === DISCOGS_VIEW_LIST ? (
                <Box
                  key={`list-${currentBreakpointIndex}-${pageIndex}`}
                  className={`vinyl-collection_list${currentVinylId ? ' vinyl-collection_list--interacting' : ''}`}
                  sx={t => ({
                    width: `calc(100% + ${t.space[3]})`,
                    maxWidth: 'none',
                    boxSizing: 'border-box',
                    bg: darkModeActive ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.92)',
                    border: '1px solid',
                    borderColor: darkModeActive ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)',
                    borderRadius: '1px',
                    overflow: 'hidden',
                    '& > *:not(:last-of-type)': {
                      borderBottom: '1px solid',
                      borderBottomColor: darkModeActive ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.075)'
                    }
                  })}
                >
                  {isLoading
                    ? pageItems.map(({ id }) => (
                        <VinylRecordSkeleton key={id} variant='list' darkModeActive={darkModeActive} />
                      ))
                    : pageItems.map(({ id, title, displayYear, artistName, cdnThumbUrl, details }) => {
                        const release = sortedReleases.find(r => r.id === id)
                        return (
                          <Box
                            key={id}
                            as='button'
                            type='button'
                            title={details}
                            aria-label={`${details}. Click to view details.`}
                            tabIndex={0}
                            disabled={sortControlsDisabled}
                            onClick={() => handleVinylClick(release)}
                            onKeyDown={e => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                handleVinylClick(release)
                              }
                            }}
                            sx={{
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                              gap: [2, 3],
                              py: [10, '11px', '12px'],
                              px: [2, 3],
                              width: '100%',
                              margin: 0,
                              bg: 'transparent',
                              cursor: 'pointer',
                              color: 'text',
                              fontFamily: 'body',
                              fontSize: ['14px', 1],
                              lineHeight: 1.25,
                              textAlign: 'left',
                              border: 'none',
                              borderRadius: 0,
                              boxShadow: 'none',
                              outline: 'none',
                              appearance: 'none',
                              transition: 'background-color 0.12s ease',
                              '&:hover': {
                                bg: isDragging
                                  ? 'transparent'
                                  : darkModeActive
                                    ? 'rgba(255,255,255,0.05)'
                                    : 'rgba(0,0,0,0.035)'
                              },
                              '&:focus-visible': {
                                zIndex: 1,
                                outline: '2px solid',
                                outlineOffset: '-2px',
                                outlineColor: 'primary'
                              }
                            }}
                          >
                            <Themed.div
                              className='vinyl-record vinyl-record--list-thumb'
                              aria-hidden
                              sx={{
                                width: ['44px', '50px', '52px'],
                                height: ['44px', '50px', '52px'],
                                flexShrink: 0,
                                borderRadius: '50%',
                                overflow: 'hidden',
                                position: 'relative',
                                boxShadow: 'none'
                              }}
                            >
                              <div
                                sx={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  height: '100%',
                                  width: '100%',
                                  position: 'relative',
                                  borderRadius: '50%',
                                  background: 'linear-gradient(45deg, #1a1a1a 0%, #2d2d2d 100%)',
                                  border: '2px solid #333',
                                  '@media (max-width: 639px)': {
                                    border: '1px solid #333'
                                  }
                                }}
                              >
                                <div
                                  className='vinyl-record_image'
                                  sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    borderRadius: '50%',
                                    background: 'linear-gradient(45deg, #1a1a1a 0%, #2d2d2d 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    '&::before': {
                                      content: '""',
                                      position: 'absolute',
                                      top: '50%',
                                      left: '50%',
                                      transform: 'translate(-50%, -50%)',
                                      width: '20%',
                                      height: '20%',
                                      borderRadius: '50%',
                                      background: '#000',
                                      boxShadow: 'inset 0 0 6px rgba(0,0,0,0.8)',
                                      zIndex: 3
                                    },
                                    '&::after': {
                                      content: '""',
                                      position: 'absolute',
                                      top: 0,
                                      left: 0,
                                      right: 0,
                                      bottom: 0,
                                      borderRadius: '50%',
                                      background: `repeating-conic-gradient(
                                        from 0deg,
                                        transparent 0deg,
                                        transparent 2deg,
                                        rgba(255, 255, 255, 0.05) 2deg,
                                        rgba(255, 255, 255, 0.05) 4deg
                                      )`,
                                      zIndex: 1
                                    }
                                  }}
                                >
                                  {cdnThumbUrl && (
                                    <Themed.img
                                      alt=''
                                      crossOrigin='anonymous'
                                      loading='lazy'
                                      src={cdnThumbUrl}
                                      sx={{
                                        width: '70%',
                                        height: '70%',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        position: 'relative',
                                        zIndex: 2,
                                        border: '1px solid rgba(255, 255, 255, 0.1)'
                                      }}
                                    />
                                  )}
                                </div>
                              </div>
                            </Themed.div>
                            <Themed.div
                              sx={{
                                flex: 1,
                                minWidth: 0,
                                textAlign: 'left',
                                display: 'grid',
                                gap: '4px'
                              }}
                            >
                              <Themed.div
                                sx={{
                                  fontWeight: '600',
                                  color: 'text',
                                  letterSpacing: ['-0.01em', '-0.015em'],
                                  wordBreak: 'break-word'
                                }}
                              >
                                {title || 'Unknown'}
                              </Themed.div>
                              <Themed.div
                                sx={{
                                  color: 'muted',
                                  fontSize: [0, 0, 1],
                                  fontVariantNumeric: 'tabular-nums',
                                  lineHeight: 1.35,
                                  opacity: 0.95
                                }}
                              >
                                {artistName || 'Unknown Artist'}
                                {displayYear !== '' ? ` · ${displayYear}` : ''}
                              </Themed.div>
                            </Themed.div>
                          </Box>
                        )
                      })}
                </Box>
              ) : (
                <div
                  key={`grid-${currentBreakpointIndex}-${pageIndex}`}
                  className={`vinyl-collection_grid ${currentVinylId ? 'vinyl-collection_grid--interacting' : null}`}
                  sx={t => ({
                    display: 'grid',
                    gridGap: [1, 2, 2, 3],
                    gridTemplateColumns: [
                      'repeat(3, 1fr)',
                      'repeat(4, 1fr)',
                      'repeat(4, 1fr)',
                      'repeat(5, 1fr)',
                      'repeat(5, 1fr)'
                    ],
                    // Fill slide width including pr shadow gutter (negative mr does not widen 1fr tracks).
                    width: `calc(100% + ${t.space[3]})`,
                    maxWidth: 'none',
                    boxSizing: 'border-box',
                    minHeight: 'auto',
                    height: 'auto'
                  })}
                >
                  {isLoading
                    ? pageItems.map(({ id }) => <VinylRecordSkeleton key={id} darkModeActive={darkModeActive} />)
                    : pageItems.map(({ id, title, displayYear, artistName, cdnThumbUrl, details }) => {
                        const release = sortedReleases.find(r => r.id === id)
                        return (
                          <Card
                            key={id}
                            variant='actionCard'
                            sx={{
                              p: [0.5, 1, 2, 3],
                              minWidth: 0,
                              boxSizing: 'border-box',
                              height: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                              transition: 'transform 0.2s ease-in-out',
                              '&:hover': {
                                transform: isDragging ? 'none' : 'translateY(-4px)'
                              }
                            }}
                          >
                            <Themed.div
                              className={`vinyl-record${currentVinylId === id ? ' vinyl-record--focused' : ''}${
                                exitingVinylId === id ? ' vinyl-record--exiting' : ''
                              }`}
                              onMouseEnter={() => {
                                if (leaveTimeoutRef.current) {
                                  clearTimeout(leaveTimeoutRef.current)
                                  leaveTimeoutRef.current = null
                                }
                                setExitingVinylId(null)
                                if (!isDragging) setCurrentVinylId(id)
                              }}
                              onMouseLeave={() => {
                                if (leaveTimeoutRef.current) {
                                  clearTimeout(leaveTimeoutRef.current)
                                }
                                // Delay clearing focus to allow overlay fade-out without flashing center text
                                const delay = process.env.NODE_ENV === 'test' ? 0 : 220
                                if (delay === 0) {
                                  // Synchronous for tests to avoid timing assertions
                                  setCurrentVinylId(false)
                                  setExitingVinylId(null)
                                  return
                                }
                                setExitingVinylId(id)
                                leaveTimeoutRef.current = setTimeout(() => {
                                  setCurrentVinylId(false)
                                  setExitingVinylId(null)
                                  leaveTimeoutRef.current = null
                                }, delay)
                              }}
                              onClick={() => handleVinylClick(release)}
                              onKeyDown={e => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault()
                                  handleVinylClick(release)
                                }
                              }}
                              title={details}
                              aria-label={`${details}. Click to view details.`}
                              tabIndex={0}
                              role='button'
                              sx={{
                                display: 'block',
                                position: 'relative',
                                height: '100%',
                                width: '100%',
                                transition: 'all 300ms ease-in-out',
                                transform: 'translateY(0) scale(1)',
                                cursor: 'pointer',
                                '&:hover': {
                                  transform: isDragging ? 'translateY(0) scale(1)' : 'translateY(-4px) scale(1.05)',
                                  boxShadow: isDragging ? 'none' : 'xl',
                                  // Reduce hover effects on mobile to prevent overflow
                                  '@media (max-width: 639px)': {
                                    transform: isDragging ? 'translateY(0) scale(1)' : 'translateY(-2px) scale(1.02)',
                                    boxShadow: isDragging ? 'none' : 'md'
                                  },
                                  // Further reduce hover effects on very small screens to prevent overflow
                                  '@media (max-width: 515px)': {
                                    transform: isDragging ? 'translateY(0) scale(1)' : 'translateY(-1px) scale(1.01)',
                                    boxShadow: isDragging ? 'none' : 'sm'
                                  }
                                },
                                '&:focus': {
                                  outline: '2px solid',
                                  outlineColor: 'primary',
                                  outlineOffset: '2px',
                                  // Reduce focus outline on mobile to prevent overflow
                                  '@media (max-width: 639px)': {
                                    outlineOffset: '1px'
                                  },
                                  // Further reduce focus outline on very small screens
                                  '@media (max-width: 515px)': {
                                    outline: '1px solid',
                                    outlineOffset: '1px'
                                  }
                                },
                                borderRadius: '50%',
                                overflow: 'hidden',
                                aspectRatio: '1/1',
                                '&.vinyl-record--focused .vinyl-record_caption': {
                                  opacity: isDragging ? 0 : 1
                                },
                                '&.vinyl-record--focused .vinyl-record_orbit': {
                                  opacity: isDragging ? 0 : 1
                                },
                                '&.vinyl-record--exiting .vinyl-record_orbit': {
                                  opacity: 0,
                                  transition: 'opacity 0.2s ease-in-out'
                                },
                                '&.vinyl-record--exiting .vinyl-record_album-art': {
                                  // Keep spinning during exit fade so orbit and record feel synchronized
                                  animation: 'recordSpin 16s linear infinite',
                                  animationPlayState: isDragging ? 'paused' : 'running'
                                },
                                '&.vinyl-record--focused .vinyl-record_caption span': {
                                  display: 'none'
                                },
                                '&.vinyl-record--focused .vinyl-record_album-art': {
                                  animation: 'recordSpin 16s linear infinite',
                                  animationPlayState: isDragging ? 'paused' : 'running'
                                },
                                '@keyframes recordSpin': {
                                  '0%': { transform: 'rotate(0deg)' },
                                  '100%': { transform: 'rotate(360deg)' }
                                },
                                '@media (prefers-reduced-motion: reduce)': {
                                  '&.vinyl-record--focused .vinyl-record_album-art': {
                                    animation: 'none !important'
                                  }
                                }
                              }}
                            >
                              <div
                                sx={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  height: '100%',
                                  width: '100%',
                                  position: 'relative',
                                  borderRadius: '50%',
                                  background: 'linear-gradient(45deg, #1a1a1a 0%, #2d2d2d 100%)',
                                  border: '2px solid #333',
                                  // Reduce border on mobile to prevent overflow
                                  '@media (max-width: 639px)': {
                                    border: '1px solid #333'
                                  }
                                }}
                              >
                                {/* Vinyl record with album art */}
                                <div
                                  className='vinyl-record_image'
                                  sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    borderRadius: '50%',
                                    transition: 'transform 0.5s ease-in-out',
                                    background: 'linear-gradient(45deg, #1a1a1a 0%, #2d2d2d 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    '&::before': {
                                      content: '""',
                                      position: 'absolute',
                                      top: '50%',
                                      left: '50%',
                                      transform: 'translate(-50%, -50%)',
                                      width: '20%',
                                      height: '20%',
                                      borderRadius: '50%',
                                      background: '#000',
                                      boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)',
                                      zIndex: 3
                                    },
                                    '&::after': {
                                      content: '""',
                                      position: 'absolute',
                                      top: 0,
                                      left: 0,
                                      right: 0,
                                      bottom: 0,
                                      borderRadius: '50%',
                                      background: `repeating-conic-gradient(
                                  from 0deg,
                                  transparent 0deg,
                                  transparent 2deg,
                                  rgba(255, 255, 255, 0.05) 2deg,
                                  rgba(255, 255, 255, 0.05) 4deg
                                )`,
                                      zIndex: 1
                                    }
                                  }}
                                >
                                  {cdnThumbUrl && (
                                    <Themed.img
                                      className='vinyl-record_album-art'
                                      alt={`${title} album cover`}
                                      crossOrigin='anonymous'
                                      loading='lazy'
                                      src={cdnThumbUrl}
                                      sx={{
                                        width: '70%',
                                        height: '70%',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        position: 'relative',
                                        zIndex: 2,
                                        border: '1px solid rgba(255, 255, 255, 0.1)'
                                      }}
                                    />
                                  )}
                                </div>

                                {/* Hover caption (ring overlay) */}
                                <Themed.div
                                  className='vinyl-record_caption'
                                  sx={{
                                    color: 'white',
                                    fontSize: [0, 1, 1, 1],
                                    fontWeight: 'bold',
                                    opacity: 0,
                                    transition: 'opacity 0.3s ease-in-out',
                                    alignItems: 'center',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    position: 'absolute',
                                    textAlign: 'center',
                                    padding: 2,
                                    top: 0,
                                    right: 0,
                                    bottom: 0,
                                    left: 0,
                                    background: 'rgba(0, 0, 0, 0.75)',
                                    borderRadius: '50%',
                                    // Create a ring by masking out the center so the vinyl image shows through
                                    maskImage: 'radial-gradient(circle at center, transparent 0 52%, black 56% 100%)',
                                    WebkitMaskImage:
                                      'radial-gradient(circle at center, transparent 0 52%, black 56% 100%)',
                                    zIndex: 4
                                  }}
                                >
                                  {/* Visually hidden caption for screen readers */}
                                  <span
                                    sx={{
                                      position: 'absolute',
                                      width: '1px',
                                      height: '1px',
                                      padding: 0,
                                      margin: '-1px',
                                      overflow: 'hidden',
                                      clip: 'rect(0, 0, 0, 0)',
                                      whiteSpace: 'nowrap',
                                      border: 0
                                    }}
                                  >
                                    {details}
                                  </span>

                                  {/* Orbiting text is always rendered; visibility controlled via focus class */}
                                  <Themed.div
                                    className='vinyl-record_orbit'
                                    sx={{
                                      position: 'absolute',
                                      top: 0,
                                      left: 0,
                                      right: 0,
                                      bottom: 0,
                                      borderRadius: '50%',
                                      pointerEvents: 'none',
                                      color: 'white',
                                      opacity: 0,
                                      transition: 'opacity 0.3s ease-in-out',
                                      zIndex: 5,
                                      '@keyframes orbitSpin': {
                                        '0%': { transform: 'rotate(0deg)' },
                                        '100%': { transform: 'rotate(360deg)' }
                                      },
                                      '@media (prefers-reduced-motion: reduce)': {
                                        '& svg g': {
                                          animation: 'none !important'
                                        }
                                      }
                                    }}
                                  >
                                    <svg
                                      viewBox='0 0 100 100'
                                      width='100%'
                                      height='100%'
                                      role='presentation'
                                      aria-hidden='true'
                                      style={{ display: 'block' }}
                                    >
                                      <defs>
                                        <path
                                          id={`textCircle-${id}`}
                                          d='M50,50 m0,-44 a44,44 0 1,1 0,88 a44,44 0 1,1 0,-88'
                                        />
                                      </defs>
                                      <g
                                        sx={{
                                          transformOrigin: '50% 50%',
                                          animation: 'orbitSpin 16s linear infinite',
                                          animationPlayState: isDragging ? 'paused' : 'running'
                                        }}
                                      >
                                        <text
                                          fill='currentColor'
                                          sx={{
                                            fontFamily: 'heading',
                                            fontSize: '4px',
                                            letterSpacing: '0.6px',
                                            textTransform: 'uppercase'
                                          }}
                                        >
                                          <textPath
                                            href={`#textCircle-${id}`}
                                            startOffset='0%'
                                            method='align'
                                            spacing='auto'
                                          >
                                            {`${title || 'Unknown'} • ${artistName || 'Unknown Artist'} • ${displayYear || 'Unknown Year'} • ${title || 'Unknown'} • ${artistName || 'Unknown Artist'} • ${displayYear || 'Unknown Year'} • `}
                                          </textPath>
                                        </text>
                                      </g>
                                    </svg>
                                  </Themed.div>
                                </Themed.div>
                              </div>
                            </Themed.div>
                          </Card>
                        )
                      })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Pagination: skeleton when loading so scroll-to-section doesn't drift */}
      {isLoading ? (
        <div sx={{ mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }} aria-hidden>
          <div
            sx={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              bg: darkModeActive ? 'gray.8' : 'gray.2',
              opacity: 0.5
            }}
          />
          <div
            sx={{
              width: '120px',
              height: '32px',
              borderRadius: '4px',
              bg: darkModeActive ? 'gray.8' : 'gray.2',
              opacity: 0.5
            }}
          />
          <div
            sx={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              bg: darkModeActive ? 'gray.8' : 'gray.2',
              opacity: 0.5
            }}
          />
        </div>
      ) : totalPages > 1 ? (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          variant='primary'
          size='medium'
        />
      ) : null}

      {/* Modal */}
      <DiscogsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        release={selectedRelease}
        orderedReleases={sortedReleases}
        onSelectRelease={setSelectedRelease}
      />
    </div>
  )
}

export default VinylCollection
