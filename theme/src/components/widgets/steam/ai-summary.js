/** @jsx jsx */
import { jsx, useThemeUI } from 'theme-ui'
import { faRobot, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Heading } from '@theme-ui/components'
import ActionButton from '../../action-button'
import { Themed } from '@theme-ui/mdx'
import React, { useEffect, useState, useRef } from 'react'

import { parseSafeHtml } from '../../../helpers/safeHtmlParser'

const AiSummary = React.memo(({ aiSummary }) => {
  const { theme } = useThemeUI()
  const primary = theme?.colors?.primary ?? '#422EA3'
  const secondary = theme?.colors?.secondary ?? '#711E9B'
  const primaryRgb = theme?.colors?.primaryRgb ?? '66, 46, 163'

  const [isVisible, setIsVisible] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [parsedContent, setParsedContent] = useState({ firstParagraph: '', remainingParagraphs: [] })
  const containerRef = useRef(null)

  useEffect(() => {
    if (!aiSummary) return

    const paragraphs = aiSummary.split(/<\/?p[^>]*>/).filter(text => text.trim())
    const firstParagraph = paragraphs[0] || ''
    const remainingParagraphs = paragraphs.slice(1).filter(text => text.trim())

    setParsedContent({
      firstParagraph: firstParagraph ? `<p>${firstParagraph}</p>` : '',
      remainingParagraphs: remainingParagraphs.map(p => `<p>${p}</p>`)
    })

    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      const observer = new window.IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            setShowContent(true)
          }
        },
        { threshold: 0.1, rootMargin: '50px' }
      )
      const node = containerRef.current
      if (node) observer.observe(node)
      return () => {
        if (node) observer.unobserve(node)
      }
    }
    setIsVisible(true)
    setShowContent(true)
  }, [aiSummary])

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  if (!aiSummary) {
    return null
  }

  return (
    <div
      ref={containerRef}
      sx={{
        variant: 'cards.aiSummary',
        mt: 4,
        mb: 4,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease-out',
        animation: isVisible ? 'gentleFloat 8s ease-in-out infinite' : 'none'
      }}
    >
      {/* Two-column layout on larger breakpoints: content left, Read More right (vertically centered) */}
      <div
        sx={{
          display: 'flex',
          flexDirection: ['column', 'row'],
          alignItems: ['stretch', 'center'],
          gap: [3, 4],
          mb: 3
        }}
      >
        <div sx={{ flex: 1, minWidth: 0 }}>
          <div sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <FontAwesomeIcon
              icon={faRobot}
              sx={{
                color: 'primary',
                fontSize: [2, 3],
                mr: 2,
                animation: 'pulse 2s infinite, gentleGlow 4s ease-in-out infinite alternate',
                filter: `drop-shadow(0 0 12px rgba(${primaryRgb}, 0.4))`
              }}
            />
            <Heading
              as='h3'
              sx={{
                fontSize: [3, 4],
                mb: 0,
                background: `linear-gradient(45deg, ${primary}, ${secondary})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                position: 'relative'
              }}
            >
              AI Summary
            </Heading>
          </div>

          <div
            sx={{
              '& p': {
                mb: 2,
                lineHeight: 1.6
              }
            }}
          >
            {showContent && parseSafeHtml(parsedContent.firstParagraph)}
          </div>
        </div>

        {/* Read More: right column on desktop (vertically centered), below content on mobile; matches Show More / pagination (ActionButton) */}
        {parsedContent.remainingParagraphs.length > 0 && showContent && (
          <div
            sx={{
              display: 'flex',
              justifyContent: ['center', 'flex-end'],
              flexShrink: 0
            }}
          >
            <ActionButton
              size='large'
              onClick={handleToggleExpanded}
              icon={
                <FontAwesomeIcon
                  icon={isExpanded ? faChevronUp : faChevronDown}
                  sx={{
                    fontSize: 1,
                    transition: 'transform 0.3s ease-in-out',
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}
                />
              }
            >
              {isExpanded ? 'Show Less' : 'Show More'}
            </ActionButton>
          </div>
        )}
      </div>

      {/* Expanded Content */}
      {isExpanded && parsedContent.remainingParagraphs.length > 0 && (
        <div sx={{ '& p': { mb: 2, lineHeight: 1.6 } }}>
          {parseSafeHtml(parsedContent.remainingParagraphs.join(''))}
        </div>
      )}

      <Themed.p
        sx={{
          mb: 0,
          fontSize: [1, 2],
          color: 'textMuted',
          fontStyle: 'italic',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <FontAwesomeIcon
          icon={faRobot}
          sx={{
            fontSize: 1,
            mr: 1,
            opacity: 0.7,
            animation: 'gentleBounce 3s infinite 2s'
          }}
        />
        Generated by Gemini (AI)
      </Themed.p>
    </div>
  )
})

export default AiSummary
