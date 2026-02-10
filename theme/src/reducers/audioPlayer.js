import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  soundcloudId: null,
  spotifyURL: null,
  isVisible: false,
  provider: null // 'soundcloud' or 'spotify'
}

const audioPlayerSlice = createSlice({
  name: 'audioPlayer',
  initialState,
  reducers: {
    setSoundcloudTrack: (state, action) => {
      state.soundcloudId = action.payload
      state.spotifyURL = null
      state.isVisible = true
      state.provider = 'soundcloud'
    },
    setSpotifyTrack: (state, action) => {
      state.spotifyURL = action.payload
      state.soundcloudId = null
      state.isVisible = true
      state.provider = 'spotify'
    },
    hidePlayer: state => {
      state.isVisible = false
    },
    clearTrack: state => {
      state.soundcloudId = null
      state.spotifyURL = null
      state.isVisible = false
      state.provider = null
    }
  }
})

export const { setSoundcloudTrack, setSpotifyTrack, hidePlayer, clearTrack } = audioPlayerSlice.actions
export default audioPlayerSlice.reducer
