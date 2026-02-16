/** @jsx jsx */
import { jsx, useColorMode } from 'theme-ui'
import { Fragment } from 'react'
import { Link } from '@theme-ui/components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRef, useState, useEffect } from 'react'
import useNavigationData from '../hooks/use-navigation-data'
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

/**
 * Retro panel color palettes with 1960s/1970s-inspired 3D shape.
 *
 * Light mode uses the theme's primary purple (#422EA3) and secondary (#711E9B)
 * with glassmorphism transparency. Dark mode uses the dark-mode primary blue
 * (#4a9eff) at low opacity for the same frosted-glass consistency as other panels.
 */
const retroPanelThemes = {
  default: {
    face: 'linear-gradient(160deg, rgba(66, 46, 163, 0.82) 0%, rgba(113, 30, 155, 0.86) 50%, rgba(69, 39, 160, 0.82) 100%)',
    shadow:
      'inset 0 2px 8px rgba(255,255,255,0.12), inset 0 -2px 6px rgba(0,0,0,0.15), 0 6px 20px rgba(66, 46, 163, 0.2)',
    shadowMuted:
      'inset 0 1px 4px rgba(255,255,255,0.06), inset 0 -1px 3px rgba(0,0,0,0.08), 0 2px 8px rgba(66, 46, 163, 0.08)',
    border: 'rgba(255, 255, 255, 0.15)',
    text: '#F0ECFF',
    active: '#FFFFFF',
    activeGlow: 'rgba(255, 255, 255, 0.5)',
    divider: 'rgba(240, 236, 255, 0.15)',
    hoverBg: 'rgba(255, 255, 255, 0.1)',
    circle: 'rgba(255, 255, 255, 0.06)',
    circleBorder: 'rgba(255, 255, 255, 0.1)',
    bezelHighlight: 'rgba(255, 255, 255, 0.2)',
    arcStroke: 'rgba(255, 255, 255, 0.06)'
  },
  dark: {
    face: 'linear-gradient(160deg, rgba(74, 158, 255, 0.12) 0%, rgba(74, 158, 255, 0.08) 50%, rgba(74, 158, 255, 0.12) 100%)',
    shadow: 'inset 0 1px 4px rgba(255,255,255,0.05), 0 6px 20px rgba(0,0,0,0.3)',
    shadowMuted: 'inset 0 1px 2px rgba(255,255,255,0.03), 0 2px 8px rgba(0,0,0,0.12)',
    border: 'rgba(255, 255, 255, 0.1)',
    text: '#FFFFFF',
    active: '#4a9eff',
    activeGlow: 'rgba(74, 158, 255, 0.4)',
    divider: 'rgba(255, 255, 255, 0.08)',
    hoverBg: 'rgba(74, 158, 255, 0.08)',
    circle: 'rgba(74, 158, 255, 0.06)',
    circleBorder: 'rgba(74, 158, 255, 0.1)',
    bezelHighlight: 'rgba(74, 158, 255, 0.15)',
    arcStroke: 'rgba(74, 158, 255, 0.04)'
  }
}

/**
 * Build 3D shadow gradient from theme palette using color-mix (works with CSS vars or hex).
 * Gray token: gray[5] light, gray[7] dark; fallback to textMuted. Opacities tuned for visibility.
 */
const sideShadowGradientFromTheme = (theme, colorMode) => {
  const isDark = colorMode === 'dark'
  const gray = (isDark ? theme?.colors?.gray?.[7] : theme?.colors?.gray?.[5]) ?? theme?.colors?.textMuted
  if (!gray) return 'linear-gradient(to right, rgba(0,0,0,0.15) 0%, transparent 100%)'
  const [pctStart, pctMid, pctEnd] = isDark ? [58, 32, 10] : [50, 26, 8]
  return `linear-gradient(to right, color-mix(in srgb, ${gray} ${pctStart}%, transparent) 0%, color-mix(in srgb, ${gray} ${pctMid}%, transparent) 45%, color-mix(in srgb, ${gray} ${pctEnd}%, transparent) 85%, transparent 100%)`
}

