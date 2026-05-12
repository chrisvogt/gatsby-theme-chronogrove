/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Box, Text } from '@theme-ui/components'
import React, { useEffect, useState, useRef } from 'react'

import { formatAiSummarySyncedLabel } from '../../../helpers/ai-summary-synced-at'
import { parseSafeHtml } from '../../../helpers/safeHtmlParser'
import { hexToRgba } from '../../../utils/colors'
import ActionButton from '../../action-button'

const AI_ATTRIBUTION = 'Generated with Claude Sonnet 4.6 (AI)'

const READ_MORE = 'Read more'
const READ_LESS = 'Read less'

/** ~4–5 lines of body copy at `fontSize` [2,3]; reveals start of the next paragraph(s) before fade */
const TEASER_MAX_HEIGHT = '6.75rem'

const fadeOverlaySx = {
  pointerEvents: 'none',
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  height: '4.5rem',
  background: theme => {
    const bg = theme.colors?.background
    if (typeof bg === 'string' && bg.startsWith('#')) {
      return `linear-gradient(to bottom, ${hexToRgba(bg, 0)} 0%, ${hexToRgba(bg, 0.82)} 38%, ${bg} 100%)`
    }
    if (typeof bg === 'string') {
      return `linear-gradient(to bottom, transparent 0%, ${bg} 100%)`
    }
    return 'linear-gradient(to bottom, transparent, rgba(253, 248, 245, 1))'
  }
}

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

  if (!aiSummary) {
    return null
  }

  const syncedLabel = formatAiSummarySyncedLabel(aiSummarySyncedAt)
  const hasMore = parsedContent.remainingParagraphs.length > 0
  const remainingJoined = parsedContent.remainingParagraphs.join('')

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
      <div sx={proseSx}>{showContent && parseSafeHtml(parsedContent.firstParagraph)}</div>

      {showContent && !hasMore && (
        <Text variant='mutedSans' as='p' sx={{ mt: 3, mb: 0 }}>
          {AI_ATTRIBUTION}
          {syncedLabel ? ` · Synced ${syncedLabel}` : ''}
        </Text>
      )}

      {hasMore && showContent && (
        <>
          {!isExpanded ? (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ position: 'relative' }}>
                <Box
                  sx={{
                    ...proseSx,
                    maxHeight: TEASER_MAX_HEIGHT,
                    overflow: 'hidden',
                    mb: 0
                  }}
                >
                  {parseSafeHtml(remainingJoined)}
                </Box>
                <Box aria-hidden='true' sx={fadeOverlaySx} />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <ActionButton
                  size='xlarge'
                  aria-expanded={false}
                  aria-label={READ_MORE}
                  onClick={() => setIsExpanded(true)}
                >
                  {READ_MORE}
                </ActionButton>
              </Box>
            </Box>
          ) : (
            <>
              <Box sx={{ ...proseSx, mt: 2 }}>{parseSafeHtml(remainingJoined)}</Box>
              <Text variant='mutedSans' as='p' sx={{ mt: 3, mb: 0 }}>
                {AI_ATTRIBUTION}
                {syncedLabel ? ` · Synced ${syncedLabel}` : ''}
              </Text>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <ActionButton size='xlarge' aria-expanded aria-label={READ_LESS} onClick={() => setIsExpanded(false)}>
                  {READ_LESS}
                </ActionButton>
              </Box>
            </>
          )}
        </>
      )}
    </div>
  )
})

export default AiSummary
