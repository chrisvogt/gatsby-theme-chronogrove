import { useAudioPlayerStore, resetAudioPlayerStore, initialAudioPlayerState } from './audio-player-store'

describe('useAudioPlayerStore', () => {
  beforeEach(() => {
    resetAudioPlayerStore()
  })

  it('starts with initial state', () => {
    expect(useAudioPlayerStore.getState()).toMatchObject(initialAudioPlayerState)
  })

  it('setSoundcloudTrack sets id, clears spotify, shows player', () => {
    useAudioPlayerStore.getState().setSoundcloudTrack('abc123')
    expect(useAudioPlayerStore.getState()).toMatchObject({
      soundcloudId: 'abc123',
      spotifyURL: null,
      isVisible: true,
      provider: 'soundcloud'
    })
  })

  it('setSpotifyTrack sets url, clears soundcloud, shows player', () => {
    useAudioPlayerStore.getState().setSpotifyTrack('https://open.spotify.com/track/123')
    expect(useAudioPlayerStore.getState()).toMatchObject({
      soundcloudId: null,
      spotifyURL: 'https://open.spotify.com/track/123',
      isVisible: true,
      provider: 'spotify'
    })
  })

  it('hidePlayer sets isVisible false', () => {
    useAudioPlayerStore.setState({ isVisible: true, provider: 'spotify' })
    useAudioPlayerStore.getState().hidePlayer()
    expect(useAudioPlayerStore.getState().isVisible).toBe(false)
  })

  it('clearTrack resets to initial', () => {
    useAudioPlayerStore.getState().setSpotifyTrack('https://open.spotify.com/track/1')
    useAudioPlayerStore.getState().clearTrack()
    expect(useAudioPlayerStore.getState()).toMatchObject(initialAudioPlayerState)
  })

  it('resetAudioPlayerStore restores defaults', () => {
    useAudioPlayerStore.getState().setSoundcloudTrack('x')
    resetAudioPlayerStore()
    expect(useAudioPlayerStore.getState()).toMatchObject(initialAudioPlayerState)
  })

  it('resetAudioPlayerStore merges partial state', () => {
    resetAudioPlayerStore({ isVisible: true })
    expect(useAudioPlayerStore.getState()).toMatchObject({
      ...initialAudioPlayerState,
      isVisible: true
    })
  })
})
