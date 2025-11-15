import React from 'react'
import renderer from 'react-test-renderer'
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import RootWrapper from './root-wrapper'

// Mock AudioPlayer component
jest.mock('./audio-player', () => jest.fn(() => <div>MockAudioPlayer</div>))

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
    const component = renderer.create(
      <Provider store={store}>
        <RootWrapper>
          <div>Test Child</div>
        </RootWrapper>
      </Provider>
    )

    expect(component.toJSON()).toMatchSnapshot()
  })

  it('passes correct props to AudioPlayer', () => {
    const AudioPlayer = require('./audio-player')
    renderer.create(
      <Provider store={store}>
        <RootWrapper>
          <div>Test Child</div>
        </RootWrapper>
      </Provider>
    )

    expect(AudioPlayer).toHaveBeenCalledWith(
      {
        soundcloudId: '123',
        isVisible: true
      },
      expect.anything()
    )
  })
})
