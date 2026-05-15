/** @jsx jsx */
import { jsx, useColorMode, useThemeUI } from 'theme-ui'
import { useMemo, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { scrollToElementWhenReady } from '../helpers/scroll-to-element-when-ready'
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

function homeNavIconSlugToReactIcon(slug) {
  if (slug === 'discogs') return 'faRecordVinyl'
  if (slug === 'travel') return 'faMapMarkedAlt'
  if (slug === 'photography') return 'faCamera'
  return `fa${slug.charAt(0).toUpperCase() + slug.slice(1)}`
}

function handleHomeNavRailHashClick(e, { id, href }) {
  e.preventDefault()
  window.history.pushState(null, '', href)
  if (id === 'home' || href === '#top') {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    const topSection = document.getElementById('top')
    if (topSection && typeof topSection.focus === 'function') {
      topSection.focus({ preventScroll: true })
    }
  } else {
    scrollToElementWhenReady(href)
  }
}

function resolveHomeNavRailIcon(icon) {
  const key = icon?.reactIcon
  return key && icons[key] ? icons[key] : null
}

// Badge sizes
const BADGE_ACTIVE = 44
const BADGE_IDLE = 34

/**
 * Filled rail height as a percentage of the track (0 when there is only one stop).
 * `activeIndex` is clamped to [0, linkCount - 1] so a missing match (`findIndex` → -1)
 * cannot yield a negative percentage for the rail fill `calc()`.
 * Exported for unit tests and the defensive `linkCount <= 1` branch.
 */
export function getRailFillPct(linkCount, activeIndex) {
  if (linkCount <= 1) return 0
  const idx = Number.isFinite(activeIndex) ? activeIndex : 0
  const clamped = Math.max(0, Math.min(linkCount - 1, idx))
  return Math.min(100, Math.max(0, Math.round((clamped / (linkCount - 1)) * 100)))
}

/** @public for tests — mirrors nav primary resolution including `#422EA3` fallback */
export function resolvePrimaryFromTheme(isDark, theme) {
  const resolved = isDark ? theme?.rawColors?.modes?.dark?.primary : theme?.rawColors?.primary
  return resolved ?? '#422EA3'
}

/** @public for tests — React passes `{}` for missing props; this keeps `??` branches reachable in unit tests */
export function normalizeHomeNavProps(props) {
  return props ?? {}
}

function HomeNavRailLink({
  activeSection,
  activeIconColor,
  badgeIdleBg,
  badgeIdleBorder,
  badgeIdleIcon,
  href,
  icon,
  id,
  index,
  labelActiveColor,
  labelColor,
  primaryColor,
  primaryRgb,
  text
}) {
  const isActive = activeSection === id
  const IconComponent = resolveHomeNavRailIcon(icon)
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
          boxShadow: isActive ? `0 2px 8px rgba(${primaryRgb}, 0.35), 0 0 0 3px rgba(${primaryRgb}, 0.15)` : 'none',
          transition: 'all 0.25s cubic-bezier(0.34, 1.2, 0.64, 1)',
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
    <a {...commonProps} href={href} onClick={e => handleHomeNavRailHashClick(e, { id, href })}>
      {itemContent}
    </a>
  ) : (
    <a {...commonProps} href={href}>
      {itemContent}
    </a>
  )
}

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
const HomeNavigation = props => {
  const { scrollSyncDisabled = false } = normalizeHomeNavProps(props)
  const [activeSection, setActiveSection] = useState('home')
  const [colorMode] = useColorMode()
  const { theme } = useThemeUI()
  const isDark = colorMode === 'dark'

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
          reactIcon: homeNavIconSlugToReactIcon(item.slug)
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
  const primaryColor = resolvePrimaryFromTheme(isDark, theme)
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
  const railFillPct = getRailFillPct(links.length, activeIndex)
  const railFillHeightDeductionPx = (railFillPct * BADGE_ACTIVE) / 100

  return (
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
          {links.map(({ href, icon, id, text }, index) => (
            <HomeNavRailLink
              key={id}
              activeIconColor={activeIconColor}
              activeSection={activeSection}
              badgeIdleBg={badgeIdleBg}
              badgeIdleBorder={badgeIdleBorder}
              badgeIdleIcon={badgeIdleIcon}
              href={href}
              icon={icon}
              id={id}
              index={index}
              labelActiveColor={labelActiveColor}
              labelColor={labelColor}
              primaryColor={primaryColor}
              primaryRgb={primaryRgb}
              text={text}
            />
          ))}
        </div>
      </nav>
    </div>
  )
}

const homeNavRailIconPropType = PropTypes.shape({
  reactIcon: PropTypes.string
})

HomeNavRailLink.propTypes = {
  activeIconColor: PropTypes.string.isRequired,
  activeSection: PropTypes.string.isRequired,
  badgeIdleBg: PropTypes.string.isRequired,
  badgeIdleBorder: PropTypes.string.isRequired,
  badgeIdleIcon: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  icon: homeNavRailIconPropType,
  id: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  labelActiveColor: PropTypes.string.isRequired,
  labelColor: PropTypes.string.isRequired,
  primaryColor: PropTypes.string.isRequired,
  primaryRgb: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
}

HomeNavigation.propTypes = {
  scrollSyncDisabled: PropTypes.bool
}

export { HomeNavigation }
export default HomeNavigation
