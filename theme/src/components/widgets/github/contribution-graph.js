/** @jsx jsx */
import { jsx, useThemeUI } from 'theme-ui'
import { Themed } from '@theme-ui/mdx'
import { Box, Card, Heading } from '@theme-ui/components'
import React, { useMemo, useRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import isDarkMode from '../../../helpers/isDarkMode'

/**
 * ContributionGraph Component
 *
 * Renders a GitHub-style contribution calendar heatmap (flamechart)
 * showing the last 365 days of contributions. Each square represents a day,
 * with color intensity indicating contribution count.
 *
 * Layout matches GitHub exactly:
 * - Columns = weeks (left to right, oldest to newest)
 * - Rows = days of week (top to bottom: Saturday, Sunday, Monday, ..., Friday)
 * - GitHub weeks start on Saturday, not Sunday!
 */
const ContributionGraph = ({ isLoading, contributionCalendar }) => {
  const { colorMode } = useThemeUI()
  const darkModeActive = isDarkMode(colorMode)
  const containerRef = useRef(null)
  const graphRef = useRef(null)
  const [hoveredCell, setHoveredCell] = useState(null)

  // Calculate total days for cell size calculation
  const totalDays = useMemo(() => {
    if (!contributionCalendar?.weeks) return 0
    return contributionCalendar.weeks.reduce((sum, week) => sum + week.contributionDays.length, 0)
  }, [contributionCalendar])

  // Get month labels for the graph - show first week of each month
  const monthLabels = useMemo(() => {
    if (!contributionCalendar?.weeks) return []

    const months = []
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    let lastMonth = -1

    contributionCalendar.weeks.forEach((week, weekIndex) => {
      if (week.contributionDays.length > 0) {
        // Parse date string as local date to avoid timezone issues
        const [year, monthNum, dayOfMonth] = week.contributionDays[0].date.split('-').map(Number)
        const firstDayOfWeek = new Date(year, monthNum - 1, dayOfMonth)
        const month = firstDayOfWeek.getMonth()

        if (month !== lastMonth) {
          months.push({
            weekIndex,
            label: monthNames[month],
            date: week.contributionDays[0].date
          })
          lastMonth = month
        }
      }
    })

    return months
  }, [contributionCalendar])

  // Calculate responsive cell size
  const [cellSize, setCellSize] = useState(10)

  // Pre-calculate all grid items in correct order: row by row (day of week), then column by column (week)
  // GitHub's contribution calendar weeks start on SATURDAY, not Sunday!
  const gridItems = useMemo(() => {
    if (!contributionCalendar?.weeks) return []

    const items = []

    // Create a map for each week: dayOfWeek -> day data
    // Adjust dayOfWeek so Saturday=0, Sunday=1, ..., Friday=6 to match GitHub's week structure
    const weekMaps = contributionCalendar.weeks.map(week => {
      const map = {}
      week.contributionDays.forEach(day => {
        // Parse date string as local date to avoid timezone issues
        const [year, month, dayOfMonth] = day.date.split('-').map(Number)
        const date = new Date(year, month - 1, dayOfMonth)
        const dayOfWeek = date.getDay() // 0=Sun, 1=Mon, ..., 6=Sat
        // Convert to GitHub week: Sat=0, Sun=1, Mon=2, ..., Fri=6
        const githubDayOfWeek = dayOfWeek === 0 ? 1 : dayOfWeek === 6 ? 0 : dayOfWeek + 1
        map[githubDayOfWeek] = day
      })
      return map
    })

    // Iterate through each day of week (row) - Saturday=0 through Friday=6
    for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
      // For each week (column)
      weekMaps.forEach((weekMap, weekIndex) => {
        const day = weekMap[dayOfWeek]

        if (!day) {
          // Empty cell
          items.push({
            key: `empty-${weekIndex}-${dayOfWeek}`,
            weekIndex,
            dayOfWeek,
            day: null
          })
        } else {
          items.push({
            key: day.date,
            weekIndex,
            dayOfWeek,
            day
          })
        }
      })
    }

    return items
  }, [contributionCalendar?.weeks])

  useEffect(() => {
    if (!containerRef.current || !contributionCalendar?.weeks) return

    const updateCellSize = () => {
      const containerWidth = containerRef.current?.offsetWidth || 800
      const weeksCount = contributionCalendar.weeks.length
      const gap = 4 // Gap between cells in pixels
      const availableWidth = containerWidth - 16 // Small padding for scrollbar/margins
      const calculatedSize = Math.floor((availableWidth - (weeksCount - 1) * gap) / weeksCount)

      // Clamp at a minimum of 8px for mobile; allow growth on large screens to fill container
      const size = Math.max(8, calculatedSize)
      setCellSize(size)
    }

    updateCellSize()
    window.addEventListener('resize', updateCellSize)
    return () => window.removeEventListener('resize', updateCellSize)
  }, [contributionCalendar?.weeks?.length])

  if (isLoading || !contributionCalendar?.weeks?.length || totalDays === 0) {
    return (
      <Box sx={{ marginBottom: 4 }}>
        <Heading
          as='h3'
          sx={{
            mb: 3,
            fontSize: [3, 4]
          }}
        >
          Contribution Graph
        </Heading>
        <Card variant='presentationalCard' sx={{ overflow: 'hidden' }}>
          <Themed.p>Loading contribution data...</Themed.p>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(53, 1fr)',
              gap: 1,
              opacity: 0.5,
              p: 3
            }}
          >
            {Array.from({ length: 365 }).map((_, i) => (
              <Box
                key={i}
                sx={{
                  width: `${cellSize}px`,
                  height: `${cellSize}px`,
                  borderRadius: '2px',
                  bg: darkModeActive ? 'gray.8' : 'gray.2',
                  transition: 'all 0.2s ease'
                }}
              />
            ))}
          </Box>
        </Card>
      </Box>
    )
  }

  const totalContributions = contributionCalendar?.totalContributions || 0
  const weeksCount = contributionCalendar.weeks.length

  return (
    <Box sx={{ mt: 4, mb: 0 }}>
      <Heading
        as='h3'
        sx={{
          mb: 3
        }}
      >
        Contribution Graph
      </Heading>

      <Card variant='presentationalCard' sx={{ overflow: 'hidden' }}>
        <Themed.p sx={{ mb: 3 }}>{totalContributions} contributions in the last year</Themed.p>

        {/* Outer wrapper with explicit width constraint - inline styles prevent FOUC */}
        {/* Attach ref here for intersection observer */}
        <Box
          ref={graphRef}
          style={{
            width: '100%',
            maxWidth: '100%',
            overflow: 'hidden',
            minWidth: '0',
            contain: 'inline-size'
          }}
          sx={{
            width: '100%',
            maxWidth: '100%',
            overflow: 'hidden', // Critical: prevents inner content from expanding page
            minWidth: 0,
            contain: 'inline-size'
          }}
        >
          <Box
            style={{
              maxWidth: '100%',
              minWidth: '0',
              overflow: 'hidden',
              display: 'flex',
              position: 'relative'
            }}
            sx={{
              display: 'flex',
              position: 'relative',
              pb: 3,
              minWidth: 0,
              maxWidth: '100%',
              overflow: 'hidden'
            }}
          >
            {/* Day of week labels - fixed on the left, show Mon, Wed, Fri (GitHub week order: Sat, Sun, Mon, Tue, Wed, Thu, Fri) */}
            <Box
              sx={{
                position: 'relative',
                mr: 3,
                fontSize: 0,
                color: 'textMuted',
                width: '40px',
                flexShrink: 0,
                pt: '24px', // Offset for month labels height (20px) + gap (4px)
                height: `${7 * cellSize + 6 * 4}px` // Align container height with grid rows
              }}
            >
              {[2, 4, 6].map(dayOfWeek => (
                <Box
                  key={dayOfWeek}
                  sx={{
                    position: 'absolute',
                    top: `${dayOfWeek * (cellSize + 4)}px`,
                    height: `${cellSize}px`,
                    lineHeight: `${cellSize}px`,
                    textAlign: 'right',
                    pr: 1,
                    width: '100%'
                  }}
                >
                  {['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'][dayOfWeek]}
                </Box>
              ))}
            </Box>

            {/* Scrollable container for month labels and contribution grid - inline styles prevent FOUC */}
            <Box
              ref={containerRef}
              style={{
                overflowX: 'auto',
                overflowY: 'visible',
                minWidth: '0',
                maxWidth: '100%',
                flex: '1',
                WebkitOverflowScrolling: 'touch',
                contain: 'inline-size'
              }}
              sx={{
                overflowX: 'auto',
                overflowY: 'visible',
                flex: 1,
                minWidth: 0, // Allow flex item to shrink below content size
                maxWidth: '100%',
                WebkitOverflowScrolling: 'touch',
                contain: 'inline-size'
              }}
            >
              {/* Month labels */}
              <Box
                sx={{
                  position: 'relative',
                  height: '20px',
                  mb: 1,
                  minWidth: 0
                }}
              >
                {monthLabels.slice(0, -1).map((month, idx) => (
                  <Box
                    key={`${month.date}-${idx}`}
                    sx={{
                      position: 'absolute',
                      left: `${month.weekIndex * (cellSize + 4)}px`,
                      fontSize: 0,
                      color: 'textMuted',
                      fontWeight: 'normal',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {month.label}
                  </Box>
                ))}
              </Box>

              {/* Contribution grid: fixed row heights + top alignment so last (partial) column has no gap above it (GitHub behavior) */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${weeksCount}, ${cellSize}px)`,
                  gridTemplateRows: `repeat(7, ${cellSize}px)`,
                  gap: 1,
                  minWidth: 'max-content',
                  alignItems: 'start'
                }}
              >
                {gridItems.map(({ key, weekIndex, dayOfWeek, day }) => {
                  if (!day) {
                    return (
                      <Box
                        key={key}
                        sx={{
                          gridColumn: weekIndex + 1,
                          gridRow: dayOfWeek + 1,
                          width: `${cellSize}px`,
                          height: `${cellSize}px`,
                          minHeight: `${cellSize}px`
                        }}
                      />
                    )
                  }

                  // Parse date string as local date to avoid timezone issues
                  // Date strings in YYYY-MM-DD format are parsed as UTC, which can shift
                  // the day when converted to local time. Parse manually to ensure consistency.
                  const [year, month, dayOfMonth] = day.date.split('-').map(Number)
                  const date = new Date(year, month - 1, dayOfMonth)
                  const formattedDate = date.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })

                  // Use the dayOfWeek from gridItems which already accounts for GitHub's week structure
                  // (Saturday=0, Sunday=1, Monday=2, ..., Friday=6)
                  const gridRow = dayOfWeek + 1

                  const hasContributions = day.contributionCount > 0
                  const contributionText = hasContributions
                    ? `${day.contributionCount} contribution${day.contributionCount !== 1 ? 's' : ''}`
                    : 'No contributions'

                  return (
                    <Box
                      key={key}
                      title={`${contributionText} on ${formattedDate}`}
                      className='cell-visible'
                      onMouseEnter={e => {
                        if (hasContributions) {
                          setHoveredCell({
                            contributionText,
                            formattedDate,
                            x: e.clientX,
                            y: e.clientY
                          })
                        }
                      }}
                      onMouseLeave={() => setHoveredCell(null)}
                      sx={{
                        gridColumn: weekIndex + 1,
                        gridRow: gridRow, // Saturday=1, Sunday=2, Monday=3, ..., Friday=7
                        alignSelf: 'start',
                        width: `${cellSize}px`,
                        height: `${cellSize}px`,
                        borderRadius: '2px',
                        bg: day.contributionCount === 0 ? (darkModeActive ? '#161b22' : '#ebedf0') : day.color,
                        position: 'relative',
                        cursor: hasContributions ? 'pointer' : 'default',
                        overflow: 'hidden',
                        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                        // Shimmer + hover effect only for cells with contributions
                        ...(hasContributions && {
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            inset: 0,
                            borderRadius: '2px',
                            background:
                              'linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0.15) 55%, transparent 100%)',
                            backgroundSize: '200% 100%',
                            backgroundPosition: '200% 0',
                            opacity: 0,
                            transition: 'opacity 0.25s ease, background-position 0.6s ease',
                            pointerEvents: 'none'
                          },
                          '&:hover': {
                            boxShadow: darkModeActive
                              ? '0 0 0 2px rgba(255,255,255,0.25), 0 0 12px rgba(255,255,255,0.08)'
                              : '0 0 0 2px rgba(0,0,0,0.12), 0 0 12px rgba(0,0,0,0.08)',
                            transform: 'scale(1.12)',
                            zIndex: 5,
                            '&::after': {
                              opacity: 1,
                              backgroundPosition: '-100% 0'
                            }
                          },
                          animation: 'pulse 2s ease-in-out infinite',
                          animationDelay: `${(weekIndex * 7 + dayOfWeek) * 0.01 + 1}s`
                        })
                      }}
                    />
                  )
                })}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Legend */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mt: 3,
            ml: '40px', // Match day labels width
            fontSize: 0,
            color: 'textMuted'
          }}
        >
          <Box component='span'>Less</Box>
          <Box
            sx={{
              display: 'flex',
              gap: 1
            }}
          >
            {[0, 1, 2, 3, 4].map(level => (
              <Box
                key={level}
                sx={{
                  width: `${cellSize}px`,
                  height: `${cellSize}px`,
                  borderRadius: '2px',
                  bg:
                    level === 0
                      ? darkModeActive
                        ? '#161b22'
                        : '#ebedf0'
                      : darkModeActive
                        ? ['#0e4429', '#006d32', '#26a641', '#39d353'][level - 1]
                        : ['#9be9a8', '#40c463', '#30a14e', '#216e39'][level - 1]
                }}
              />
            ))}
          </Box>
          <Box component='span'>More</Box>
        </Box>
      </Card>

      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.8;
            }
          }
        `}
      </style>

      {/* Hover popover: only for cells with contributions; theme-matched panel */}
      {hoveredCell &&
        typeof document !== 'undefined' &&
        createPortal(
          <Box
            role='tooltip'
            sx={{
              position: 'fixed',
              left: hoveredCell.x + 12,
              top: hoveredCell.y + 12,
              zIndex: 1000,
              pointerEvents: 'none',
              px: 2,
              py: 2,
              fontSize: 1,
              whiteSpace: 'nowrap',
              color: 'text',
              bg: 'var(--theme-ui-colors-panel-background)',
              backdropFilter: 'blur(12px) saturate(150%)',
              WebkitBackdropFilter: 'blur(12px) saturate(150%)',
              border: '1px solid',
              borderColor: 'var(--theme-ui-colors-panel-divider)',
              borderRadius: 'card',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0,0,0,0.04)'
            }}
          >
            <strong>{hoveredCell.contributionText}</strong>
            <br />
            {hoveredCell.formattedDate}
          </Box>,
          document.body
        )}
    </Box>
  )
}

// Wrap with React.memo to prevent unnecessary re-renders
// Only re-render if isLoading or contributionCalendar changes
export default React.memo(ContributionGraph, (prevProps, nextProps) => {
  return (
    prevProps.isLoading === nextProps.isLoading && prevProps.contributionCalendar === nextProps.contributionCalendar
  )
})
