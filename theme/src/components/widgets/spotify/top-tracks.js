/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Heading } from '@theme-ui/components'
import { Themed } from '@theme-ui/mdx'
import { useAudioPlayerStore } from '../../../stores/audio-player-store'
import MediaItemGrid from './media-item-grid'

const TopTracks = ({ isLoading, tracks = [] }) => {
  const setSpotifyTrack = useAudioPlayerStore(state => state.setSpotifyTrack)

  const handleTrackClick = spotifyURL => {
    setSpotifyTrack(spotifyURL)
  }

  const items = tracks.map(track => {
    const { artists = [], albumImages = [], id, name, spotifyURL } = track

    const thumbnail = albumImages.find(image => image.width === 300) || {}
    const { url: thumbnailURL } = thumbnail

    return {
      id,
      name,
      spotifyURL,
      thumbnailURL,
      details: `${name} – ${artists.join(', ')}`
    }
  })

  return (
    <div sx={{ mb: 4 }}>
      <div sx={{ display: 'flex', flex: 1, alignItems: 'center' }}>
        <Heading as='h3' sx={{ fontSize: [3, 4] }}>
          Top Tracks
        </Heading>
      </div>

      <Themed.p>My 12 most-played tracks over the last 4 weeks.</Themed.p>

      <MediaItemGrid isLoading={isLoading} items={items} onTrackClick={handleTrackClick} />
    </div>
  )
}

export default TopTracks
