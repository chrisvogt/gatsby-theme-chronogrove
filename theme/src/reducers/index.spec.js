import rootReducer from './index'

describe('Root Reducer', () => {
  it('combines reducers correctly', () => {
    const initialState = {
      audioPlayer: { isPlaying: false }
    }

    const action = { type: 'TEST_ACTION' }
    const state = rootReducer(initialState, action)

    expect(state).toHaveProperty('audioPlayer')
  })

  it('includes audioPlayer reducer', () => {
    const state = rootReducer(undefined, { type: '@@INIT' })

    // Test that the structure includes the audioPlayer reducer
    expect(state).toHaveProperty('audioPlayer')
  })

  it('handles audioPlayer actions', () => {
    const state = rootReducer(undefined, { type: 'audioPlayer/play', payload: { trackId: '123' } })
    expect(state.audioPlayer).toBeDefined()
  })
})
