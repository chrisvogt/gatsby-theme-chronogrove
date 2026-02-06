import React, { useMemo, useState, useCallback } from 'react'
import { Box, Flex, useThemeUI } from 'theme-ui'
import { useInView } from 'react-intersection-observer'
import careerData from '../src/data/career-path.json'
import { groupCareerByCompany } from '../src/utils/flattenCareerPath'
import isDarkMode from 'gatsby-theme-chronogrove/src/helpers/isDarkMode'

const NUM_SAMPLES = 200
const CIRCLE_R = 20
const STROKE_WIDTH = 4
const TIME_MIN = 2003
const TIME_MAX = 2026
const TIMELINE_HEIGHT = 25
const MARGIN = CIRCLE_R + STROKE_WIDTH + 8

/**
 * Optional logo images for career avatars. Add files to static/images/career-logos/
 * and map company name (exactly as in career-path.json) to path.
 * Falls back to initials when no logo is set.
 */
const CAREER_LOGOS = {
  'OfficeMax Print & Document Services': '/images/career-logos/officemax-impress.png',
  "FedEx Kinko's": '/images/career-logos/fedex-kinkos.gif',
  'Robert Half & TEKsystems': '/images/career-logos/robert-half.png',
  'Apogee Physicians': '/images/career-logos/apogee-physicians.jpg',
  'Encore Discovery Solutions': '/images/career-logos/encore-discovery-solutions.svg',
  'Salucro Healthcare Solutions': '/images/career-logos/salucro.svg',
  GoDaddy: '/images/career-logos/godaddy-logo.webp',
  'Art In Reality, LLC': '/images/career-logos/artinreality.png',
  'Pan Am Education': '/images/career-logos/pan-am-education.png'
}

/**
 * Cubic bezier point at t in [0,1].
 */
function bezierPoint(t, P0, P1, P2, P3) {
  const u = 1 - t
  const u2 = u * u
  const u3 = u2 * u
  const t2 = t * t
  const t3 = t2 * t
  return {
    x: u3 * P0.x + 3 * u2 * t * P1.x + 3 * u * t2 * P2.x + t3 * P3.x,
    y: u3 * P0.y + 3 * u2 * t * P1.y + 3 * u * t2 * P2.y + t3 * P3.y
  }
}

/**
 * Sample points along a tilted S-curve (two cubic beziers).
 * Returns array of { x, y } in 0..width, 0..height.
 */
function sampleSCurve(width, height, numSamples) {
  const w = width - 2 * MARGIN
  const h = height - 2 * MARGIN
  const ox = MARGIN
  const oy = MARGIN

  // Tilted S: start top-left, dip to center, end bottom-right
  // Segment 1: (0, 0.2h) -> (0.5w, 0.5h)
  const P0 = { x: 0, y: 0.2 * h }
  const P1 = { x: 0.25 * w, y: 0.2 * h }
  const P2 = { x: 0.25 * w, y: 0.8 * h }
  const P3 = { x: 0.5 * w, y: 0.5 * h }
  // Segment 2: (0.5w, 0.5h) -> (w, 0.8h)
  const P4 = { x: 0.5 * w, y: 0.5 * h }
  const P5 = { x: 0.75 * w, y: 0.2 * h }
  const P6 = { x: 0.75 * w, y: 0.8 * h }
  const P7 = { x: w, y: 0.8 * h }

  const points = []
  const half = Math.floor(numSamples / 2)
  for (let i = 0; i <= half; i++) {
    const t = i / half
    const p = bezierPoint(t, P0, P1, P2, P3)
    points.push({ x: ox + p.x, y: oy + p.y })
  }
  for (let i = 1; i <= half; i++) {
    const t = i / half
    const p = bezierPoint(t, P4, P5, P6, P7)
    points.push({ x: ox + p.x, y: oy + p.y })
  }
  return points
}

/**
 * Career as a tilted S-curve: one circle per company along the line,
 * line segments colored by path and tenure (opacity = time there).
 */
