/** @jsx jsx */
import { jsx, useColorMode, useThemeUI } from 'theme-ui'
import { Fragment } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { scrollToElementWhenReady } from '../helpers/scroll-to-element-when-ready'
import { useMemo, useState, useEffect, useRef } from 'react'
import useNavigationData from '../hooks/use-navigation-data'
import useSiteMetadata from '../hooks/use-site-metadata'
import {
  faHome,
  faNewspaper,
  faUser,
  faMusic,
  faCamera,
  faMapMarkedAlt,
  faRecordVinyl
} from '@fortawesome/free-solid-svg-icons'
import { faFlickr, faGithub, faGoodreads, faInstagram, faSpotify, faSteam } from '@fortawesome/free-brands-svg-icons'

const isHashLink = href => typeof href === 'string' && href.startsWith('#')

const icons = {
  faHome,
  faNewspaper,
  faUser,
  faMusic,
  faCamera,
  faMapMarkedAlt,
  faRecordVinyl,
  faFlickr,
  faGithub,
  faGoodreads,
  faInstagram,
  faSpotify,
  faSteam
}

// Badge sizes
const BADGE_ACTIVE = 44
const BADGE_IDLE = 34

/**
 * Scroll-wheel sidebar navigation for the home page.
 *
 * Replaces the retro 3D panel with a vertical progress rail:
 * - A thin line runs the full height of the nav
 * - Each section is represented by a circular badge (icon inside)
 * - The active badge is filled with the primary color; idle badges are ghost rings
 * - The rail fills from the top to the active badge center as you scroll
 * - Labels sit to the right of each badge
 *
 * Scroll detection, link building, and keyboard handling are unchanged from the
 * original retro panel implementation.
 */
