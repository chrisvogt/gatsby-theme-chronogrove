/** @jsx jsx */
import { jsx } from 'theme-ui'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ActionButton from '../../action-button'
import { Text } from '@theme-ui/components'
import React, { useEffect, useState, useRef } from 'react'

import { formatAiSummarySyncedLabel } from '../../../helpers/ai-summary-synced-at'
import { parseSafeHtml } from '../../../helpers/safeHtmlParser'

const AI_ATTRIBUTION = 'Generated with Claude Sonnet 4.6 (AI)'

/** Parsed `<p>` nodes from html-react-parser do not use Theme UI `styles.p`; match site body copy (serif, scale). */
const proseSx = {
  fontFamily: 'body',
  fontWeight: 'body',
  lineHeight: 'body',
  fontSize: [2, 3],
  color: 'text',
  '& p': {
    fontFamily: 'inherit',
    fontSize: 'inherit',
    fontWeight: 'inherit',
    lineHeight: 1.65,
    mt: 0,
    mb: 2
  },
  '& p:last-of-type': {
    mb: 0
  },
  '& a': {
    color: 'primary'
  }
}

const AiSummary = React.memo(({ aiSummary, aiSummarySyncedAt, sx: sxProp }) => {
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

  const syncedLabel = formatAiSummarySyncedLabel(aiSummarySyncedAt)

  return (
    <div
      ref={containerRef}
      sx={{
        mb: [3, 4],
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease-out',
        ...(typeof sxProp === 'object' && sxProp !== null ? sxProp : {})
      }}
    >
      {/* Two-column layout on larger breakpoints: content left, Show More right (vertically centered) */}
      <div
        sx={{
          display: 'flex',
          flexDirection: ['column', 'row'],
          alignItems: ['stretch', 'center'],
          gap: [3, 4],
          mb: 0
        }}
      >
        <div sx={{ flex: 1, minWidth: 0 }}>
          <div sx={proseSx}>{showContent && parseSafeHtml(parsedContent.firstParagraph)}</div>
        </div>

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

      {isExpanded && parsedContent.remainingParagraphs.length > 0 && (
        <>
          <div sx={{ ...proseSx, mt: 3 }}>{parseSafeHtml(parsedContent.remainingParagraphs.join(''))}</div>
          <Text variant='mutedSans' as='p' sx={{ mt: 4, mb: 0 }}>
            {AI_ATTRIBUTION}
            {syncedLabel ? ` · Synced ${syncedLabel}` : ''}
          </Text>
        </>
      )}
    </div>
  )
})

export default AiSummary
