import React, { useMemo, useState } from 'react'
import { Box, Flex, useThemeUI } from 'theme-ui'
import careerData from '../src/data/career-path.json'
import { groupCareerByCompany } from '../src/utils/flattenCareerPath'
import isDarkMode from 'gatsby-theme-chronogrove/src/helpers/isDarkMode'

const NUM_SAMPLES = 200
const CIRCLE_R = 20
const STROKE_WIDTH = 4

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
  const margin = CIRCLE_R + STROKE_WIDTH + 8
  const w = width - 2 * margin
  const h = height - 2 * margin
  const ox = margin
  const oy = margin

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
  const { colorMode } = useThemeUI()
  const darkModeActive = isDarkMode(colorMode)

  const handleSelectCompany = company => {
    setSelectedCompany(prev => (prev === company ? null : company))
    setSegmentIndex(0)
  }

  const rows = useMemo(() => groupCareerByCompany(careerData), [])

  const { points, width, height } = useMemo(() => {
    const width = 700
    const height = 320
    const pts = sampleSCurve(width, height, NUM_SAMPLES)
    return { points: pts, width, height }
  }, [])

  const N = rows.length
  const segmentOpacity = useMemo(() => {
    const maxYears = Math.max(
      ...rows.map(row => {
        const starts = row.segments.map(s => s.startYear)
        const ends = row.segments.map(s => s.endYear)
        return Math.max(...ends) - Math.min(...starts)
      })
    )
    return row => {
      const starts = row.segments.map(s => s.startYear)
      const ends = row.segments.map(s => s.endYear)
      const years = Math.max(...ends) - Math.min(...starts)
      return 0.5 + 0.5 * (years / Math.max(maxYears, 1))
    }
  }, [rows])

  const pathSegments = useMemo(() => {
    const segs = []
    const len = points.length
    for (let j = 0; j < N; j++) {
      const startIdx = Math.floor((j * len) / N)
      const endIdx = j === N - 1 ? len : Math.floor(((j + 1) * len) / N)
      const segmentPoints = points.slice(startIdx, endIdx + 1)
      if (segmentPoints.length < 2) continue
      const row = rows[j]
      const pathColor = row.segments[0].pathColor
      const opacity = segmentOpacity(row)
      segs.push({
        d: segmentPoints.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), ''),
        color: pathColor,
        opacity,
        company: row.company,
        row
      })
    }
    return segs
  }, [points, N, rows, segmentOpacity])

  const circlePositions = useMemo(() => {
    const len = points.length
    return rows.map((row, j) => {
      const idx = Math.floor(((j + 0.5) * len) / N)
      const p = points[Math.min(idx, len - 1)]
      return { x: p.x, y: p.y, company: row.company, row }
    })
  }, [points, N, rows])

  const selectedRow = selectedCompany ? rows.find(r => r.company === selectedCompany) : null
  const safeIndex = selectedRow ? Math.min(segmentIndex, selectedRow.segments.length - 1) : 0
  const selectedSegment =
    selectedRow && selectedRow.segments[safeIndex]
      ? { company: selectedRow.company, ...selectedRow.segments[safeIndex] }
      : null
  const hasMultipleRoles = selectedRow && selectedRow.segments.length > 1
  const canPrev = hasMultipleRoles && safeIndex > 0
  const canNext = hasMultipleRoles && safeIndex < selectedRow.segments.length - 1

  const detailPanelStyles = {
    position: 'absolute',
    top: [2, 3],
    right: [2, 3],
    background: 'panel-background',
    borderRadius: 12,
    boxShadow: darkModeActive ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 24px rgba(0,0,0,0.12)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    padding: [2, 3],
    maxWidth: '320px',
    maxHeight: '85%',
    overflow: 'auto'
  }

  const getInitials = company => {
    if (company === 'GoDaddy') return 'GD'
    const words = company.split(/\s+/)
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase()
    return company.slice(0, 2).toUpperCase()
  }

  return (
    <Box sx={{ width: '100%', py: 4 }}>
      {/* Full-width graph container; detail panel in upper-right when a company is selected */}
      <Box sx={{ position: 'relative', width: '100%' }}>
        <Box sx={{ width: '100%' }}>
          <svg
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio='xMidYMid meet'
            style={{ width: '100%', height: 'auto', display: 'block' }}
          >
            {/* Line segments: color = path, opacity = tenure */}
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
              />
            ))}

            {/* Circles (company avatars): logo image if in CAREER_LOGOS, else initials */}
            {circlePositions.map(({ x, y, company, row }, i) => {
              const pathColor = row.segments[0].pathColor
              const isSelected = selectedCompany === company
              const logoSrc = CAREER_LOGOS[company]
              const clipId = `career-avatar-clip-${i}`
              return (
                <g key={company} style={{ cursor: 'pointer' }} onClick={() => handleSelectCompany(company)}>
                  <circle
                    cx={x}
                    cy={y}
                    r={CIRCLE_R}
                    fill='#ffffff'
                    stroke={pathColor}
                    strokeWidth={isSelected ? 4 : 2}
                    opacity={1}
                  />
                  {logoSrc ? (
                    <g transform={`translate(${x}, ${y})`}>
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
                      x={x}
                      y={y}
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
              )
            })}
          </svg>

          <Box sx={{ mt: 3, fontSize: 1, color: 'textMuted', fontStyle: 'italic', textAlign: 'center' }}>
            Click a circle to see details. Line opacity reflects time at each role.
          </Box>

          {/* Detail panel in upper-right (over the graph) when a company is selected */}
          {selectedSegment && (
            <Box sx={detailPanelStyles} role='region' aria-labelledby='career-detail-title'>
              <Flex
                sx={{
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 2,
                  pb: 2,
                  borderBottom: '1px solid',
                  borderColor: darkModeActive ? 'rgba(74, 158, 255, 0.25)' : 'rgba(66, 46, 163, 0.25)'
                }}
              >
                <Flex sx={{ alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: '4px',
                      height: '24px',
                      borderRadius: '2px',
                      mr: 2,
                      bg: selectedSegment.pathColor
                    }}
                  />
                  <Box>
                    <Box sx={{ fontSize: 0, color: darkModeActive ? '#888' : '#666', fontWeight: 'medium', mb: 1 }}>
                      {selectedSegment.company}
                    </Box>
                    <Box
                      id='career-detail-title'
                      sx={{
                        fontSize: 2,
                        fontWeight: 'bold',
                        color: darkModeActive ? '#4a9eff' : '#422EA3',
                        lineHeight: 'tight'
                      }}
                    >
                      {selectedSegment.title}
                    </Box>
                  </Box>
                </Flex>
                <Box
                  onClick={() => {
                    setSelectedCompany(null)
                    setSegmentIndex(0)
                  }}
                  sx={{
                    cursor: 'pointer',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: darkModeActive ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
                    color: darkModeActive ? '#e2e8f0' : '#4a5568',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    flexShrink: 0,
                    '&:hover': { backgroundColor: darkModeActive ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)' }
                  }}
                >
                  ×
                </Box>
              </Flex>
              {hasMultipleRoles && (
                <Flex sx={{ alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box
                    as='button'
                    type='button'
                    onClick={() => setSegmentIndex(i => Math.max(0, i - 1))}
                    disabled={!canPrev}
                    sx={{
                      padding: 1,
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
                    {safeIndex + 1} of {selectedRow.segments.length}
                  </Box>
                  <Box
                    as='button'
                    type='button'
                    onClick={() => setSegmentIndex(i => Math.min(selectedRow.segments.length - 1, i + 1))}
                    disabled={!canNext}
                    sx={{
                      padding: 1,
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
              {selectedSegment.dates && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                    fontSize: 0,
                    color: darkModeActive ? '#aaa' : '#777',
                    fontWeight: 'medium'
                  }}
                >
                  <Box sx={{ mr: 2 }}>📅</Box>
                  {selectedSegment.dates}
                </Box>
              )}
              {selectedSegment.description && (
                <Box
                  sx={{
                    fontSize: 0,
                    color: 'textMuted',
                    lineHeight: 'relaxed',
                    fontStyle: 'italic',
                    background: darkModeActive ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                    borderRadius: 2,
                    padding: 2,
                    border: darkModeActive ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.08)'
                  }}
                >
                  {selectedSegment.description}
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default CareerPathCurve
