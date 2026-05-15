/** @jsx jsx */
import { jsx, useColorMode } from 'theme-ui'
import PropTypes from 'prop-types'
import { nullableString } from '@chronogrove/ui/prop-types-helpers'

// Use a theme-aware accent color for the SoundCloud player
const buildSoundCloudEmbedURL = (trackId, isDarkMode) => {
  // Example: orange for light mode, purple for dark mode
  const color = isDarkMode ? '800080' : 'ff5500' // purple or orange
  return `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${trackId}&color=%23${color}&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`
}

const SoundCloud = ({ title, soundcloudId }) => {
  const [colorMode] = useColorMode()
  const isDarkMode = colorMode === 'dark'

  return (
    <iframe
      allow='autoplay'
      frameBorder='no'
      height='166'
      scrolling='no'
      src={buildSoundCloudEmbedURL(soundcloudId, isDarkMode)}
      title={title || 'Song on SoundCloud'}
      width='100%'
    ></iframe>
  )
}

SoundCloud.propTypes = {
  title: nullableString,
  soundcloudId: PropTypes.string.isRequired
}

export default SoundCloud
