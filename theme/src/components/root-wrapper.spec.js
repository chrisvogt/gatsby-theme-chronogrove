import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import RootWrapper from './root-wrapper'

// Mock AudioPlayer component
jest.mock('./audio-player', () => jest.fn(() => <div data-testid='mock-audio-player'>MockAudioPlayer</div>))

// Mock theme-ui hooks
jest.mock('theme-ui', () => ({
  ...jest.requireActual('theme-ui'),
  useColorMode: jest.fn(() => ['light', jest.fn()]),
  useThemeUI: jest.fn(() => ({
    theme: {
      rawColors: {
        background: '#fdf8f5'
      },
      colors: {
        background: '#fdf8f5'
      }
    }
  }))
}))

const mockStore = configureStore([])

describe('RootWrapper', () => {
  let store

  beforeEach(() => {
    store = mockStore({
      audioPlayer: {
        soundcloudId: '123',
        isVisible: true
      }
    })
    store.dispatch = jest.fn()
  })

  it('renders children and AudioPlayer', () => {
    const { asFragment } = render(
      <Provider store={store}>
        <RootWrapper>
          <div>Test Child</div>
        </RootWrapper>
      </Provider>
    )

    expect(asFragment()).toMatchSnapshot()
  })

  it('passes correct props to AudioPlayer', () => {
    const AudioPlayer = require('./audio-player')
    render(
      <Provider store={store}>
        <RootWrapper>
          <div>Test Child</div>
        </RootWrapper>
      </Provider>
    )

    // Check that AudioPlayer was called with the expected props
    expect(AudioPlayer).toHaveBeenCalled()
    const callArgs = AudioPlayer.mock.calls[0][0]
    expect(callArgs.soundcloudId).toBe('123')
    expect(callArgs.isVisible).toBe(true)
  })
})
