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
        const firstDayOfWeek = new Date(week.contributionDays[0].date)
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
        const date = new Date(day.date)
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

      // Clamp between 8px and 12px for optimal display
      // On mobile, this will be 8px and allow horizontal scrolling
      // On desktop, this will scale up to 12px if there's space
      const size = Math.max(8, Math.min(12, calculatedSize))
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
        <Card variant='actionCard'>
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

      <Card variant='actionCard'>
        <Themed.p sx={{ mb: 3 }}>{totalContributions} contributions in the last year</Themed.p>

        {/* Outer wrapper with explicit width constraint */}
        <Box
          sx={{
            width: '100%',
            maxWidth: '100%',
            overflow: 'hidden' // Critical: prevents inner content from expanding page
          }}
        >
          <Box
            sx={{
              display: 'flex',
              position: 'relative',
              pb: 3
            }}
          >
            {/* Day of week labels - fixed on the left, show Mon, Wed, Fri (GitHub week order: Sat, Sun, Mon, Tue, Wed, Thu, Fri) */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                mr: 2,
                fontSize: 0,
                color: 'textMuted',
                width: '40px',
                flexShrink: 0,
                pt: '21px' // Offset for month labels height
              }}
            >
              {[2, 4, 6].map(dayOfWeek => (
                <Box
                  key={dayOfWeek}
                  sx={{
                    height: `${cellSize}px`,
                    lineHeight: `${cellSize}px`,
                    textAlign: 'right',
                    pr: 1,
                    mb: 1 // Match grid gap
                  }}
                >
                  {['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'][dayOfWeek]}
                </Box>
              ))}
            </Box>

            {/* Scrollable container for month labels and contribution grid */}
            <Box
              ref={containerRef}
              sx={{
                overflowX: 'auto',
                overflowY: 'visible',
                flex: 1,
                minWidth: 0 // Allow flex item to shrink below content size
              }}
            >
              {/* Month labels */}
              <Box
                sx={{
                  position: 'relative',
                  height: '20px',
                  mb: 1
                }}
              >
                {monthLabels.map((month, idx) => (
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

              {/* Contribution grid */}
              {/* GitHub layout: columns = weeks, rows = days of week (Sat=1, Sun=2, Mon=3, ..., Fri=7) */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${weeksCount}, ${cellSize}px)`,
                  gridTemplateRows: 'repeat(7, 1fr)',
                  gap: 1
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

                  const date = new Date(day.date)
                  const formattedDate = date.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })

                  // Use the dayOfWeek from gridItems which already accounts for GitHub's week structure
                  // (Saturday=0, Sunday=1, Monday=2, ..., Friday=6)
                  const gridRow = dayOfWeek + 1

                  return (
                    <Box
                      key={key}
                      title={`${day.contributionCount} contribution${day.contributionCount !== 1 ? 's' : ''} on ${formattedDate}`}
                      sx={{
                        gridColumn: weekIndex + 1,
                        gridRow: gridRow, // Saturday=1, Sunday=2, Monday=3, ..., Friday=7
                        width: `${cellSize}px`,
                        height: `${cellSize}px`,
                        borderRadius: '2px',
                        bg: day.contributionCount === 0 ? (darkModeActive ? '#161b22' : '#ebedf0') : day.color,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        position: 'relative',
                        '&:hover': {
                          transform: 'scale(1.3)',
                          zIndex: 10,
                          boxShadow: darkModeActive ? '0 0 8px rgba(255, 255, 255, 0.3)' : '0 0 8px rgba(0, 0, 0, 0.2)',
                          borderRadius: '4px'
                        },
                        ...(day.contributionCount > 0 && {
                          animation: 'pulse 2s ease-in-out infinite',
                          animationDelay: `${(weekIndex * 7 + dayOfWeek) * 0.01}s`
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
    </Box>
  )
}

export default ContributionGraph
