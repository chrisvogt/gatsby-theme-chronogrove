/** @jsx jsx */
import { jsx, useThemeUI } from 'theme-ui'
import { faRobot, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Heading, Button } from '@theme-ui/components'
import { Themed } from '@theme-ui/mdx'
import React, { useEffect, useState, useRef } from 'react'

import { parseSafeHtml } from '../../../helpers/safeHtmlParser'

const ProgressiveReveal = ({ children, delay = 0, isInView = false }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, delay)

      return () => clearTimeout(timer)
    }
  }, [isInView, delay])

  return (
    <div
      sx={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
        transition: 'all 0.8s ease-out'
      }}
    >
      {children}
    </div>
  )
}

const AiSummary = React.memo(({ aiSummary }) => {
  const { theme } = useThemeUI()
  const primary = theme?.colors?.primary ?? '#422EA3'
  const secondary = theme?.colors?.secondary ?? '#711E9B'
  const primaryRgb = theme?.colors?.primaryRgb ?? '66, 46, 163'

  const [isVisible, setIsVisible] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [parsedContent, setParsedContent] = useState({ firstParagraph: '', remainingParagraphs: [] })
  const containerRef = useRef(null)

  useEffect(() => {
    if (!aiSummary) return

    // Split content on paragraph tags
    const paragraphs = aiSummary.split(/<\/?p[^>]*>/).filter(text => text.trim())
    const firstParagraph = paragraphs[0] || ''
    const remainingParagraphs = paragraphs.slice(1).filter(text => text.trim())

    setParsedContent({
      firstParagraph: firstParagraph ? `<p>${firstParagraph}</p>` : '',
      remainingParagraphs: remainingParagraphs.map(p => `<p>${p}</p>`)
    })

    // Check if IntersectionObserver is supported
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      const observer = new window.IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            setIsVisible(true)

            // Start content animation after entrance
            const timer = setTimeout(() => {
              setShowContent(true)
            }, 600)

            return () => clearTimeout(timer)
          }
        },
        {
          threshold: 0.1,
          rootMargin: '50px'
        }
      )

      if (containerRef.current) {
        observer.observe(containerRef.current)
      }

      return () => {
        if (containerRef.current) {
          observer.unobserve(containerRef.current)
        }
      }
    } else {
      // Fallback for environments without IntersectionObserver
      setIsInView(true)
      setIsVisible(true)

      const timer = setTimeout(() => {
        setShowContent(true)
      }, 600)

      return () => clearTimeout(timer)
    }
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
        mb: 4,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        animation: isVisible ? 'gentleFloat 8s ease-in-out infinite' : 'none'
      }}
    >
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
            animation: isVisible ? 'slideInFromLeft 0.8s ease-out' : 'none',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: '-4px',
              left: 0,
              width: '0%',
              height: '2px',
              background: `linear-gradient(90deg, ${primary}, ${secondary})`,
              animation: isVisible ? 'expandWidth 1.2s ease-out 0.8s forwards' : 'none'
            }
          }}
        >
          AI Summary
        </Heading>
      </div>

      <div
        sx={{
          mb: 3,
          '& p': {
            mb: 2,
            lineHeight: 1.6
          }
        }}
      >
        {showContent && (
          <ProgressiveReveal delay={200} isInView={isInView}>
            {parseSafeHtml(parsedContent.firstParagraph)}
          </ProgressiveReveal>
        )}
      </div>

      {/* Read More Button */}
      {parsedContent.remainingParagraphs.length > 0 && showContent && (
        <div
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 3,
            opacity: showContent ? 1 : 0,
            transform: showContent ? 'translateY(0)' : 'translateY(10px)',
            transition: 'all 0.8s ease-out 0.8s'
          }}
        >
          <Button
            variant='readMore'
            onClick={handleToggleExpanded}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            {isExpanded ? 'Show Less' : 'Read More'}
            <FontAwesomeIcon
              icon={isExpanded ? faChevronUp : faChevronDown}
              sx={{
                fontSize: 1,
                transition: 'transform 0.3s ease-in-out',
                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
              }}
            />
          </Button>
        </div>
      )}

      {/* Expanded Content */}
      {isExpanded && parsedContent.remainingParagraphs.length > 0 && (
        <div
          sx={{
            animation: 'slideDown 0.6s ease-out forwards',
            overflow: 'hidden',
            '& p': {
              mb: 2,
              lineHeight: 1.6,
              animation: 'fadeInUp 0.5s ease-out forwards',
              '&:nth-of-type(1)': { animationDelay: '0.1s' },
              '&:nth-of-type(2)': { animationDelay: '0.2s' },
              '&:nth-of-type(3)': { animationDelay: '0.3s' },
              '&:nth-of-type(4)': { animationDelay: '0.4s' },
              '&:nth-of-type(5)': { animationDelay: '0.5s' }
            }
          }}
        >
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
          alignItems: 'center',
          opacity: showContent ? 1 : 0,
          transform: showContent ? 'translateY(0)' : 'translateY(10px)',
          transition: 'all 0.8s ease-out 0.5s',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '0%',
            height: '1px',
            background: `linear-gradient(90deg, ${primary}, ${secondary})`,
            animation: showContent ? 'expandWidth 1s ease-out 1.5s forwards' : 'none'
          }
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
