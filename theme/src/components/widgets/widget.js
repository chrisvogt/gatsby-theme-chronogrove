/** @jsx jsx */
import { jsx, useThemeUI } from 'theme-ui'
import { useEffect, useRef, useState } from 'react'
import isDarkMode from '../../helpers/isDarkMode'
import { trackWidgetInteraction } from '../../utils/analytics'

const widgetStyles = {
  mb: 4,
  pt: [0, 3, 4],
  pb: [0, 3, 4]
}

const Widget = ({ children, hasFatalError, id, styleOverrides = {} }) => {
  const { colorMode } = useThemeUI()
  const darkMode = isDarkMode(colorMode)
  const widgetRef = useRef(null)
  const [hasTrackedImpression, setHasTrackedImpression] = useState(false)

  // Track widget impressions when they become visible
  useEffect(() => {
    if (!id || hasTrackedImpression || typeof window === 'undefined' || !window.IntersectionObserver) {
      return
    }

    // eslint-disable-next-line no-undef
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          // Track impression when widget is at least 50% visible
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            trackWidgetInteraction(id, 'impression', {
              visibility_ratio: entry.intersectionRatio,
              fatal_error: hasFatalError
            })
            setHasTrackedImpression(true)
            // Stop observing after tracking impression once
            observer.disconnect()
          }
        })
      },
      {
        threshold: [0.5, 0.75, 1.0], // Track at 50%, 75%, and 100% visibility
        rootMargin: '0px'
      }
    )

    if (widgetRef.current) {
      observer.observe(widgetRef.current)
    }

    return () => observer.disconnect()
  }, [id, hasTrackedImpression, hasFatalError])

  return (
    <section
      ref={widgetRef}
      sx={{
        ...widgetStyles,
        ...styleOverrides,
        ...(hasFatalError
          ? {
              position: 'relative'
            }
          : {})
      }}
      {...(id ? { id } : {})}
    >
      {hasFatalError && (
        <div
          sx={{
            alignItems: 'center',
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            left: 0,
            position: 'absolute',
            right: 0,
            top: 0
          }}
        >
          <div
            sx={{
              background: darkMode ? '#252e3c' : 'white',
              borderLeft: '2px solid red',
              borderRight: '2px solid red',
              borderRadius: '2px',
              boxShadow: 'xl',
              py: 3,
              px: 4,
              zIndex: 480
            }}
          >
            <h4>Something went wrong</h4>
            <p>Failed to load this widget.</p>
          </div>
          <div
            sx={{
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              background: darkMode
                ? 'radial-gradient(rgba(14.5,18,23.5,0.4) 20%, transparent 50%);'
                : 'radial-gradient(rgba(255, 255, 255, 0.4) 20%, transparent 50%)',
              position: 'absolute',
              zIndex: 470
            }}
          ></div>
        </div>
      )}
      {children}
    </section>
  )
}

export default Widget
