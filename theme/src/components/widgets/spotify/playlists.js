/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Heading } from '@theme-ui/components'
import MediaItemGrid from './media-item-grid'
import { Themed } from '@theme-ui/mdx'
import { useDispatch } from 'react-redux'
import { setSpotifyTrack } from '../../../reducers/audioPlayer'

const transformPlaylist = playlist => {
  if (!playlist) {
    // Added 11/28/24 to fix a bug where an empty playlist was being returned
    return
  }

  const {
    external_urls: { spotify: spotifyURL } = {},
    cdnImageURL,
    id,
    name,
    tracks: { total: totalTracksCount = 0 } = {}
  } = playlist

  // Skip playlist for the following reasons:
  // - undefined totalTracksCount: Fixes a bug discovered in Prod when an empty album was returned.
  // - undefined cdnImageURL: Fixes a bug and since these playlists are image-centric, we don't want to render them without an image.
  if (!totalTracksCount || !cdnImageURL) {
    return null
  }

  return {
    id,
    name,
    spotifyURL,
    thumbnailURL: cdnImageURL,
    details: `${name} (${totalTracksCount} tracks)`
  }
}

const Playlists = ({ isLoading, playlists = [] }) => {
  const dispatch = useDispatch()

  const handlePlaylistClick = spotifyURL => {
    dispatch(setSpotifyTrack(spotifyURL))
  }

  const items = playlists
    .map(transformPlaylist)
    // Since this UI is image-centric, we want to skip any playlists that don't have an image, which is an edge
    // case I've noticed before for some select playlists.
    .filter(playlist => Boolean(playlist?.thumbnailURL))
    .slice(0, 12) // Limit to 12 playlists for now. As of December 2024 the API response includes > 12 playlists.

  return (
    <div>
      <div sx={{ display: 'flex', flex: 1, alignItems: 'center' }}>
        <Heading as='h3' sx={{ fontSize: [3, 4] }}>
          Playlists
        </Heading>
      </div>

      <Themed.p>My 12 favorite playlists.</Themed.p>

      <MediaItemGrid isLoading={isLoading} items={items} onTrackClick={handlePlaylistClick} />
    </div>
  )
}

export default Playlists
