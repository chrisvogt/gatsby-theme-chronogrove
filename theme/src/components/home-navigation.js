/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Fragment } from 'react'
import { Link } from '@theme-ui/components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRef, useState, useEffect } from 'react'
import useNavigationData from '../hooks/use-navigation-data'
import { faHome, faNewspaper, faUser, faMusic, faCamera, faRecordVinyl } from '@fortawesome/free-solid-svg-icons'
import { faFlickr, faGithub, faGoodreads, faInstagram, faSpotify, faSteam } from '@fortawesome/free-brands-svg-icons'

const icons = {
  faHome,
  faNewspaper,
  faUser,
  faMusic,
  faCamera,
  faRecordVinyl,
  faFlickr,
  faGithub,
  faGoodreads,
  faInstagram,
  faSpotify,
  faSteam
}

const HomeNavigation = () => {
  const navItemsRef = useRef()
  const [activeSection, setActiveSection] = useState('home')

  const navigation = useNavigationData()
  const homeItems = navigation?.header?.home || []

  // Create navigation items from the configuration
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
          item.slug === 'discogs' ? 'faRecordVinyl' : `fa${item.slug.charAt(0).toUpperCase() + item.slug.slice(1)}`
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

    window.addEventListener('scroll', handleScroll)
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
        <nav role='navigation' aria-label='On-page navigation' ref={navItemsRef}>
          {links.map(({ href, icon, id, text }) => {
            const IconComponent = icon?.reactIcon && icons[icon.reactIcon] ? icons[icon.reactIcon] : null
            return (
              <Link
                href={href}
                key={id}
                variant='homeNavigation'
                className={activeSection === id ? 'active' : ''}
                sx={{
                  fontFamily: 'sans',
                  color: 'text',
                  paddingX: 2,
                  '&.active': {
                    color: 'primary'
                  }
                }}
              >
                {IconComponent ? (
                  <FontAwesomeIcon icon={IconComponent} style={{ height: '18px' }} sx={{ mr: 2 }} />
                ) : null}
                {text}
              </Link>
            )
          })}
        </nav>
      </div>
    </Fragment>
  )
}

export default HomeNavigation