const HomeNavigation = ({ scrollSyncDisabled = false } = {}) => {
  const [activeSection, setActiveSection] = useState('home')
  const [colorMode] = useColorMode()
  const { theme } = useThemeUI()
  const isDark = colorMode === 'dark'
  const scrollRef = useRef(null)

  const navigation = useNavigationData()
  const metadata = useSiteMetadata()
  const allHomeItems = navigation?.header?.home || []
  const homeItems = allHomeItems.filter(item => {
    const widgetConfig = metadata?.widgets?.[item.slug]
    if (!widgetConfig) return true
    return Boolean(widgetConfig.widgetDataSource)
  })

  const links = useMemo(
    () => [
      {
        href: '#top',
        icon: { reactIcon: 'faHome' },
        id: 'home',
        text: 'Home'
      },
      {
        href: '#posts',
        icon: { reactIcon: 'faNewspaper' },
        id: 'posts',
        text: 'Latest Posts'
      },
      ...homeItems.map(item => ({
        href: item.path,
        icon: {
          reactIcon:
            item.slug === 'discogs'
              ? 'faRecordVinyl'
              : item.slug === 'travel'
                ? 'faMapMarkedAlt'
                : item.slug === 'photography'
                  ? 'faCamera'
                  : `fa${item.slug.charAt(0).toUpperCase() + item.slug.slice(1)}`
        },
        id: item.slug,
        text: item.text
      }))
    ],
    [homeItems]
  )

  useEffect(() => {
    if (scrollSyncDisabled || typeof document === 'undefined') return
    const handleScroll = () => {
      let currentSection = 'home'
      links.forEach(section => {
        const element = document.getElementById(section.id)
        if (element && element.getBoundingClientRect().top <= window.innerHeight / 2) {
          currentSection = section.id
        }
      })
      setActiveSection(currentSection)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [links, scrollSyncDisabled])

  const activeIndex = links.findIndex(l => l.id === activeSection)

  // Palette: pull primary from theme so it stays in sync with color mode
  const primaryColor = (isDark ? theme?.rawColors?.modes?.dark?.primary : theme?.rawColors?.primary) ?? '#422EA3'
  const primaryRgb = isDark ? '74, 158, 255' : '66, 46, 163'

  const trackBg = isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.10)'
  // Idle label: 0.65 opacity on light (#fdf8f5) → ~7.5:1 ✅; 0.55 on dark (#14141F) → ~5.9:1 ✅
  const labelColor = isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.65)'
  const labelActiveColor = isDark ? '#fff' : '#111'
  const badgeIdleBorder = isDark ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.18)'
  const badgeIdleBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.6)'
  // Idle icon: 0.85 opacity on light (#fdf8f5) → ~5.9:1 ✅; 0.5 on dark → ~5.2:1 ✅
  const badgeIdleIcon = isDark ? 'rgba(255,255,255,0.5)' : `rgba(${primaryRgb}, 0.85)`
  // Active icon: white on dark-mode primary (#4a9eff) is only 2.6:1 — use near-black instead → 7.2:1 ✅
  // White on light-mode primary (#422EA3) is 8.7:1 — keep white ✅
  const activeIconColor = isDark ? '#111' : '#fff'

  // Filled rail height: pct of the *track* (container minus half-badge at top and bottom).
  // Track uses top/bottom each BADGE_ACTIVE/2, so track length = 100% - BADGE_ACTIVE.
  // Height at P% must be P% of container minus P% of the 44px inset = calc(P% - P*44/100 px),
  // not a constant 22px subtract (which overshoots at 100% and undershoots below 50%).
  const railFillPct = links.length > 1 ? Math.min(100, Math.round((activeIndex / (links.length - 1)) * 100)) : 0
  const railFillHeightDeductionPx = (railFillPct * BADGE_ACTIVE) / 100

  return (
    <Fragment>
      <div
        sx={{
          display: ['none', '', 'block'],
          position: 'sticky',
          top: '1.5em'
        }}
      >
        <nav role='navigation' aria-label='On-page navigation'>
          {/* Outer scroll-wheel rail container */}
          <div
            ref={scrollRef}
            sx={{
              position: 'relative',
              pl: '28px', // room for rail + badge overflow
              pr: 2
            }}
          >
            {/* Rail background track */}
            <div
              aria-hidden='true'
              sx={{
                position: 'absolute',
                left: '13px',
                top: `${BADGE_ACTIVE / 2}px`,
                bottom: `${BADGE_ACTIVE / 2}px`,
                width: '2px',
                borderRadius: '1px',
                backgroundColor: trackBg,
                zIndex: 0
              }}
            />

            {/* Rail fill — grows from top to active badge center */}
            <div
              aria-hidden='true'
              sx={{
                position: 'absolute',
                left: '13px',
                top: `${BADGE_ACTIVE / 2}px`,
                width: '2px',
                borderRadius: '1px',
                backgroundColor: primaryColor,
                zIndex: 0,
                transition: 'height 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                height: railFillPct === 0 ? '0px' : `calc(${railFillPct}% - ${railFillHeightDeductionPx}px)`
              }}
            />

            {/* Nav items */}
            {links.map(({ href, icon, id, text }, index) => {
              const isActive = activeSection === id
              const IconComponent = icon?.reactIcon && icons[icon.reactIcon] ? icons[icon.reactIcon] : null
              const badgeSize = isActive ? BADGE_ACTIVE : BADGE_IDLE

              const itemContent = (
                <div
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    py: index === 0 ? 0 : '7px',
                    cursor: 'pointer',
                    position: 'relative',
                    zIndex: 1,
                    '&:hover .nav-label': {
                      color: primaryColor,
                      opacity: 1
                    },
                    '&:hover .nav-badge': {
                      boxShadow: `0 0 0 3px rgba(${primaryRgb}, 0.2)`
                    }
                  }}
                >
                  {/* Circular badge */}
                  <div
                    className='nav-badge'
                    aria-hidden='true'
                    sx={{
                      flexShrink: 0,
                      width: `${badgeSize}px`,
                      height: `${badgeSize}px`,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: isActive ? primaryColor : badgeIdleBg,
                      border: isActive ? 'none' : `2px solid ${badgeIdleBorder}`,
                      boxShadow: isActive
                        ? `0 2px 8px rgba(${primaryRgb}, 0.35), 0 0 0 3px rgba(${primaryRgb}, 0.15)`
                        : 'none',
                      transition: 'all 0.25s cubic-bezier(0.34, 1.2, 0.64, 1)',
                      // Align smaller idle badges to their center with the active badge
                      ml: isActive ? 0 : `${(BADGE_ACTIVE - BADGE_IDLE) / 2}px`
                    }}
                  >
                    {IconComponent && (
                      <FontAwesomeIcon
                        icon={IconComponent}
                        style={{
                          width: isActive ? 18 : 14,
                          height: isActive ? 18 : 14,
                          color: isActive ? activeIconColor : badgeIdleIcon,
                          transition: 'all 0.25s ease'
                        }}
                        aria-hidden='true'
                      />
                    )}
                  </div>

                  {/* Label */}
                  <span
                    className='nav-label'
                    sx={{
                      fontSize: isActive ? '0.8rem' : '0.75rem',
                      fontFamily: 'heading',
                      fontWeight: isActive ? 'bold' : 'normal',
                      color: isActive ? labelActiveColor : labelColor,
                      letterSpacing: isActive ? '0.01em' : '0.02em',
                      lineHeight: 1.2,
                      transition: 'all 0.25s ease',
                      whiteSpace: 'nowrap',
                      userSelect: 'none'
                    }}
                  >
                    {text}
                  </span>
                </div>
              )

              const commonProps = {
                key: id,
                className: isActive ? 'active' : '',
                sx: {
                  display: 'block',
                  textDecoration: 'none',
                  color: 'inherit',
                  outline: 'none',
                  '&:focus-visible .nav-badge': {
                    boxShadow: `0 0 0 3px ${primaryColor}`
                  }
                }
              }

              return isHashLink(href) ? (
                <a
                  {...commonProps}
                  href={href}
                  onClick={e => {
                    e.preventDefault()
                    if (typeof window !== 'undefined') {
                      window.history.pushState(null, '', href)
                      if (id === 'home' || href === '#top') {
                        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
                      } else {
                        scrollToElementWhenReady(href)
                      }
                    }
                  }}
                >
                  {itemContent}
                </a>
              ) : (
                <a {...commonProps} href={href}>
                  {itemContent}
                </a>
              )
            })}
          </div>
        </nav>
      </div>
    </Fragment>
  )
}

export { HomeNavigation }
export default HomeNavigation
