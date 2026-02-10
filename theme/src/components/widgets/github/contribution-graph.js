/** @jsx jsx */
import { jsx, useThemeUI } from 'theme-ui'
import { Themed } from '@theme-ui/mdx'
import { Box, Card, Heading } from '@theme-ui/components'
import React, { useMemo, useRef, useEffect, useState } from 'react'
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
  const [isVisible, setIsVisible] = useState(false)

  // Intersection Observer to trigger animation when component comes into view
  useEffect(() => {
    if (!graphRef.current || isLoading || !contributionCalendar?.weeks?.length) return

    // Check if IntersectionObserver is available (not in some test environments)
    if (typeof IntersectionObserver === 'undefined') {
      // If not available, just show the component immediately
      setIsVisible(true)
      return
    }

    // eslint-disable-next-line no-undef
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true)
            observer.disconnect() // Only animate once
          }
        })
      },
      {
        threshold: 0.1, // Trigger when 10% of the component is visible
        rootMargin: '50px' // Start slightly before it comes into view
      }
    )

    observer.observe(graphRef.current)

    return () => observer.disconnect()
  }, [isLoading, contributionCalendar, isVisible])

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
        <Card variant='actionCard' style={{ overflow: 'hidden' }}>
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

      <Card variant='actionCard'>
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
              {[2, 4, 6].map((dayOfWeek, idx) => (
                <Box
                  key={dayOfWeek}
                  sx={{
                    position: 'absolute',
                    top: `${dayOfWeek * (cellSize + 4)}px`,
                    height: `${cellSize}px`,
                    lineHeight: `${cellSize}px`,
                    textAlign: 'right',
                    pr: 1,
                    width: '100%',
                    // Animate day labels with stagger
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateX(0)' : 'translateX(-10px)',
                    transition: `opacity 0.4s ease-out ${0.3 + idx * 0.1}s, transform 0.5s ease-out ${0.3 + idx * 0.1}s`
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
                      whiteSpace: 'nowrap',
                      // Animate month labels with stagger
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? 'translateY(0)' : 'translateY(-10px)',
                      transition: `opacity 0.4s ease-out ${idx * 0.1}s, transform 0.5s ease-out ${idx * 0.1}s`
                    }}
                  >
                    {month.label}
                  </Box>
                ))}
              </Box>

              {/* Contribution grid */}
              {/* GitHub layout: columns = weeks, rows = days of week (Sat=1, Sun=2, Mon=3, ..., Fri=7) */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${weeksCount}, ${cellSize}px)`,
                  gridTemplateRows: 'repeat(7, 1fr)',
                  gap: 1,
                  minWidth: 'max-content'
                  // No width property - let it size naturally, parent handles overflow
                }}
              >
                {gridItems.map(({ key, weekIndex, dayOfWeek, day }) => {
                  if (!day) {
                    return (
                      <Box
                        key={key}
                        sx={{
                          gridColumn: weekIndex + 1,
                          gridRow: dayOfWeek + 1
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

                  // Calculate staggered animation delay based on position
                  // Animate from left to right, with a slight diagonal effect
                  const animationDelay = isVisible ? `${weekIndex * 0.015 + dayOfWeek * 0.01}s` : '0s'

                  return (
                    <Box
                      key={key}
                      title={`${day.contributionCount} contribution${day.contributionCount !== 1 ? 's' : ''} on ${formattedDate}`}
                      className={isVisible ? 'cell-visible' : 'cell-hidden'}
                      sx={{
                        gridColumn: weekIndex + 1,
                        gridRow: gridRow, // Saturday=1, Sunday=2, Monday=3, ..., Friday=7
                        width: `${cellSize}px`,
                        height: `${cellSize}px`,
                        borderRadius: '2px',
                        bg: day.contributionCount === 0 ? (darkModeActive ? '#161b22' : '#ebedf0') : day.color,
                        cursor: 'pointer',
                        position: 'relative',
                        // Animation styles
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(10px)',
                        transition: `opacity 0.4s ease-out ${animationDelay}, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${animationDelay}`,
                        willChange: isVisible ? 'auto' : 'opacity, transform',
                        '&:hover': {
                          transform: 'scale(1.3)',
                          zIndex: 10,
                          boxShadow: darkModeActive ? '0 0 8px rgba(255, 255, 255, 0.3)' : '0 0 8px rgba(0, 0, 0, 0.2)',
                          borderRadius: '4px',
                          transition: 'all 0.2s ease' // Override animation transition on hover
                        },
                        ...(day.contributionCount > 0 &&
                          isVisible && {
                            animation: 'pulse 2s ease-in-out infinite',
                            animationDelay: `${(weekIndex * 7 + dayOfWeek) * 0.01 + 1}s` // Start pulse after fade-in
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
          <Box
            component='span'
            sx={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(-10px)',
              transition: 'opacity 0.4s ease-out 1.8s, transform 0.5s ease-out 1.8s'
            }}
          >
            Less
          </Box>
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
                        : ['#9be9a8', '#40c463', '#30a14e', '#216e39'][level - 1],
                  // Animate legend after grid cells
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.6) translateY(10px)',
                  transition: `opacity 0.4s ease-out ${2 + level * 0.1}s, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${2 + level * 0.1}s`
                }}
              />
            ))}
          </Box>
          <Box
            component='span'
            sx={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(10px)',
              transition: 'opacity 0.4s ease-out 2.5s, transform 0.5s ease-out 2.5s'
            }}
          >
            More
          </Box>
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
