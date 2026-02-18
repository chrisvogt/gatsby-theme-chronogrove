import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import RootWrapper from './root-wrapper'

// Mock AudioPlayer component
jest.mock('./audio-player', () => jest.fn(() => <div data-testid='mock-audio-player'>MockAudioPlayer</div>))

jest.mock('../helpers/color-mode-debug', () => ({
  logColorModeState: jest.fn(),
  logColorModeDebugBanner: jest.fn(),
  isColorModeDebugEnabled: jest.fn(() => false)
}))

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

jest.mock('@gatsbyjs/reach-router', () => ({
  ...jest.requireActual('@gatsbyjs/reach-router'),
  useLocation: jest.fn(() => ({ pathname: '/' }))
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
    document.documentElement.className = ''
    document.documentElement.removeAttribute('data-theme-ui-color-mode')
    document.documentElement.style.backgroundColor = ''
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

  it('sets data-theme-ui-color-mode and HTML background color from rawColors', () => {
    mockUseColorMode.mockReturnValue(['default', jest.fn()])
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

    expect(document.documentElement.getAttribute('data-theme-ui-color-mode')).toBe('default')
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

  it('prefers rawColors.background when colors.background is a CSS variable', () => {
    mockUseThemeUI.mockReturnValue({
      theme: {
        rawColors: {
          background: '#112233'
        },
        colors: {
          background: 'var(--theme-ui-colors-background)'
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

    expect(document.documentElement.style.backgroundColor).toMatch(/rgb\(17,\s*34,\s*51\)|#112233/i)
    expect(document.documentElement.style.backgroundColor).not.toMatch(/var\(/i)
  })

  it('handles dark mode with default background color', () => {
    document.documentElement.classList.add('theme-ui-default')
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
    expect(document.documentElement.classList.contains('theme-ui-dark')).toBe(true)
    expect(document.documentElement.classList.contains('theme-ui-default')).toBe(false)
    expect(document.documentElement.getAttribute('data-theme-ui-color-mode')).toBe('dark')
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
    expect(document.documentElement.classList.contains('theme-ui-default')).toBe(true)
    expect(document.documentElement.getAttribute('data-theme-ui-color-mode')).toBe('default')
  })
})
