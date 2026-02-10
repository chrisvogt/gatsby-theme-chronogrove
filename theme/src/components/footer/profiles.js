/** @jsx jsx */
import { jsx } from 'theme-ui'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {
  faBehance,
  faBluesky,
  faDribbble,
  faFacebook,
  faGithub,
  faInstagram,
  faLinkedin,
  faMastodon,
  faStackOverflow,
  faXTwitter
} from '@fortawesome/free-brands-svg-icons'

import useSocialProfiles from '../../hooks/use-social-profiles'

/**
 * icons is a library containing all of the social icons available for this theme.
 * This is to prevent the entire font awesome library from being included in the
 * bundle. See chrisvogt/gatsby-theme-chronogrove#31 for to learn more.
 */
const icons = {
  faBehance,
  faBluesky,
  faDribbble,
  faFacebook,
  faGithub,
  faInstagram,
  faLinkedin,
  faMastodon,
  faStackOverflow,
  faXTwitter
}

/** Mapper function to attach React icon components to profile data. */
const profilesToIcons = profile => {
  const { icon: { reactIcon } = {} } = profile
  return {
    IconComponent: icons[reactIcon],
    profile
  }
}

export default () => {
  const profiles = useSocialProfiles()
  const profilesWithIcons = profiles.map(profilesToIcons)

  return (
    <div
      sx={{
        mb: 4,
        display: 'flex',
        flexDirection: ['column', 'row'],
        alignItems: 'center',
        justifyContent: 'center',
        gap: [3, 4],
        maxWidth: '100%',
        textAlign: 'center'
      }}
    >
      <div
        sx={{
          color: 'text',
          fontSize: [2, 3],
          fontWeight: 'heading',
          whiteSpace: 'nowrap'
        }}
      >
        Connect with me
      </div>
      <div
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: [3, 4],
          alignItems: 'center'
        }}
      >
        {profilesWithIcons.length &&
          profilesWithIcons.map(({ IconComponent, profile = {} }) => {
            const { displayName, href, slug } = profile
            return (
              <a
                key={slug}
                href={href}
                title={displayName}
                rel='me'
                sx={{
                  color: 'text',
                  transition: 'all 0.2s ease-in-out',
                  display: 'flex',
                  alignItems: 'center',
                  '&:hover': {
                    color: 'primary',
                    transform: 'scale(1.02)'
                  }
                }}
              >
                <FontAwesomeIcon
                  icon={IconComponent}
                  sx={{
                    fontSize: [5, 6],
                    width: '32px',
                    height: '32px'
                  }}
                />
              </a>
            )
          })}
      </div>
    </div>
  )
}