const HomeNavigation = () => {
  const navItemsRef = useRef()
  const [activeSection, setActiveSection] = useState('home')
  const [colorMode] = useColorMode()
  const colors = retroPanelThemes[colorMode] || retroPanelThemes.default

  const navigation = useNavigationData()
  const homeItems = navigation?.header?.home || []

  const links = [
    {
      href: '#top',
      icon: {
        name: 'home',
        reactIcon: 'faHome'
      },
      id: 'home',
      text: 'Home'
    },
    {
      href: '#posts',
      icon: {
        name: 'newspaper',
        reactIcon: 'faNewspaper'
      },
      id: 'posts',
      text: 'Latest Posts'
    },
    ...homeItems.map(item => ({
      href: item.path,
      icon: {
        name: item.slug,
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
  ]

  useEffect(() => {
    if (!document) {
      return
    }
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
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [links])

  return (
    <Fragment>
      <div
        sx={{
          display: ['none', '', 'block'],
          position: 'sticky',
          top: '1.5em'
        }}
      >
        {/* Retro 3D panel container — resting/active state machine.
            Resting: desaturated, shallow shadow, compressed side face.
            Active (hover / focus-within): full vibrancy, depth, and shadow.
            Enter is snappier (0.3s), exit fades gently (0.5s). */}
        <div
          sx={{
            position: 'relative',
            pr: '30px',
            /* Resting: desaturated, slightly lifted brightness */
            filter: 'saturate(0.5) brightness(1.02)',
            transition: 'filter 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            /* Active: full vibrancy */
            '&:hover, &:focus-within': {
              filter: 'saturate(1) brightness(1)',
              transition: 'filter 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            },
            /* Panel face shadow — resting (lighter, less depth) */
            '& > div:first-child': {
              boxShadow: colors.shadowMuted,
              transition: 'box-shadow 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            },
            /* Panel face shadow — active (full depth) */
            '&:hover > div:first-child, &:focus-within > div:first-child': {
              boxShadow: colors.shadow,
              transition: 'box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            },
            /* Shadow — resting: narrow strip (waist only), faded. Same gradient in both states so background never transitions (avoids solid↔gradient snap). */
            '& > div:last-child': {
              opacity: 0.35,
              clipPath: 'polygon(0% 0%, 22% 0%, 22% 50%, 22% 100%, 0% 100%)',
              transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), clip-path 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            },
            /* Shadow — active: top and bottom fold out */
            '&:hover > div:last-child, &:focus-within > div:last-child': {
              opacity: 1,
              clipPath: 'polygon(0% 0%, 100% 0%, 22% 50%, 100% 100%, 0% 100%)',
              transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), clip-path 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            },
            /* Respect reduced-motion: show the panel at full vibrancy, no transitions */
            '@media (prefers-reduced-motion: reduce)': {
              filter: 'none',
              transition: 'none',
              '& > div:first-child': {
                boxShadow: colors.shadow,
                transition: 'none'
              },
              '& > div:last-child': {
                opacity: 1,
                clipPath: 'polygon(0% 0%, 100% 0%, 22% 50%, 100% 100%, 0% 100%)',
                transition: 'none'
              }
            }
          }}
        >
          {/* Main panel face */}
          <div
            sx={{
              position: 'relative',
              background: colors.face,
              backdropFilter: 'blur(12px) saturate(150%)',
              WebkitBackdropFilter: 'blur(12px) saturate(150%)',
              borderRadius: '28px 6px 6px 28px',
              py: 3,
              pl: 3,
              pr: 2,
              border: `2px solid ${colors.border}`,
              overflow: 'hidden',
              zIndex: 1
            }}
          >
            {/* Decorative circle: top-left corner */}
            <div
              sx={{
                position: 'absolute',
                top: '-16px',
                left: '-16px',
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: colors.circle,
                border: `1px solid ${colors.circleBorder}`,
                pointerEvents: 'none'
              }}
              aria-hidden='true'
            />
            {/* Decorative circle: bottom-left corner */}
            <div
              sx={{
                position: 'absolute',
                bottom: '-10px',
                left: '-10px',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: colors.circle,
                border: `1px solid ${colors.circleBorder}`,
                pointerEvents: 'none'
              }}
              aria-hidden='true'
            />
            {/* Decorative circle: mid-right edge */}
            <div
              sx={{
                position: 'absolute',
                top: '50%',
                right: '-8px',
                transform: 'translateY(-50%)',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: colors.circle,
                border: `1px solid ${colors.circleBorder}`,
                pointerEvents: 'none'
              }}
              aria-hidden='true'
            />
            {/* Top bezel highlight — convex surface light catch */}
            <div
              sx={{
                position: 'absolute',
                top: 0,
                left: '24px',
                right: '8px',
                height: '1px',
                background: colors.bezelHighlight,
                pointerEvents: 'none'
              }}
              aria-hidden='true'
            />
            {/* Decorative arc: curved bezier accent */}
            <div
              sx={{
                position: 'absolute',
                top: '10px',
                left: '10%',
                width: '80%',
                height: '20px',
                borderTop: `1px solid ${colors.arcStroke}`,
                borderRadius: '50%',
                pointerEvents: 'none'
              }}
              aria-hidden='true'
            />

            <nav role='navigation' aria-label='On-page navigation' ref={navItemsRef}>
              {links.map(({ href, icon, id, text }) => {
                const IconComponent = icon?.reactIcon && icons[icon.reactIcon] ? icons[icon.reactIcon] : null
                return (
                  <Link
                    href={href}
                    key={id}
                    className={activeSection === id ? 'active' : ''}
                    sx={{
                      fontFamily: 'sans',
                      color: colors.text,
                      display: 'flex',
                      alignItems: 'center',
                      position: 'relative',
                      py: 2,
                      px: 2,
                      textDecoration: 'none',
                      borderRadius: '6px',
                      transition: 'all 0.2s ease',
                      fontSize: 1,
                      letterSpacing: '0.02em',
                      '&:not(:last-of-type)': {
                        borderBottom: `1px solid ${colors.divider}`
                      },
                      '&:hover, &:focus': {
                        backgroundColor: colors.hoverBg,
                        outline: 'none'
                      },
                      '&.active': {
                        color: colors.active,
                        fontWeight: 'bold'
                      },
                      /* Glowing indicator dot for the active section */
                      '&.active::before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        backgroundColor: colors.active,
                        boxShadow: `0 0 8px ${colors.activeGlow}`
                      }
                    }}
                  >
                    {IconComponent ? (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 18,
                          height: 18,
                          marginRight: 8
                        }}
                        aria-hidden
                      >
                        <FontAwesomeIcon icon={IconComponent} style={{ width: 18, height: 18 }} />
                      </span>
                    ) : null}
                    {text}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* 3D shadow — resting: narrow strip; hover: top and bottom fold out, middle (22% 50%) stays fixed. */}
          <div
            sx={{
              position: 'absolute',
              top: '8px',
              bottom: '8px',
              left: 'calc(100% - 30px)',
              width: '24px',
              background: theme => sideShadowGradientFromTheme(theme, colorMode),
              filter: 'blur(6px)',
              WebkitFilter: 'blur(6px)',
              zIndex: 0
            }}
            aria-hidden='true'
          />
        </div>
      </div>
    </Fragment>
  )
}

export default HomeNavigation
