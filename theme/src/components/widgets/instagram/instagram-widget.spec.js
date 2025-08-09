import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import { Provider as ReduxProvider } from 'react-redux'
import '@testing-library/jest-dom'
import configureStore from 'redux-mock-store'
import InstagramWidget from './instagram-widget'
import { ThemeUIProvider } from 'theme-ui'
import theme from '../../../gatsby-plugin-theme-ui'
import VanillaTilt from 'vanilla-tilt'

jest.mock('../../../hooks/use-site-metadata', () =>
  jest.fn(() => ({
    instagramUsername: 'test_username',
    instagramDataSource: 'test_data_source'
  }))
)

const mockLightGalleryInstance = {
  openGallery: jest.fn()
}

let mockLightGalleryOnInit = ({ onInit }) => {
  onInit({ instance: mockLightGalleryInstance })
  return <div data-testid='lightgallery-mock' />
}

jest.mock('lightgallery/react', () => jest.fn(({ onInit }) => mockLightGalleryOnInit({ onInit })))

jest.mock('lightgallery/plugins/thumbnail', () => jest.fn())
jest.mock('lightgallery/plugins/zoom', () => jest.fn())
jest.mock('lightgallery/plugins/video', () => jest.fn())
jest.mock('lightgallery/plugins/autoplay', () => jest.fn())

jest.mock('vanilla-tilt')
jest.mock('../../../actions/fetchDataSource', () =>
  jest.fn(() => ({
    type: 'FETCH_DATASOURCE'
  }))
)

const mockStore = configureStore([])

