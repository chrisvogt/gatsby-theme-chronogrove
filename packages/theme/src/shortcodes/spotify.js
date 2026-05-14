/** @jsx jsx */
import { jsx, Box } from 'theme-ui'

// Build embed URL from share URL so we can render a simple iframe (like SoundCloud).
// This avoids oEmbed fetch + state, so the iframe is preserved across re-renders and
// page navigation instead of being recreated and stopping playback.
// Format: https://open.spotify.com/embed/{type}/{id}
const SPOTIFY_EMBED_PATH = 'https://open.spotify.com/embed'
const SHARE_URL_REGEX = /^https?:\/\/open\.spotify\.com\/(track|album|playlist|artist|show|episode)\/([a-zA-Z0-9]+)/

const buildEmbedURL = spotifyURL => {
  if (!spotifyURL || typeof spotifyURL !== 'string') return null
  const trimmed = spotifyURL.trim()
  const match = SHARE_URL_REGEX.exec(trimmed)
  if (!match) return null
  const [, type, id] = match
  return `${SPOTIFY_EMBED_PATH}/${type}/${id}`
}

const Spotify = ({ spotifyURL }) => {
  const embedURL = buildEmbedURL(spotifyURL)
  if (!embedURL) return null

  return (
    <Box sx={{ border: 'none', borderRadius: '12px', overflow: 'hidden', lineHeight: 0 }}>
      <iframe
        allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
        height='152'
        loading='lazy'
        src={embedURL}
        style={{ border: 'none', display: 'block' }}
        title='Spotify Embed'
        width='100%'
      />
    </Box>
  )
}

export default Spotify
export { buildEmbedURL }
