/** @jsx jsx */
import { jsx } from 'theme-ui'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { nullableString } from '@chronogrove/ui/prop-types-helpers'
import { Themed } from '@theme-ui/mdx'
import { Embed, Box } from '@theme-ui/components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import LazyLoad from '../components/lazy-load'

const YOUTUBE_IFRAME_ALLOW =
  'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'

/** Extract the video ID from a `/embed/{id}` YouTube URL */
const getVideoId = url => {
  const match = url.match(/\/embed\/([^?]+)/)
  return match ? match[1] : null
}

/** Append autoplay=1 so playback starts as soon as the iframe mounts (safe: only used after a click, a user gesture) */
const withAutoplay = url => {
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}autoplay=1`
}

const YouTubeFrame = ({ title, url }) => (
  <Embed
    allow={YOUTUBE_IFRAME_ALLOW}
    allowFullScreen
    referrerPolicy='strict-origin-when-cross-origin'
    src={url}
    sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
    title={title || 'Video on YouTube'}
  />
)

YouTubeFrame.propTypes = {
  title: nullableString,
  url: PropTypes.string.isRequired
}

/** Click-to-play facade: a static thumbnail + play button, standing in for the iframe until activated */
const YouTubeFacade = ({ title, videoId, onActivate }) => (
  <Box
    as='button'
    aria-label={`Play video: ${title || 'YouTube video'}`}
    onClick={onActivate}
    type='button'
    sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      display: 'block',
      width: '100%',
      height: '100%',
      m: 0,
      p: 0,
      border: 0,
      overflow: 'hidden',
      backgroundColor: 'black',
      cursor: 'pointer',
      '&:hover .youtube-facade-play-badge': {
        backgroundColor: '#ff0000'
      }
    }}
  >
    <Box
      alt=''
      as='img'
      loading='lazy'
      src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
      sx={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
    />
    <Box
      aria-hidden
      className='youtube-facade-play-badge'
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '68px',
        height: '48px',
        borderRadius: '14px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 0.15s ease'
      }}
    >
      <FontAwesomeIcon icon={faPlay} sx={{ width: '18px', height: '18px', color: 'white' }} />
    </Box>
  </Box>
)

YouTubeFacade.propTypes = {
  title: nullableString,
  videoId: PropTypes.string.isRequired,
  onActivate: PropTypes.func.isRequired
}

const YouTube = ({ title, url, sx = {}, compact = false }) => {
  const [activated, setActivated] = useState(false)
  const videoId = getVideoId(url)

  return (
    <Themed.div
      sx={{
        variant: 'styles.VideoWrapper',
        ...(compact && { paddingTop: 0 }), // Remove legacy padding for compact/card usage
        ...sx
      }}
    >
      {activated || !videoId ? (
        <YouTubeFrame title={title} url={activated ? withAutoplay(url) : url} />
      ) : (
        <LazyLoad>
          <YouTubeFacade title={title} videoId={videoId} onActivate={() => setActivated(true)} />
        </LazyLoad>
      )}
    </Themed.div>
  )
}

YouTube.propTypes = {
  title: nullableString,
  url: PropTypes.string.isRequired,
  sx: PropTypes.object,
  compact: PropTypes.bool
}

export default YouTube
