import reducer, { setSoundcloudTrack, setSpotifyTrack, hidePlayer, clearTrack } from '../reducers/audioPlayer'

describe('audioPlayer reducer', () => {
  const initialState = {
    soundcloudId: null,
    spotifyURL: null,
    isVisible: false,
    provider: null
  }

  it('should return the initial state', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState)
  })

  it('should handle setSoundcloudTrack', () => {
    const action = setSoundcloudTrack('abc123')
    const result = reducer(initialState, action)

    expect(result).toEqual({
      soundcloudId: 'abc123',
      spotifyURL: null,
      isVisible: true,
      provider: 'soundcloud'
    })
  })

  it('should handle setSpotifyTrack', () => {
    const action = setSpotifyTrack('https://open.spotify.com/track/123')
    const result = reducer(initialState, action)

    expect(result).toEqual({
      soundcloudId: null,
      spotifyURL: 'https://open.spotify.com/track/123',
      isVisible: true,
      provider: 'spotify'
    })
  })

  it('should handle hidePlayer', () => {
    const prevState = {
      soundcloudId: 'abc123',
      spotifyURL: null,
      isVisible: true,
      provider: 'soundcloud'
    }
    const result = reducer(prevState, hidePlayer())

    expect(result).toEqual({
      soundcloudId: 'abc123',
      spotifyURL: null,
      isVisible: false,
      provider: 'soundcloud'
    })
  })

  it('should handle clearTrack', () => {
    const prevState = {
      soundcloudId: 'abc123',
      spotifyURL: 'https://open.spotify.com/track/123',
      isVisible: true,
      provider: 'spotify'
    }
    const result = reducer(prevState, clearTrack())

    expect(result).toEqual({
      soundcloudId: null,
      spotifyURL: null,
      isVisible: false,
      provider: null
    })
  })
})
