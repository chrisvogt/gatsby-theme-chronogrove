import React, { useMemo, useState } from 'react'
import { Box, Flex, useThemeUI } from 'theme-ui'
import careerData from '../src/data/career-path.json'
import { groupCareerByCompany } from '../src/utils/flattenCareerPath'
import isDarkMode from 'gatsby-theme-chronogrove/src/helpers/isDarkMode'

const TIME_MIN = 2003
const TIME_MAX = 2026

/**
 * Career timeline: one row per job, multiple bars per row (Design / IT / Engineering).
 * Same data as CareerPathVisualization, same click-to-detail panel.
 */
const CareerTimeline = () => {
  const [selectedSegment, setSelectedSegment] = useState(null)
  const { colorMode } = useThemeUI()
  const darkModeActive = isDarkMode(colorMode)

  const rows = useMemo(() => groupCareerByCompany(careerData), [])

  const timeToPercent = year => ((year - TIME_MIN) / (TIME_MAX - TIME_MIN)) * 100
  const barLeft = seg => timeToPercent(seg.startYear)
  const barWidth = seg => timeToPercent(seg.endYear) - timeToPercent(seg.startYear)

  const containerStyles = {
    background: 'panel-background',
    borderRadius: '16px',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    boxShadow: darkModeActive ? '0 8px 32px rgba(0,0,0,0.3)' : '0 8px 32px rgba(0,0,0,0.1)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    maxWidth: ['95%', '85%', '90%'],
    marginX: 'auto',
    display: 'flex',
    flexDirection: ['column', 'column', selectedSegment ? 'row' : 'column'],
    alignItems: ['center', 'center', selectedSegment ? 'flex-start' : 'center'],
    gap: [0, 0, 4],
    padding: [2, 3, 4]
  }

  const infoPanelStyles = {
    background: 'panel-background',
    borderRadius: ['12px', '16px'],
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    boxShadow: darkModeActive ? '0 8px 32px rgba(0,0,0,0.3)' : '0 8px 32px rgba(0,0,0,0.1)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    padding: [3, 4],
    mt: [4, 4, 0],
    width: ['100%', '100%', '300px'],
    flexShrink: 0,
    '@keyframes slideUpFadeIn': {
      '0%': { opacity: 0, transform: 'translateY(20px)' },
      '100%': { opacity: 1, transform: 'translateY(0)' }
    },
    animation: 'slideUpFadeIn 0.4s ease-out',
    transition: 'all 0.3s ease'
  }

  return (
    <Box sx={{ width: '100%', py: 4 }}>
      <Box sx={containerStyles}>
        <Box
          sx={{
            width: ['100%', '100%', selectedSegment ? 'calc(100% - 300px - 32px)' : '100%'],
            minWidth: 0
          }}
        >
          {/* Path legend */}
          <Flex sx={{ gap: 4, mb: 3, flexWrap: 'wrap', fontSize: 0 }}>
            {[
              { name: 'Design', color: '#ed8936' },
              { name: 'IT', color: '#4299e1' },
              { name: 'Engineering', color: '#48bb78' }
            ].map(({ name, color }) => (
              <Flex key={name} sx={{ alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: 1, bg: color }} />
                <Box as='span' sx={{ color: 'textMuted' }}>
                  {name}
                </Box>
              </Flex>
            ))}
          </Flex>

          {/* Year axis */}
          <Flex
            sx={{
              justifyContent: 'space-between',
              px: [1, 2],
              mb: 2,
              fontSize: 0,
              color: darkModeActive ? '#718096' : '#4a5568',
              fontWeight: '600'
            }}
          >
            {[2003, 2008, 2013, 2018, 2023].map(y => (
              <Box key={y}>{y}</Box>
            ))}
          </Flex>

          {/* Timeline track: one row per job, multiple bars (Design/IT/Engineering) per row */}
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              minHeight: `${rows.length * 44}px`
            }}
          >
            {rows.map(row => (
              <Flex
                key={row.company}
                sx={{
                  alignItems: 'center',
                  gap: 2,
                  py: 1,
                  minHeight: 40,
                  borderBottom: '1px solid',
                  borderColor: darkModeActive ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                  '&:last-of-type': { borderBottom: 'none' },
                  borderRadius: 1,
                  px: 1,
                  '&:hover': {
                    bg: darkModeActive ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'
                  }
                }}
              >
                <Box
                  sx={{
                    flexShrink: 0,
                    width: ['90px', '110px'],
                    fontSize: [0, 1],
                    color: 'text',
                    fontWeight: 500,
                    lineHeight: 1.3
                  }}
                >
                  {row.company}
                </Box>
                <Box
                  sx={{
                    flex: 1,
                    position: 'relative',
                    height: 24,
                    borderRadius: 1,
                    bg: darkModeActive ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                    overflow: 'hidden'
                  }}
                >
                  {row.segments.map(seg => {
                    const isSelected =
                      selectedSegment &&
                      selectedSegment.company === row.company &&
                      selectedSegment.title === seg.title &&
                      selectedSegment.startYear === seg.startYear
                    return (
                      <Box
                        key={`${seg.title}-${seg.startYear}`}
                        sx={{
                          position: 'absolute',
                          left: `${barLeft(seg)}%`,
                          width: `${Math.max(barWidth(seg), 3)}%`,
                          height: '100%',
                          borderRadius: 1,
                          bg: seg.pathColor,
                          opacity: isSelected ? 1 : 0.88,
                          cursor: 'pointer',
                          transition: 'opacity 0.2s',
                          border: isSelected
                            ? darkModeActive
                              ? '2px solid rgba(255,255,255,0.5)'
                              : '2px solid rgba(0,0,0,0.2)'
                            : '2px solid transparent',
                          '&:hover': { opacity: 1 }
                        }}
                        title={`${seg.title} · ${seg.dates}`}
                        onClick={e => {
                          e.stopPropagation()
                          setSelectedSegment(isSelected ? null : { company: row.company, ...seg })
                        }}
                      />
                    )
                  })}
                </Box>
              </Flex>
            ))}
          </Box>

          <Box sx={{ mt: 3, fontSize: 1, color: 'textMuted', fontStyle: 'italic' }}>Click a bar to see details.</Box>
        </Box>

        {selectedSegment && (
          <Box sx={infoPanelStyles}>
            <Flex
              sx={{
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 3,
                pb: 3,
                borderBottom: '2px solid',
                borderColor: darkModeActive ? 'rgba(74, 158, 255, 0.3)' : 'rgba(66, 46, 163, 0.3)'
              }}
            >
              <Flex sx={{ alignItems: 'center' }}>
                <Box
                  sx={{
                    width: '6px',
                    height: '32px',
                    borderRadius: '3px',
                    mr: 3,
                    bg: selectedSegment.pathColor
                  }}
                />
                <Box>
                  {selectedSegment.title && selectedSegment.company && (
                    <Box
                      sx={{ fontSize: '14px', color: darkModeActive ? '#888' : '#666', fontWeight: 'medium', mb: 1 }}
                    >
                      {selectedSegment.company}
                    </Box>
                  )}
                  <Box
                    sx={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: darkModeActive ? '#4a9eff' : '#422EA3',
                      lineHeight: 'tight'
                    }}
                  >
                    {selectedSegment.title || selectedSegment.company}
                  </Box>
                </Box>
              </Flex>
              <Box
                onClick={() => setSelectedSegment(null)}
                sx={{
                  cursor: 'pointer',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: darkModeActive ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                  color: darkModeActive ? '#e2e8f0' : '#4a5568',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: darkModeActive ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                    transform: 'scale(1.1)'
                  }
                }}
              >
                ×
              </Box>
            </Flex>
            {selectedSegment.dates && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 3,
                  fontSize: '14px',
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
                  fontSize: '14px',
                  color: 'textMuted',
                  lineHeight: 'relaxed',
                  fontStyle: 'italic',
                  background: darkModeActive ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '8px',
                  padding: 3,
                  border: darkModeActive ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)'
                }}
              >
                {selectedSegment.description}
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default CareerTimeline
