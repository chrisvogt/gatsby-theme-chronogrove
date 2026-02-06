import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import RootWrapper from './root-wrapper'

// Mock AudioPlayer component
jest.mock('./audio-player', () => jest.fn(() => <div data-testid='mock-audio-player'>MockAudioPlayer</div>))

// Mock theme-ui hooks with mutable return values
const mockUseColorMode = jest.fn(() => ['light', jest.fn()])
const mockUseThemeUI = jest.fn(() => ({
  theme: {
    rawColors: {
      background: '#fdf8f5'
    },
    colors: {
      background: '#fdf8f5'
    }
  }
}))

jest.mock('theme-ui', () => ({
  ...jest.requireActual('theme-ui'),
  useColorMode: () => mockUseColorMode(),
  useThemeUI: () => mockUseThemeUI()
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

  it('sets HTML background color from rawColors', () => {
    mockUseThemeUI.mockReturnValue({
      theme: {
        rawColors: {
          background: '#ff0000'
        }
      }
    })

    render(
      <Provider store={store}>
        <RootWrapper>
          <div>Test Child</div>
        </RootWrapper>
      </Provider>
    )

    expect(document.documentElement.style.backgroundColor).toBeTruthy()
    expect(document.documentElement.style.backgroundColor).toMatch(/red|rgb\(255,\s*0,\s*0\)|#ff0000/i)
  })

  it('falls back to colors.background when rawColors is not available', () => {
    mockUseThemeUI.mockReturnValue({
      theme: {
        colors: {
          background: '#00ff00'
        }
      }
    })

    render(
      <Provider store={store}>
        <RootWrapper>
          <div>Test Child</div>
        </RootWrapper>
      </Provider>
    )

    expect(document.documentElement.style.backgroundColor).toBeTruthy()
    expect(document.documentElement.style.backgroundColor).toMatch(/green|rgb\(0,\s*255,\s*0\)|#00ff00/i)
  })

  it('handles dark mode with default background color', () => {
    mockUseColorMode.mockReturnValue(['dark', jest.fn()])
    mockUseThemeUI.mockReturnValue({
      theme: {}
    })

    render(
      <Provider store={store}>
        <RootWrapper>
          <div>Test Child</div>
        </RootWrapper>
      </Provider>
    )

    expect(document.documentElement.style.backgroundColor).toBeTruthy()
    // Check that background color is set (browser may convert hex to rgb)
    const bgColor = document.documentElement.style.backgroundColor
    expect(bgColor).toMatch(/rgb\(20,\s*20,\s*31\)|#14141F/i)
  })

  it('handles light mode with default background color', () => {
    mockUseColorMode.mockReturnValue(['light', jest.fn()])
    mockUseThemeUI.mockReturnValue({
      theme: {}
    })

    render(
      <Provider store={store}>
        <RootWrapper>
          <div>Test Child</div>
        </RootWrapper>
      </Provider>
    )

    expect(document.documentElement.style.backgroundColor).toBeTruthy()
    // Check that background color is set (browser may convert hex to rgb)
    const bgColor = document.documentElement.style.backgroundColor
    expect(bgColor).toMatch(/rgb\(253,\s*248,\s*245\)|#fdf8f5/i)
  })
})
