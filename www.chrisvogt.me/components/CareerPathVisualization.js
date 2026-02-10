import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Box, useThemeUI } from 'theme-ui'
import * as d3 from 'd3'
import careerData from '../src/data/career-path.json'
import isDarkMode from 'gatsby-theme-chronogrove/src/helpers/isDarkMode'

const CareerPathVisualization = () => {
  const svgRef = useRef(null)
  const containerRef = useRef(null)
  const [selectedNode, setSelectedNode] = useState(null)
  const { colorMode } = useThemeUI()
  const darkModeActive = isDarkMode(colorMode)

  // Helper function to truncate text based on screen size
  const getTruncatedText = (text, maxLength) => {
    if (!text) return ''
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength - 3) + '...'
  }

  // Helper function to get abbreviated company names
  const getAbbreviatedName = (name, isSmallScreen = false) => {
    const abbreviations = {
      'OfficeMax Print & Document Services': isSmallScreen ? 'OfficeMax' : 'OfficeMax Print & Doc',
      "FedEx Kinko's": "FedEx Kinko's",
      'Robert Half & TEKsystems': isSmallScreen ? 'Robert Half/TEK' : 'Robert Half & TEK',
      'Apogee Physicians': 'Apogee',
      'Encore Discovery Solutions': isSmallScreen ? 'Encore' : 'Encore Discovery',
      'Pan Am Education': 'Pan Am',
      'Salucro Healthcare Solutions': isSmallScreen ? 'Salucro' : 'Salucro Healthcare',
      'Art In Reality, LLC': isSmallScreen ? 'Art In Reality' : 'Art In Reality'
    }
    return abbreviations[name] || name
  }

  const createVisualization = useCallback(() => {
    if (!svgRef.current || !containerRef.current) return

    // Clear previous visualization
    d3.select(svgRef.current).selectAll('*').remove()

    const container = containerRef.current
    const containerWidth = container.offsetWidth || 800
    const isMobile = containerWidth < 768
    const margin = {
      top: isMobile ? 40 : 50,
      right: isMobile ? 20 : 30, // Reduced from 60 to 30
      bottom: isMobile ? 40 : 50,
      left: isMobile ? 20 : 40 // Reduced from 60 to 40 for timeline space
    }

    // Better responsive width calculation with increased height (13% taller)
    const width = Math.max(isMobile ? 300 : 500, containerWidth - (isMobile ? 20 : 40)) - margin.left - margin.right
    const height = Math.min(isMobile ? 565 : 735, Math.max(452, window.innerHeight * 0.5)) - margin.top - margin.bottom
    const isSmallScreen = width < 600

    const svg = d3
      .select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    // Create hierarchical layout with more spacing
    const root = d3.hierarchy(careerData)
    const treeLayout = d3
      .tree()
      .size([width, height])
      .separation((a, b) => {
        // Increase separation between nodes
        if (a.parent === b.parent) {
          return isSmallScreen ? 1.5 : 2
        }
        return isSmallScreen ? 2 : 3
      })

    treeLayout(root)

    // Create time scale - INVERTED (latest years at top) with extended range
    const timeScale = d3.scaleLinear().domain([2003, 2026]).range([height, 0])

    // Adjust node positions based on time
    root.descendants().forEach(node => {
      if (node.data.startYear) {
        node.y = timeScale(node.data.startYear)
      } else if (node.data.type === 'path' && node.children && node.children.length > 0) {
        // Position path nodes at the time of their earliest job
        const earliestYear = Math.min(...node.children.map(child => child.data.startYear || 2026))
        node.y = timeScale(earliestYear)
      }
    })

    // Create curved links
    const linkGenerator = d3
      .linkVertical()
      .x(d => d.x)
      .y(d => d.y)

    // Create gradient definitions for cross-path connections
    const defs = svg.append('defs')

    // Define gradients for path transitions
    const gradients = [
      { id: 'it-to-design', start: '#4299e1', end: '#ed8936' },
      { id: 'it-to-engineering', start: '#4299e1', end: '#48bb78' }
    ]

    gradients.forEach(grad => {
      const gradient = defs
        .append('linearGradient')
        .attr('id', grad.id)
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '100%')
        .attr('y2', '0%')

      gradient.append('stop').attr('offset', '0%').attr('stop-color', grad.start).attr('stop-opacity', 0.8)

      gradient.append('stop').attr('offset', '100%').attr('stop-color', grad.end).attr('stop-opacity', 0.8)
    })

    // Draw regular tree links
    g.selectAll('.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', linkGenerator)
      .style('fill', 'none')
      .style('stroke', d => {
        const pathNode = d.target.ancestors().find(ancestor => ancestor.data.type === 'path')
        return pathNode ? pathNode.data.color : '#999'
      })
      .style('stroke-width', d => {
        if (d.target.data.type === 'path') return 4
        if (d.target.data.name === 'GoDaddy') return 3
        return 2
      })
      .style('opacity', 0.8)

    // Find and draw cross-path connections
    const allNodes = root.descendants()
    const jobNodes = allNodes.filter(d => d.data.type === 'job')

    // Group job nodes by company name
    const companiesByName = {}
    jobNodes.forEach(node => {
      const companyName = node.data.name
      if (!companiesByName[companyName]) {
        companiesByName[companyName] = []
      }
      companiesByName[companyName].push(node)
    })

    // Create cross-path connections for companies that appear in multiple paths
    Object.entries(companiesByName).forEach(([, nodes]) => {
      if (nodes.length > 1) {
        // Sort nodes by start year to connect them chronologically
        nodes.sort((a, b) => a.data.startYear - b.data.startYear)

        for (let i = 0; i < nodes.length - 1; i++) {
          const sourceNode = nodes[i]
          const targetNode = nodes[i + 1]

          // Determine gradient based on paths
          const sourcePath = sourceNode.ancestors().find(a => a.data.type === 'path')
          const targetPath = targetNode.ancestors().find(a => a.data.type === 'path')

          let gradientId = 'it-to-design'
          if (sourcePath?.data.name === 'IT Path' && targetPath?.data.name === 'Engineering Path') {
            gradientId = 'it-to-engineering'
          }

          // Create curved connection
          const connectionPath = d3.path()
          const midX = (sourceNode.x + targetNode.x) / 2
          const midY = (sourceNode.y + targetNode.y) / 2
          const controlY = midY - Math.abs(targetNode.x - sourceNode.x) * 0.3

          connectionPath.moveTo(sourceNode.x, sourceNode.y)
          connectionPath.quadraticCurveTo(midX, controlY, targetNode.x, targetNode.y)

          g.append('path')
            .attr('class', 'cross-path-link')
            .attr('d', connectionPath.toString())
            .style('fill', 'none')
            .style('stroke', `url(#${gradientId})`)
            .style('stroke-width', 3)
            .style('stroke-dasharray', '5,5')
            .style('opacity', 0.7)
        }
      }
    })

    // Create nodes
    const nodes = g
      .selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .style('cursor', 'pointer')
      .on('click', (_, d) => {
        setSelectedNode(d.data)
      })
      .on('mouseover', function () {
        d3.select(this).select('circle').style('stroke-width', 4)
      })
      .on('mouseout', function () {
        d3.select(this).select('circle').style('stroke-width', 2)
      })

    // Add circles for nodes - adjusted sizes
    nodes
      .append('circle')
      .attr('r', d => {
        if (d.data.type === 'path') return isSmallScreen ? 6 : 8
        if (d.data.name === 'GoDaddy') return isSmallScreen ? 12 : 15
        if (d.data.name === 'Career Journey') return isSmallScreen ? 6 : 8
        return isSmallScreen ? 6 : 8
      })
      .style('fill', d => {
        if (d.data.type === 'path') return d.data.color
        if (d.data.name === 'Career Journey') return '#2d3748'
        const pathNode = d.ancestors().find(ancestor => ancestor.data.type === 'path')
        return pathNode ? pathNode.data.color : '#e2e8f0'
      })
      .style('stroke', d => {
        if (d.data.type === 'path') return d.data.color
        return '#fff'
      })
      .style('stroke-width', d => {
        if (d.data.type === 'path') return 3
        return 2
      })
      .style('opacity', d => {
        if (d.data.type === 'path') return 0.8
        return 1
      })

    // Add diamond shapes for path nodes to make them look like branching points
    nodes
      .filter(d => d.data.type === 'path')
      .append('polygon')
      .attr('points', () => {
        const size = isSmallScreen ? 4 : 6
        return `0,-${size} ${size},0 0,${size} -${size},0`
      })
      .style('fill', d => d.data.color)
      .style('stroke', '#fff')
      .style('stroke-width', 2)
      .style('opacity', 0.9)

    // Collect text elements for collision detection
    const textElements = []

    // Add labels with improved positioning and collision detection
    nodes.each(function (d) {
      if (d.data.name === 'Career Journey') return

      const node = d3.select(this)
      let displayText = ''

      if (d.data.type === 'path') {
        displayText = d.data.name
      } else if (d.data.name === 'GoDaddy') {
        displayText = d.data.name
      } else {
        // Use abbreviated names for companies and truncate titles
        const companyName = getAbbreviatedName(d.data.name, isSmallScreen)
        const title = d.data.title || d.data.name
        const maxTitleLength = isSmallScreen ? 15 : 25
        const truncatedTitle = getTruncatedText(title, maxTitleLength)
        displayText = companyName === title ? companyName : truncatedTitle
      }

      // Smart text positioning with collision avoidance
      let textX = 0
      let textY = 0
      let textAnchor = 'middle'

      // Determine initial position based on node location and type
      if (d.data.type === 'path') {
        // Path nodes: center the text
        textX = 0
        textY = isSmallScreen ? -12 : -15
        textAnchor = 'middle'
      } else {
        // Job nodes: position based on screen size and location
        if (isSmallScreen) {
          // On small screens, stack text vertically
          textX = 0
          textY = d.children ? -20 : 20
          textAnchor = 'middle'
        } else {
          // On larger screens, use horizontal positioning
          if (d.x < width * 0.25) {
            textX = 15
            textAnchor = 'start'
          } else if (d.x > width * 0.75) {
            textX = -15
            textAnchor = 'end'
          } else {
            textX = d.children ? -15 : 15
            textAnchor = d.children ? 'end' : 'start'
          }
          textY = 0
        }
      }

      const textElement = node
        .append('text')
        .attr('x', textX)
        .attr('y', textY)
        .attr('dy', '0.35em')
        .style('text-anchor', textAnchor)
        .style('font-size', d => {
          const baseSize = isSmallScreen ? 9 : 11
          if (d.data.type === 'path') return `${baseSize + 2}px`
          if (d.data.name === 'GoDaddy') return `${baseSize + 1}px`
          return `${baseSize}px`
        })
        .style('font-weight', d => {
          if (d.data.type === 'path' || d.data.name === 'GoDaddy') return 'bold'
          return 'normal'
        })
        .style('fill', darkModeActive ? '#e2e8f0' : '#2d3748')
        .style('pointer-events', 'none')
        .text(displayText)

      // Store text element info for collision detection
      textElements.push({
        element: textElement,
        node: d,
        x: d.x + textX,
        y: d.y + textY,
        width: displayText.length * (isSmallScreen ? 5 : 6), // Approximate text width
        height: isSmallScreen ? 12 : 14
      })
    })

    // Improved collision detection and adjustment
    textElements.forEach((text, i) => {
      for (let j = i + 1; j < textElements.length; j++) {
        const other = textElements[j]

        // Check for overlap with some padding
        const xOverlap = Math.abs(text.x - other.x) < (text.width + other.width) / 2 + 4
        const yOverlap = Math.abs(text.y - other.y) < Math.max(text.height, other.height) + 2

        if (xOverlap && yOverlap) {
          // More intelligent adjustment based on node positions
          const adjustment = Math.max(text.height, other.height) + 4

          // Prefer vertical adjustment to maintain readability
          if (other.y > text.y) {
            other.y += adjustment
          } else {
            other.y -= adjustment
          }

          // Update the actual text element position
          const relativeY = other.y - other.node.y
          other.element.attr('y', relativeY)
        }
      }
    })

    // Add year labels with better visibility and coverage (positioned inside container)
    const years = [2003, 2007, 2011, 2015, 2019, 2023] // Key career milestone years
    const timelineX = isMobile ? 35 : 45 // Position timeline inside the container
    const yearLabelX = timelineX - 8 // Position year labels just left of timeline

    g.selectAll('.year-label')
      .data(years)
      .enter()
      .append('text')
      .attr('class', 'year-label')
      .attr('x', yearLabelX)
      .attr('y', d => timeScale(d))
      .attr('dy', '0.35em')
      .style('text-anchor', 'end')
      .style('font-size', isSmallScreen ? '11px' : '12px') // Increased size for better readability
      .style('fill', darkModeActive ? '#e2e8f0' : '#4a5568') // Much stronger contrast
      .style('font-weight', 'bold')
      .text(d => d)

    // Add timeline line positioned inside the visible area
    g.append('line')
      .attr('x1', timelineX)
      .attr('y1', 0)
      .attr('x2', timelineX)
      .attr('y2', height)
      .style('stroke', darkModeActive ? '#4a5568' : '#cbd5e0')
      .style('stroke-width', 2)
  }, [darkModeActive])

  useEffect(() => {
    createVisualization()

    // Add resize listener for responsiveness
    const handleResize = () => {
      setTimeout(createVisualization, 100)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [createVisualization])

  // Trigger visualization re-render when selectedNode changes (affects container width)
  useEffect(() => {
    if (containerRef.current) {
      // Small delay to ensure container has resized
      setTimeout(createVisualization, 50)
    }
  }, [selectedNode, createVisualization])

  // Glassmorphism container styles
  const containerStyles = {
    background: 'panel-background',
    borderRadius: '16px',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    boxShadow: darkModeActive ? '0 8px 32px rgba(0,0,0,0.3)' : '0 8px 32px rgba(0,0,0,0.1)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    // Reduced width by ~20% with better responsive margins
    maxWidth: ['95%', '85%', '80%'], // Narrower container
    marginX: 'auto', // Center the container
    display: 'flex',
    flexDirection: ['column', 'column', selectedNode ? 'row' : 'column'], // Side-by-side on large screens when info panel is shown
    alignItems: ['center', 'center', selectedNode ? 'flex-start' : 'center'],
    gap: [0, 0, 4] // Space between visualization and info panel on large screens
  }

  // Info panel styles with slide-up and fade animation
  const infoPanelStyles = {
    background: 'panel-background',
    borderRadius: ['12px', '16px'],
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    boxShadow: darkModeActive ? '0 8px 32px rgba(0,0,0,0.3)' : '0 8px 32px rgba(0,0,0,0.1)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    padding: [3, 4],
    // Responsive sizing and positioning
    mt: [4, 4, 0], // Margin top only on small screens
    width: ['100%', '100%', '300px'], // Fixed width on large screens, full width on small
    flexShrink: 0, // Don't shrink on large screens
    // Smooth entrance animation
    '@keyframes slideUpFadeIn': {
      '0%': {
        opacity: 0,
        transform: 'translateY(20px)'
      },
      '100%': {
        opacity: 1,
        transform: 'translateY(0)'
      }
    },
    animation: 'slideUpFadeIn 0.4s ease-out',
    transition: 'all 0.3s ease'
  }

  return (
    <Box sx={{ width: '100%', py: 4 }}>
      <Box
        sx={{
          ...containerStyles,
          padding: [2, 3, 4]
        }}
      >
        {/* Visualization container */}
        <Box
          sx={{
            width: ['100%', '100%', selectedNode ? 'calc(100% - 300px - 32px)' : '100%'], // Leave space for info panel on large screens
            minWidth: 0 // Allow shrinking
          }}
        >
          <Box
            ref={containerRef}
            sx={{
              width: '100%',
              overflow: 'auto',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <svg
              ref={svgRef}
              sx={{
                maxWidth: '100%',
                height: 'auto',
                display: 'block',
                margin: '0 auto' // Ensure perfect centering
              }}
            />
          </Box>
        </Box>

        {/* Job information panel */}
        {selectedNode && (
          <Box sx={infoPanelStyles}>
            {/* Header with gradient accent and close button */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 3,
                pb: 3,
                borderBottom: darkModeActive ? '2px solid rgba(74, 158, 255, 0.3)' : '2px solid rgba(66, 46, 163, 0.3)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  sx={{
                    background: darkModeActive
                      ? 'linear-gradient(45deg, #4a9eff, #711e9b)'
                      : 'linear-gradient(45deg, #422EA3, #711E9B)',
                    width: '6px',
                    height: '32px',
                    borderRadius: '3px',
                    mr: 3
                  }}
                />
                <Box>
                  {/* Company Name */}
                  {selectedNode.title && selectedNode.name && (
                    <Box
                      sx={{
                        fontSize: '14px',
                        color: darkModeActive ? '#888' : '#666',
                        fontWeight: 'medium',
                        mb: 1
                      }}
                    >
                      {selectedNode.name}
                    </Box>
                  )}
                  {/* Job Title / Role */}
                  <Box
                    sx={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: darkModeActive ? '#4a9eff' : '#422EA3',
                      lineHeight: 'tight'
                    }}
                  >
                    {selectedNode.title || selectedNode.name}
                  </Box>
                </Box>
              </Box>

              {/* Close button */}
              <Box
                onClick={() => setSelectedNode(null)}
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
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: darkModeActive ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                    transform: 'scale(1.1)'
                  }
                }}
              >
                ×
              </Box>
            </Box>

            {/* Dates */}
            {selectedNode.dates && (
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
                <Box
                  sx={{
                    width: '16px',
                    height: '16px',
                    mr: 2,
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  📅
                </Box>
                {selectedNode.dates}
              </Box>
            )}

            {/* Description */}
            {selectedNode.description && (
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
                {selectedNode.description}
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default CareerPathVisualization