const CareerPathCurve = () => {
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [segmentIndex, setSegmentIndex] = useState(0)
  const [hoveredCompany, setHoveredCompany] = useState(null)
  const { colorMode } = useThemeUI()
  const darkModeActive = isDarkMode(colorMode)

  // Wait until component is in view before starting animations
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '50px'
  })

  const handleSelectCompany = company => {
    setSelectedCompany(prev => (prev === company ? null : company))
    setSegmentIndex(0)
  }

  const rows = useMemo(() => {
    const grouped = groupCareerByCompany(careerData)
    // Reverse segments within each company so most recent role is first
    return grouped.map(row => ({
      ...row,
      segments: [...row.segments].reverse()
    }))
  }, [])
  // Reverse so most recent (GoDaddy) is on the left; readers care more about recent roles
  const rowsOrdered = useMemo(() => [...rows].reverse(), [rows])

  const { points, width, height } = useMemo(() => {
    const width = 700
    const height = 320
    const pts = sampleSCurve(width, height, NUM_SAMPLES)
    return { points: pts, width, height }
  }, [])

  // Map years to x positions (reversed: most recent on left, oldest on right, matching logo order)
  const yearToX = useCallback(
    year => {
      const t = (year - TIME_MIN) / (TIME_MAX - TIME_MIN)
      // Reverse: 1-t so TIME_MAX maps to left (MARGIN), TIME_MIN maps to right (width-MARGIN)
      return MARGIN + (1 - t) * (width - 2 * MARGIN)
    },
    [width]
  )

  // Calculate date ranges for each company
  const companyDateRanges = useMemo(() => {
    const ranges = {}
    rows.forEach(row => {
      const starts = row.segments.map(s => s.startYear)
      const ends = row.segments.map(s => s.endYear)
      ranges[row.company] = {
        startYear: Math.min(...starts),
        endYear: Math.max(...ends),
        xStart: yearToX(Math.min(...starts)),
        xEnd: yearToX(Math.max(...ends))
      }
    })
    return ranges
  }, [rows, yearToX])

  const N = rowsOrdered.length
  const pathSegments = useMemo(() => {
    const segs = []
    const len = points.length
    for (let j = 0; j < N; j++) {
      const startIdx = Math.floor((j * len) / N)
      const endIdx = j === N - 1 ? len : Math.floor(((j + 1) * len) / N)
      const segmentPoints = points.slice(startIdx, endIdx + 1)
      if (segmentPoints.length < 2) continue
      const row = rowsOrdered[j]
      const pathColor = row.segments[0].pathColor
      const pathD = segmentPoints.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '')
      const pathLength = segmentPoints.reduce(
        (acc, p, i) => (i === 0 ? 0 : acc + Math.hypot(p.x - segmentPoints[i - 1].x, p.y - segmentPoints[i - 1].y)),
        0
      )
      segs.push({
        d: pathD,
        color: pathColor,
        opacity: 0.9,
        company: row.company,
        row,
        length: pathLength
      })
    }
    return segs
  }, [points, N, rowsOrdered])

  const circlePositions = useMemo(() => {
    const len = points.length
    return rowsOrdered.map((row, j) => {
      const idx = Math.floor(((j + 0.5) * len) / N)
      const p = points[Math.min(idx, len - 1)]
      return { x: p.x, y: p.y, company: row.company, row }
    })
  }, [points, N, rowsOrdered])

  const selectedRow = selectedCompany ? rows.find(r => r.company === selectedCompany) : null
  const safeIndex = selectedRow ? Math.min(segmentIndex, selectedRow.segments.length - 1) : 0
  const selectedSegment =
    selectedRow && selectedRow.segments[safeIndex]
      ? { company: selectedRow.company, ...selectedRow.segments[safeIndex] }
      : null
  const hasMultipleRoles = selectedRow && selectedRow.segments.length > 1
  const canPrev = hasMultipleRoles && safeIndex > 0
  const canNext = hasMultipleRoles && safeIndex < selectedRow.segments.length - 1

  const getInitials = company => {
    if (company === 'GoDaddy') return 'GD'
    const words = company.split(/\s+/)
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase()
    return company.slice(0, 2).toUpperCase()
  }

  return (
    <Box sx={{ width: '100%', py: 4 }} ref={ref}>
      {/* Full-width graph container; detail panel in upper-right when a company is selected */}
      <Box sx={{ position: 'relative', width: '100%' }}>
        <Box sx={{ width: '100%' }}>
          {/* Details or hint text at top - replaces hint when circle is selected */}
          <Box
            sx={{
              fontSize: [1, 2, 3],
              color: 'text',
              textAlign: 'center',
              maxWidth: '600px',
              mx: 'auto',
              minHeight: '180px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              mb: [-4, -4, -6]
            }}
          >
            {selectedSegment ? (
              <>
                <Box sx={{ fontWeight: 'bold', color: selectedSegment.pathColor, mb: 1, fontSize: [1, 2, 3, 4] }}>
                  {selectedSegment.title}
                </Box>
                {(selectedSegment.company || selectedSegment.dates) && (
                  <Box sx={{ fontSize: [0, 1, 2], color: 'textMuted', mb: 2 }}>
                    {selectedSegment.company && selectedSegment.dates
                      ? `${selectedSegment.company} • ${selectedSegment.dates}`
                      : selectedSegment.company || selectedSegment.dates}
                  </Box>
                )}
                {selectedSegment.description && (
                  <Box
                    sx={{
                      fontSize: [0, 1, 2],
                      color: 'textMuted',
                      fontStyle: 'italic',
                      lineHeight: 1.4,
                      mb: hasMultipleRoles ? 2 : 0
                    }}
                  >
                    {selectedSegment.description}
                  </Box>
                )}
                {hasMultipleRoles && (
                  <Flex sx={{ justifyContent: 'center', alignItems: 'center', gap: 1.5 }}>
                    <Box
                      as='button'
                      type='button'
                      onClick={() => setSegmentIndex(i => Math.max(0, i - 1))}
                      disabled={!canPrev}
                      sx={{
                        padding: '2px 6px',
                        border: 'none',
                        borderRadius: 1,
                        bg: darkModeActive ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                        color: canPrev ? 'text' : 'textMuted',
                        cursor: canPrev ? 'pointer' : 'not-allowed',
                        fontSize: 0
                      }}
                      aria-label='Previous role'
                    >
                      ←
                    </Box>
                    <Box sx={{ fontSize: 0, color: 'textMuted' }}>
                      {safeIndex + 1}/{selectedRow.segments.length}
                    </Box>
                    <Box
                      as='button'
                      type='button'
                      onClick={() => setSegmentIndex(i => Math.min(selectedRow.segments.length - 1, i + 1))}
                      disabled={!canNext}
                      sx={{
                        padding: '2px 6px',
                        border: 'none',
                        borderRadius: 1,
                        bg: darkModeActive ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                        color: canNext ? 'text' : 'textMuted',
                        cursor: canNext ? 'pointer' : 'not-allowed',
                        fontSize: 0
                      }}
                      aria-label='Next role'
                    >
                      →
                    </Box>
                  </Flex>
                )}
              </>
            ) : (
              <Box sx={{ color: 'textMuted', fontStyle: 'italic' }}>Click a circle to see details.</Box>
            )}
          </Box>

          <style>{`
            @keyframes career-draw-path {
              to { stroke-dashoffset: 0; }
            }
            @keyframes career-reveal-circle {
              from { opacity: 0; transform: scale(0.5); }
              to { opacity: 1; transform: scale(1); }
            }
          `}</style>
          <svg
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio='xMidYMid meet'
            sx={{ width: '100%', height: 'auto', display: 'block', mt: [-3, -2, -4] }}
          >
            <defs>
              <filter id='career-avatar-shadow' x='-50%' y='-50%' width='200%' height='200%'>
                <feDropShadow dx='0' dy='2' stdDeviation='3' floodOpacity={darkModeActive ? 0.4 : 0.25} />
              </filter>
            </defs>

            {/* Timeline nodes at bottom: date ranges aligned with each company's circle position */}
            <g>
              {/* Timeline baseline */}
              <line
                x1={MARGIN}
                y1={height - TIMELINE_HEIGHT}
                x2={width - MARGIN}
                y2={height - TIMELINE_HEIGHT}
                stroke={darkModeActive ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'}
                strokeWidth={1}
                opacity={selectedCompany ? 0.3 : 0.15}
              />

              {/* Date range nodes: one per company, aligned with circle positions */}
              {circlePositions.map(({ x, y, company, row }, index) => {
                const range = companyDateRanges[company]
                if (!range) return null
                const isSelected = selectedCompany === company
                const pathColor = row.segments[0].pathColor
                const dateText = `${range.startYear}–${range.endYear === 2026 ? 'Present' : range.endYear}`
                const timelineY = height - TIMELINE_HEIGHT

                // Last two circles (oldest companies) position text higher to avoid overlap
                const isLastTwo = index >= circlePositions.length - 2
                const textY = isLastTwo ? timelineY - 8 : timelineY + 14

                return (
                  <g key={`timeline-${company}`}>
                    {/* Connecting line from circle to timeline */}
                    <line
                      x1={x}
                      y1={y + CIRCLE_R}
                      x2={x}
                      y2={timelineY}
                      stroke={pathColor}
                      strokeWidth={isSelected ? 2 : 1}
                      strokeDasharray={isSelected ? 'none' : '2,2'}
                      opacity={isSelected ? 0.4 : 0.15}
                    />
                    {/* Date range node */}
                    <circle
                      cx={x}
                      cy={timelineY}
                      r={isSelected ? 4 : 3}
                      fill={pathColor}
                      opacity={isSelected ? 0.8 : 0.4}
                    />
                    <text
                      x={x}
                      y={textY}
                      textAnchor='middle'
                      fontSize={isSelected ? 9 : 8}
                      fontWeight={isSelected ? '600' : '400'}
                      fill={pathColor}
                      opacity={isSelected ? 1 : 0.5}
                      style={{ userSelect: 'none', pointerEvents: 'none' }}
                    >
                      {dateText}
                    </text>
                  </g>
                )
              })}
            </g>

            {/* Line segments: paint in sequence (stroke-dashoffset), then circles reveal */}
            {pathSegments.map((seg, i) => (
              <path
                key={i}
                d={seg.d}
                fill='none'
                stroke={seg.color}
                strokeWidth={STROKE_WIDTH}
                strokeLinecap='round'
                strokeLinejoin='round'
                opacity={seg.opacity}
                strokeDasharray={seg.length}
                strokeDashoffset={seg.length}
                style={{
                  ...(inView && {
                    animation: 'career-draw-path 0.55s ease-out forwards',
                    animationDelay: `${i * 0.4}s`
                  })
                }}
              />
            ))}

            {/* Circles: reveal (fade + scale) as each segment finishes painting */}
            {circlePositions.map(({ x, y, company, row }, i) => {
              const pathColor = row.segments[0].pathColor
              const isSelected = selectedCompany === company
              const isHovered = hoveredCompany === company
              const isLifted = isSelected || isHovered
              const logoSrc = CAREER_LOGOS[company]
              const clipId = `career-avatar-clip-${i}`
              const revealDelay = i * 0.4 + 0.28
              return (
                <g
                  key={company}
                  transform={`translate(${x}, ${y})${isLifted ? ' scale(1.05)' : ''}`}
                  style={{
                    cursor: 'pointer',
                    transition: 'transform 200ms ease-in-out'
                  }}
                  onClick={() => handleSelectCompany(company)}
                  onMouseEnter={() => setHoveredCompany(company)}
                  onMouseLeave={() => setHoveredCompany(null)}
                >
                  <g
                    style={{
                      ...(inView && {
                        animation: 'career-reveal-circle 0.4s ease-out forwards',
                        animationDelay: `${revealDelay}s`
                      }),
                      opacity: 0,
                      transformOrigin: '0 0'
                    }}
                  >
                    <circle
                      cx={0}
                      cy={0}
                      r={CIRCLE_R}
                      fill='#ffffff'
                      stroke={pathColor}
                      strokeWidth={isSelected ? 4 : 2}
                      opacity={1}
                      filter={isLifted ? 'url(#career-avatar-shadow)' : undefined}
                    />
                    {logoSrc ? (
                      <g>
                        <defs>
                          <clipPath id={clipId}>
                            <circle r={CIRCLE_R - 2} cx={0} cy={0} />
                          </clipPath>
                        </defs>
                        <image
                          href={logoSrc}
                          x={-CIRCLE_R + 2}
                          y={-CIRCLE_R + 2}
                          width={(CIRCLE_R - 2) * 2}
                          height={(CIRCLE_R - 2) * 2}
                          clipPath={`url(#${clipId})`}
                          preserveAspectRatio='xMidYMid meet'
                          style={{ pointerEvents: 'none' }}
                        />
                      </g>
                    ) : (
                      <text
                        x={0}
                        y={0}
                        textAnchor='middle'
                        dominantBaseline='central'
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          fill: pathColor,
                          pointerEvents: 'none',
                          userSelect: 'none'
                        }}
                      >
                        {getInitials(company)}
                      </text>
                    )}
                  </g>
                </g>
              )
            })}
          </svg>

          {/* Legend at bottom: colored lines to show path colors (matches graph order: Engineering → IT → Design) */}
          <Flex
            sx={{
              justifyContent: 'center',
              gap: [4, 5],
              mt: 3,
              flexWrap: 'wrap'
            }}
          >
            {[
              { name: 'Engineering', color: '#48bb78' },
              { name: 'IT', color: '#4299e1' },
              { name: 'Design', color: '#ed8936' }
            ].map(({ name, color }) => (
              <Flex key={name} sx={{ alignItems: 'center', gap: 1 }}>
                <Box
                  as='svg'
                  sx={{ width: 20, height: 3, flexShrink: 0 }}
                  viewBox='0 0 20 3'
                  preserveAspectRatio='none'
                >
                  <line
                    x1={0}
                    y1={1.5}
                    x2={20}
                    y2={1.5}
                    stroke={color}
                    strokeWidth={STROKE_WIDTH}
                    strokeLinecap='round'
                  />
                </Box>
                <Box as='span' sx={{ fontSize: 0, color: 'textMuted' }}>
                  {name}
                </Box>
              </Flex>
            ))}
          </Flex>
        </Box>
      </Box>
    </Box>
  )
}

export default CareerPathCurve