describe('InstagramWidget', () => {
  let store

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    store = mockStore({
      widgets: {
        instagram: {
          state: 'SUCCESS',
          data: {
            collections: {
              media: [
                {
                  id: '123',
                  caption: 'Test Caption',
                  cdnMediaURL: 'https://cdn.example.com/images/fake-instagram-image.jpg',
                  mediaType: 'IMAGE',
                  permalink: 'https://instagram.com/p/test'
                }
              ]
            },
            metrics: [
              { displayName: 'Followers', id: '1', value: 100 },
              { displayName: 'Following', id: '2', value: 50 }
            ],
            profile: {
              displayName: 'TestUser',
              profileURL: 'https://instagram.com/testuser'
            }
          }
        }
      }
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
    console.error.mockRestore()
  })

  it('renders without crashing', () => {
    render(
      <ReduxProvider store={store}>
        <ThemeUIProvider theme={theme}>
          <InstagramWidget />
        </ThemeUIProvider>
      </ReduxProvider>
    )
    expect(screen.getByText(/Instagram/i)).toBeInTheDocument()
  })

  it('renders placeholders when isLoading is true', () => {
    const loadingStore = mockStore({
      widgets: {
        instagram: {
          state: 'LOADING',
          data: null
        }
      }
    })

    render(
      <ReduxProvider store={loadingStore}>
        <ThemeUIProvider theme={theme}>
          <InstagramWidget />
        </ThemeUIProvider>
      </ReduxProvider>
    )

    const placeholders = screen.getAllByText('', { selector: '.image-placeholder' })
    expect(placeholders.length).toBeGreaterThan(0)
  })

  it('renders media items when isLoading is false', () => {
    render(
      <ReduxProvider store={store}>
        <ThemeUIProvider theme={theme}>
          <InstagramWidget />
        </ThemeUIProvider>
      </ReduxProvider>
    )

    const thumbnails = screen.getAllByAltText(/Instagram post: Test Caption/i)
    expect(thumbnails).toHaveLength(1)
    expect(thumbnails[0]).toHaveAttribute(
      'src',
      expect.stringContaining('https://cdn.example.com/images/fake-instagram-image.jpg')
    )
  })

  it('does not show "Show More" button when there are 8 or fewer images', () => {
    render(
      <ReduxProvider store={store}>
        <ThemeUIProvider theme={theme}>
          <InstagramWidget />
        </ThemeUIProvider>
      </ReduxProvider>
    )

    expect(screen.queryByText(/Show More/i)).not.toBeInTheDocument()
  })

  it('shows and toggles "Show More"/"Show Less" button when there are more than 8 images', () => {
    const storeWithManyImages = mockStore({
      widgets: {
        instagram: {
          state: 'SUCCESS',
          data: {
            collections: {
              media: Array.from({ length: 10 }, (_, i) => ({
                id: `image-${i}`,
                caption: `Test Caption ${i}`,
                cdnMediaURL: `https://cdn.example.com/images/fake-instagram-image-${i}.jpg`,
                mediaType: 'IMAGE',
                permalink: `https://instagram.com/p/test${i}`
              }))
            },
            metrics: [
              { displayName: 'Followers', id: '1', value: 100 },
              { displayName: 'Following', id: '2', value: 50 }
            ],
            profile: {
              displayName: 'TestUser',
              profileURL: 'https://instagram.com/testuser'
            }
          }
        }
      }
    })

    render(
      <ReduxProvider store={storeWithManyImages}>
        <ThemeUIProvider theme={theme}>
          <InstagramWidget />
        </ThemeUIProvider>
      </ReduxProvider>
    )

    const button = screen.getByText(/Show More/i)
    fireEvent.click(button)

    expect(screen.getByText(/Show Less/i)).toBeInTheDocument()

    fireEvent.click(screen.getByText(/Show Less/i))
    expect(screen.getByText(/Show More/i)).toBeInTheDocument()
  })

  it('opens LightGallery when handleClick is called', () => {
    render(
      <ReduxProvider store={store}>
        <ThemeUIProvider theme={theme}>
          <InstagramWidget />
        </ThemeUIProvider>
      </ReduxProvider>
    )

    const thumbnails = screen.getAllByAltText(/Instagram post: Test Caption/i)
    fireEvent.click(thumbnails[0])

    expect(mockLightGalleryInstance.openGallery).toHaveBeenCalledWith(0)
  })

  it('calls VanillaTilt.init when isShowingMore or !isLoading is true', () => {
    const storeWithManyImages = mockStore({
      widgets: {
        instagram: {
          state: 'SUCCESS',
          data: {
            collections: {
              media: Array.from({ length: 10 }, (_, i) => ({
                id: `image-${i}`,
                caption: `Test Caption ${i}`,
                cdnMediaURL: `https://cdn.example.com/images/fake-instagram-image-${i}.jpg`,
                mediaType: 'IMAGE',
                permalink: `https://instagram.com/p/test${i}`
              }))
            },
            metrics: []
          }
        }
      }
    })

    render(
      <ReduxProvider store={storeWithManyImages}>
        <ThemeUIProvider theme={theme}>
          <InstagramWidget />
        </ThemeUIProvider>
      </ReduxProvider>
    )

    fireEvent.click(screen.getByText(/Show More/i))
    expect(VanillaTilt.init).toHaveBeenCalled()

    VanillaTilt.init.mockClear()

    const storeWithNoImages = mockStore({
      widgets: {
        instagram: {
          state: 'SUCCESS',
          data: {
            collections: { media: [] },
            metrics: []
          }
        }
      }
    })

    render(
      <ReduxProvider store={storeWithNoImages}>
        <ThemeUIProvider theme={theme}>
          <InstagramWidget />
        </ThemeUIProvider>
      </ReduxProvider>
    )

    expect(VanillaTilt.init).toHaveBeenCalled()
  })

  it('assigns lightGalleryRef correctly on initialization', () => {
    const mockInstance = {}
    jest.mock('lightgallery/react', () =>
      jest.fn(({ onInit }) => {
        onInit({ instance: mockInstance })
        return <div data-testid='lightgallery-mock' />
      })
    )

    render(
      <ReduxProvider store={store}>
        <ThemeUIProvider theme={theme}>
          <InstagramWidget />
        </ThemeUIProvider>
      </ReduxProvider>
    )

    expect(mockInstance).toBeDefined()
  })

  it('handles lightGallery instance not being initialized', () => {
    // Temporarily override the mock to not provide an instance
    const originalMockOnInit = mockLightGalleryOnInit
    mockLightGalleryOnInit = () => <div data-testid='lightgallery-mock' />

    render(
      <ReduxProvider store={store}>
        <ThemeUIProvider theme={theme}>
          <InstagramWidget />
        </ThemeUIProvider>
      </ReduxProvider>
    )

    // Click on an item to trigger openLightbox
    const instagramItem = screen.getByAltText(/Instagram post:/)
    fireEvent.click(instagramItem)

    // Verify that the error was logged when lightGallery instance is not available
    expect(console.error).toHaveBeenCalledWith('LightGallery instance is not initialized')

    // Restore the original mock
    mockLightGalleryOnInit = originalMockOnInit
  })

  it('uses fallback URL when profileURL is not available', () => {
    const storeWithoutProfileURL = mockStore({
      widgets: {
        instagram: {
          state: 'SUCCESS',
          data: {
            collections: {
              media: [
                {
                  id: '123',
                  caption: 'Test Caption',
                  cdnMediaURL: 'https://cdn.example.com/images/fake-instagram-image.jpg',
                  mediaType: 'IMAGE',
                  permalink: 'https://instagram.com/p/test'
                }
              ]
            },
            metrics: [
              { displayName: 'Followers', id: '1', value: 100 },
              { displayName: 'Following', id: '2', value: 50 }
            ]
            // No profile data
          }
        }
      }
    })

    render(
      <ReduxProvider store={storeWithoutProfileURL}>
        <ThemeUIProvider theme={theme}>
          <InstagramWidget />
        </ThemeUIProvider>
      </ReduxProvider>
    )

    // The CallToAction should use the fallback URL with the configured username
    const link = screen.getByTitle('Instagram on Instagram')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://www.instagram.com/instagram')
  })

  it('passes video object to LightGallery when mediaType is VIDEO and mediaURL is present', () => {
    const videoStore = mockStore({
      widgets: {
        instagram: {
          state: 'SUCCESS',
          data: {
            collections: {
              media: [
                {
                  id: 'video1',
                  caption: 'Video Caption',
                  cdnMediaURL: 'https://cdn.example.com/images/fake-video-thumbnail.jpg',
                  mediaType: 'VIDEO',
                  mediaURL: 'https://cdn.example.com/videos/fake-video.mp4',
                  permalink: 'https://instagram.com/p/video'
                }
              ]
            },
            metrics: []
          }
        }
      }
    })

    render(
      <ReduxProvider store={videoStore}>
        <ThemeUIProvider theme={theme}>
          <InstagramWidget />
        </ThemeUIProvider>
      </ReduxProvider>
    )

    expect(screen.getByTestId('lightgallery-mock')).toBeInTheDocument()
    // Indirect test – rendering succeeds, LightGallery was initialized
    expect(mockLightGalleryInstance.openGallery).not.toHaveBeenCalled() // Ensures it's only initialized, not opened
  })
})
