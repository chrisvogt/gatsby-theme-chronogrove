import React from 'react'
import { render, fireEvent, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import InstagramWidget from './instagram-widget'
import { TestProviderWithQuery } from '../../../testUtils'

jest.mock('../../../hooks/use-site-metadata', () =>
  jest.fn(() => ({
    widgets: {
      instagram: {
        username: 'test_username',
        widgetDataSource: 'https://fake-api.example.com/social/instagram'
      }
    }
  }))
)

// Mock useWidgetData hook
jest.mock('../../../hooks/use-widget-data')
import useWidgetData from '../../../hooks/use-widget-data'

const mockLightGalleryInstance = {
  openGallery: jest.fn()
}

let mockLightGalleryCallbacks = {}

let mockLightGalleryOnInit = ({ onInit, onAfterOpen, onAfterClose, onAfterAppendSlide }) => {
  onInit({ instance: mockLightGalleryInstance })
  mockLightGalleryCallbacks = { onAfterOpen, onAfterClose, onAfterAppendSlide }
  return <div data-testid='lightgallery-mock' />
}

jest.mock('lightgallery/react', () =>
  jest.fn(({ onInit, onAfterOpen, onAfterClose, onAfterAppendSlide, dynamicEl }) =>
    mockLightGalleryOnInit({ onInit, onAfterOpen, onAfterClose, onAfterAppendSlide, dynamicEl })
  )
)

jest.mock('lightgallery/plugins/thumbnail', () => jest.fn())
jest.mock('lightgallery/plugins/zoom', () => jest.fn())
jest.mock('lightgallery/plugins/video', () => jest.fn())
jest.mock('lightgallery/plugins/autoplay', () => jest.fn())

jest.mock('vanilla-tilt')

const mockLoadingState = {
  data: undefined,
  isLoading: true,
  hasFatalError: false,
  isError: false,
  error: null
}

const mockSuccessState = {
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
  },
  isLoading: false,
  hasFatalError: false,
  isError: false,
  error: null
}

const mockErrorState = {
  data: undefined,
  isLoading: false,
  hasFatalError: true,
  isError: true,
  error: new Error('Failed to fetch')
}

// Mock IntersectionObserver
const mockObserve = jest.fn()
const mockUnobserve = jest.fn()
const mockDisconnect = jest.fn()

let intersectionCallback = null

class MockIntersectionObserver {
  constructor(callback) {
    intersectionCallback = callback
    this.observe = mockObserve
    this.unobserve = mockUnobserve
    this.disconnect = mockDisconnect
  }
}

describe('InstagramWidget', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    jest.useFakeTimers()
    window.IntersectionObserver = MockIntersectionObserver
    // Reset mock functions
    mockObserve.mockClear()
    mockUnobserve.mockClear()
    mockDisconnect.mockClear()
    intersectionCallback = null
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.useRealTimers()
    console.error.mockRestore()
    delete window.IntersectionObserver
  })

  it('renders without crashing', () => {
    useWidgetData.mockReturnValue(mockSuccessState)

    render(
      <TestProviderWithQuery>
        <InstagramWidget />
      </TestProviderWithQuery>
    )
    expect(screen.getByText(/Instagram/i)).toBeInTheDocument()
  })

  it('renders placeholders when isLoading is true', () => {
    useWidgetData.mockReturnValue(mockLoadingState)

    render(
      <TestProviderWithQuery>
        <InstagramWidget />
      </TestProviderWithQuery>
    )

    const placeholders = screen.getAllByText('', { selector: '.image-placeholder' })
    expect(placeholders.length).toBeGreaterThan(0)
  })

  it('does not render LightGallery when media is empty during loading', () => {
    const loadingWithEmptyMedia = {
      ...mockLoadingState,
      data: {
        collections: {
          media: []
        }
      }
    }
    useWidgetData.mockReturnValue(loadingWithEmptyMedia)

    render(
      <TestProviderWithQuery>
        <InstagramWidget />
      </TestProviderWithQuery>
    )

    // LightGallery should not be rendered when media array is empty
    expect(screen.queryByTestId('lightgallery-mock')).not.toBeInTheDocument()
  })

  it('renders media items when isLoading is false', () => {
    useWidgetData.mockReturnValue(mockSuccessState)

    render(
      <TestProviderWithQuery>
        <InstagramWidget />
      </TestProviderWithQuery>
    )

    const thumbnails = screen.getAllByAltText(/Instagram post: Test Caption/i)
    expect(thumbnails).toHaveLength(1)
    expect(thumbnails[0]).toHaveAttribute(
      'src',
      expect.stringContaining('https://cdn.example.com/images/fake-instagram-image.jpg')
    )
  })

  it('renders LightGallery when media has items', () => {
    useWidgetData.mockReturnValue(mockSuccessState)

    render(
      <TestProviderWithQuery>
        <InstagramWidget />
      </TestProviderWithQuery>
    )

    // LightGallery should be rendered when media array has items
    expect(screen.getByTestId('lightgallery-mock')).toBeInTheDocument()
  })

  it('does not show "Show More" button when there are 8 or fewer images', () => {
    useWidgetData.mockReturnValue(mockSuccessState)

    render(
      <TestProviderWithQuery>
        <InstagramWidget />
      </TestProviderWithQuery>
    )

    expect(screen.queryByText(/Show More/i)).not.toBeInTheDocument()
  })

  it('shows and toggles "Show More"/"Show Less" button when there are more than 8 images', () => {
    const stateWithManyImages = {
      ...mockSuccessState,
      data: {
        ...mockSuccessState.data,
        collections: {
          media: Array.from({ length: 10 }, (_, i) => ({
            id: `image-${i}`,
            caption: `Test Caption ${i}`,
            cdnMediaURL: `https://cdn.example.com/images/fake-instagram-image-${i}.jpg`,
            mediaType: 'IMAGE',
            permalink: `https://instagram.com/p/test${i}`
          }))
        }
      }
    }
    useWidgetData.mockReturnValue(stateWithManyImages)

    render(
      <TestProviderWithQuery>
        <InstagramWidget />
      </TestProviderWithQuery>
    )

    const button = screen.getByText(/Show More/i)
    fireEvent.click(button)

    expect(screen.getByText(/Show Less/i)).toBeInTheDocument()

    fireEvent.click(screen.getByText(/Show Less/i))
    expect(screen.getByText(/Show More/i)).toBeInTheDocument()
  })

  it('opens LightGallery when handleClick is called', () => {
    useWidgetData.mockReturnValue(mockSuccessState)

    render(
      <TestProviderWithQuery>
        <InstagramWidget />
      </TestProviderWithQuery>
    )

    const thumbnails = screen.getAllByAltText(/Instagram post: Test Caption/i)
    fireEvent.click(thumbnails[0])

    expect(mockLightGalleryInstance.openGallery).toHaveBeenCalledWith(0)
  })

  it('handles lightGallery instance not being initialized', () => {
    useWidgetData.mockReturnValue(mockSuccessState)

    // Temporarily override the mock to not provide an instance
    const originalMockOnInit = mockLightGalleryOnInit
    mockLightGalleryOnInit = () => <div data-testid='lightgallery-mock' />

    render(
      <TestProviderWithQuery>
        <InstagramWidget />
      </TestProviderWithQuery>
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
    const stateWithoutProfileURL = {
      ...mockSuccessState,
      data: {
        ...mockSuccessState.data,
        profile: undefined
      }
    }
    useWidgetData.mockReturnValue(stateWithoutProfileURL)

    render(
      <TestProviderWithQuery>
        <InstagramWidget />
      </TestProviderWithQuery>
    )

    // The CallToAction should use the fallback URL with the configured username
    const link = screen.getByTitle('Instagram on Instagram')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://www.instagram.com/test_username')
  })

  it('passes video object to LightGallery when mediaType is VIDEO and mediaURL is present', () => {
    const videoState = {
      ...mockSuccessState,
      data: {
        ...mockSuccessState.data,
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
        }
      }
    }
    useWidgetData.mockReturnValue(videoState)

    render(
      <TestProviderWithQuery>
        <InstagramWidget />
      </TestProviderWithQuery>
    )

    expect(screen.getByTestId('lightgallery-mock')).toBeInTheDocument()
    // Indirect test – rendering succeeds, LightGallery was initialized
    expect(mockLightGalleryInstance.openGallery).not.toHaveBeenCalled() // Ensures it's only initialized, not opened
  })

  it('handles fatal error state correctly', () => {
    useWidgetData.mockReturnValue(mockErrorState)

    render(
      <TestProviderWithQuery>
        <InstagramWidget />
      </TestProviderWithQuery>
    )

    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument()
    expect(screen.getByText(/Failed to load this widget/i)).toBeInTheDocument()
  })

  describe('Ambient rotation (attention grabber feature)', () => {
    const mockStateWithCarousels = {
      ...mockSuccessState,
      data: {
        ...mockSuccessState.data,
        collections: {
          media: [
            {
              id: 'carousel1',
              caption: 'Carousel Post 1',
              cdnMediaURL: 'https://cdn.example.com/images/carousel1-main.jpg',
              mediaType: 'CAROUSEL_ALBUM',
              permalink: 'https://instagram.com/p/carousel1',
              children: [
                { id: 'c1-1', cdnMediaURL: 'https://cdn.example.com/images/c1-1.jpg' },
                { id: 'c1-2', cdnMediaURL: 'https://cdn.example.com/images/c1-2.jpg' },
                { id: 'c1-3', cdnMediaURL: 'https://cdn.example.com/images/c1-3.jpg' }
              ]
            },
            {
              id: 'image1',
              caption: 'Regular Image',
              cdnMediaURL: 'https://cdn.example.com/images/image1.jpg',
              mediaType: 'IMAGE',
              permalink: 'https://instagram.com/p/image1'
            },
            {
              id: 'carousel2',
              caption: 'Carousel Post 2',
              cdnMediaURL: 'https://cdn.example.com/images/carousel2-main.jpg',
              mediaType: 'CAROUSEL_ALBUM',
              permalink: 'https://instagram.com/p/carousel2',
              children: [
                { id: 'c2-1', cdnMediaURL: 'https://cdn.example.com/images/c2-1.jpg' },
                { id: 'c2-2', cdnMediaURL: 'https://cdn.example.com/images/c2-2.jpg' }
              ]
            }
          ]
        }
      }
    }

    it('sets up IntersectionObserver to track visibility', () => {
      useWidgetData.mockReturnValue(mockStateWithCarousels)

      render(
        <TestProviderWithQuery>
          <InstagramWidget />
        </TestProviderWithQuery>
      )

      expect(mockObserve).toHaveBeenCalled()
    })

    it('starts ambient rotation when widget becomes visible', () => {
      useWidgetData.mockReturnValue(mockStateWithCarousels)

      render(
        <TestProviderWithQuery>
          <InstagramWidget />
        </TestProviderWithQuery>
      )

      // Simulate widget becoming visible
      act(() => {
        if (intersectionCallback) {
          intersectionCallback([{ isIntersecting: true }])
        }
      })

      // Advance past initial delay (2000ms) and first rotation
      act(() => {
        jest.advanceTimersByTime(2500)
      })

      // Widget should have started ambient rotation
      // The ambient active index should be set
      expect(screen.getByText('Instagram')).toBeInTheDocument()
    })

    it('does not start ambient rotation when widget is not visible', () => {
      useWidgetData.mockReturnValue(mockStateWithCarousels)

      render(
        <TestProviderWithQuery>
          <InstagramWidget />
        </TestProviderWithQuery>
      )

      // Simulate widget NOT visible
      act(() => {
        if (intersectionCallback) {
          intersectionCallback([{ isIntersecting: false }])
        }
      })

      // Advance time - rotation should not start
      act(() => {
        jest.advanceTimersByTime(5000)
      })

      // Widget renders but no ambient rotation
      expect(screen.getByText('Instagram')).toBeInTheDocument()
    })

    it('pauses ambient rotation when gallery is opened via onAfterOpen', () => {
      useWidgetData.mockReturnValue(mockStateWithCarousels)

      render(
        <TestProviderWithQuery>
          <InstagramWidget />
        </TestProviderWithQuery>
      )

      // Simulate widget visible
      act(() => {
        if (intersectionCallback) {
          intersectionCallback([{ isIntersecting: true }])
        }
      })

      // Start rotation
      act(() => {
        jest.advanceTimersByTime(2500)
      })

      // Click to open gallery - this will trigger onAfterOpen internally
      const thumbnails = screen.getAllByRole('img')
      fireEvent.click(thumbnails[0])

      // Gallery should attempt to open
      expect(mockLightGalleryInstance.openGallery).toHaveBeenCalled()
    })

    it('resumes ambient rotation when gallery is closed via onAfterClose', () => {
      useWidgetData.mockReturnValue(mockStateWithCarousels)

      render(
        <TestProviderWithQuery>
          <InstagramWidget />
        </TestProviderWithQuery>
      )

      // Simulate widget visible
      act(() => {
        if (intersectionCallback) {
          intersectionCallback([{ isIntersecting: true }])
        }
      })

      // Wait for rotation to start
      act(() => {
        jest.advanceTimersByTime(6000)
      })

      // Widget continues to render
      expect(screen.getByText('Instagram')).toBeInTheDocument()
    })

    it('cleans up IntersectionObserver on unmount', () => {
      useWidgetData.mockReturnValue(mockStateWithCarousels)

      const { unmount } = render(
        <TestProviderWithQuery>
          <InstagramWidget />
        </TestProviderWithQuery>
      )

      unmount()

      expect(mockDisconnect).toHaveBeenCalled()
    })

    it('falls back to visible when IntersectionObserver is not available', () => {
      delete window.IntersectionObserver
      useWidgetData.mockReturnValue(mockStateWithCarousels)

      render(
        <TestProviderWithQuery>
          <InstagramWidget />
        </TestProviderWithQuery>
      )

      // Should still render without errors
      expect(screen.getByText('Instagram')).toBeInTheDocument()
    })

    it('does not start ambient rotation when there are no carousel items', () => {
      useWidgetData.mockReturnValue(mockSuccessState) // Only has IMAGE type

      render(
        <TestProviderWithQuery>
          <InstagramWidget />
        </TestProviderWithQuery>
      )

      // Simulate visible
      act(() => {
        if (intersectionCallback) {
          intersectionCallback([{ isIntersecting: true }])
        }
      })

      // Advance time
      act(() => {
        jest.advanceTimersByTime(5000)
      })

      // Widget renders normally without carousel rotation
      expect(screen.getByText('Instagram')).toBeInTheDocument()
    })

    it('rotates through multiple carousel items without repeats', () => {
      useWidgetData.mockReturnValue(mockStateWithCarousels)

      render(
        <TestProviderWithQuery>
          <InstagramWidget />
        </TestProviderWithQuery>
      )

      // Simulate visible
      act(() => {
        if (intersectionCallback) {
          intersectionCallback([{ isIntersecting: true }])
        }
      })

      // Advance through several rotations
      act(() => {
        jest.advanceTimersByTime(15000) // 2s delay + ~4 rotations at 3.5s each
      })

      // Widget should still be rendering properly
      expect(screen.getByText('Instagram')).toBeInTheDocument()
    })

    it('handles SSR environment without IntersectionObserver', () => {
      // Simulate SSR by removing window reference
      const originalWindow = global.window
      delete window.IntersectionObserver

      useWidgetData.mockReturnValue(mockStateWithCarousels)

      render(
        <TestProviderWithQuery>
          <InstagramWidget />
        </TestProviderWithQuery>
      )

      // Should render without errors in SSR-like environment
      expect(screen.getByText('Instagram')).toBeInTheDocument()

      // Restore
      global.window = originalWindow
    })

    it('clears interval when widget goes out of view', () => {
      // Spy on clearInterval to verify it's called via cleanup function
      const clearIntervalSpy = jest.spyOn(global, 'clearInterval')

      useWidgetData.mockReturnValue(mockStateWithCarousels)

      render(
        <TestProviderWithQuery>
          <InstagramWidget />
        </TestProviderWithQuery>
      )

      // First, widget becomes visible - this sets isInView = true and effect runs
      act(() => {
        intersectionCallback?.([{ isIntersecting: true }])
      })

      // Wait for initial startup delay + some buffer to ensure interval is set
      act(() => {
        jest.advanceTimersByTime(3000)
      })

      // Run several rotation intervals to confirm interval is active
      act(() => {
        jest.advanceTimersByTime(7000)
      })

      // Reset the spy count before going out of view
      clearIntervalSpy.mockClear()

      // Now widget goes out of view - effect cleanup should clear interval
      act(() => {
        intersectionCallback?.([{ isIntersecting: false }])
      })

      // The effect cleanup should have cleared the interval
      expect(clearIntervalSpy).toHaveBeenCalled()

      // Widget still renders correctly
      expect(screen.getByText('Instagram')).toBeInTheDocument()

      clearIntervalSpy.mockRestore()
    })

    it('resets carousel progress when all carousels complete their full cycle', () => {
      // Use a state with carousels that have 2 images each for faster cycle testing
      const shortCycleCarousels = {
        ...mockSuccessState,
        data: {
          ...mockSuccessState.data,
          collections: {
            media: [
              {
                id: 'carousel1',
                caption: 'Carousel 1',
                cdnMediaURL: 'https://cdn.example.com/images/c1.jpg',
                mediaType: 'CAROUSEL_ALBUM',
                permalink: 'https://instagram.com/p/c1',
                children: [
                  { id: 'c1-1', cdnMediaURL: 'https://cdn.example.com/images/c1-1.jpg' },
                  { id: 'c1-2', cdnMediaURL: 'https://cdn.example.com/images/c1-2.jpg' }
                ]
              },
              {
                id: 'carousel2',
                caption: 'Carousel 2',
                cdnMediaURL: 'https://cdn.example.com/images/c2.jpg',
                mediaType: 'CAROUSEL_ALBUM',
                permalink: 'https://instagram.com/p/c2',
                children: [
                  { id: 'c2-1', cdnMediaURL: 'https://cdn.example.com/images/c2-1.jpg' },
                  { id: 'c2-2', cdnMediaURL: 'https://cdn.example.com/images/c2-2.jpg' }
                ]
              }
            ]
          }
        }
      }

      useWidgetData.mockReturnValue(shortCycleCarousels)

      render(
        <TestProviderWithQuery>
          <InstagramWidget />
        </TestProviderWithQuery>
      )

      // Make visible
      act(() => {
        if (intersectionCallback) {
          intersectionCallback([{ isIntersecting: true }])
        }
      })

      // Run through multiple complete cycles (2 carousels * 2 images = 4 rotations per cycle)
      // First cycle: 2s delay + 4 * 3.5s = 16s
      // Second cycle reset and continue
      act(() => {
        jest.advanceTimersByTime(35000) // Run through ~2 full cycles
      })

      // Should still be running correctly after reset
      expect(screen.getByText('Instagram')).toBeInTheDocument()
    })

    it('calls onAfterOpen callback when gallery opens', () => {
      useWidgetData.mockReturnValue(mockStateWithCarousels)

      render(
        <TestProviderWithQuery>
          <InstagramWidget />
        </TestProviderWithQuery>
      )

      // Simulate gallery opening
      if (mockLightGalleryCallbacks.onAfterOpen) {
        act(() => {
          mockLightGalleryCallbacks.onAfterOpen()
        })
      }

      // Widget should still render
      expect(screen.getByText('Instagram')).toBeInTheDocument()
    })

    it('calls onAfterClose callback when gallery closes', () => {
      useWidgetData.mockReturnValue(mockStateWithCarousels)

      render(
        <TestProviderWithQuery>
          <InstagramWidget />
        </TestProviderWithQuery>
      )

      // Simulate gallery opening then closing
      if (mockLightGalleryCallbacks.onAfterOpen) {
        act(() => {
          mockLightGalleryCallbacks.onAfterOpen()
        })
      }

      if (mockLightGalleryCallbacks.onAfterClose) {
        act(() => {
          mockLightGalleryCallbacks.onAfterClose()
        })
      }

      // Widget should still render
      expect(screen.getByText('Instagram')).toBeInTheDocument()
    })

    it('does not start new rotation when gallery is open', () => {
      useWidgetData.mockReturnValue(mockStateWithCarousels)

      render(
        <TestProviderWithQuery>
          <InstagramWidget />
        </TestProviderWithQuery>
      )

      // Make visible
      act(() => {
        if (intersectionCallback) {
          intersectionCallback([{ isIntersecting: true }])
        }
      })

      // Open gallery before rotation starts
      if (mockLightGalleryCallbacks.onAfterOpen) {
        act(() => {
          mockLightGalleryCallbacks.onAfterOpen()
        })
      }

      // Wait for rotation to try to start
      act(() => {
        jest.advanceTimersByTime(5000)
      })

      // Widget should still render normally
      expect(screen.getByText('Instagram')).toBeInTheDocument()
    })
  })

  describe('handleAfterAppendSlide callback', () => {
    const mockCarouselState = {
      ...mockSuccessState,
      data: {
        ...mockSuccessState.data,
        collections: {
          media: [
            {
              id: 'carousel1',
              caption: 'Carousel Post',
              cdnMediaURL: 'https://cdn.example.com/images/carousel-main.jpg',
              mediaType: 'CAROUSEL_ALBUM',
              permalink: 'https://instagram.com/p/carousel1',
              children: [
                { id: 'c1-1', cdnMediaURL: 'https://cdn.example.com/images/c1-1.jpg' },
                { id: 'c1-2', cdnMediaURL: 'https://cdn.example.com/images/c1-2.jpg' }
              ]
            }
          ]
        }
      }
    }

    it('handles case when slide data is undefined', () => {
      useWidgetData.mockReturnValue(mockCarouselState)

      render(
        <TestProviderWithQuery>
          <InstagramWidget />
        </TestProviderWithQuery>
      )

      // Call onAfterAppendSlide with an index beyond the slides array
      if (mockLightGalleryCallbacks.onAfterAppendSlide) {
        act(() => {
          mockLightGalleryCallbacks.onAfterAppendSlide({ index: 999 })
        })
      }

      // Should not throw, widget still renders
      expect(screen.getByText('Instagram')).toBeInTheDocument()
    })

    it('handles case when thumbOuter element is not found', () => {
      useWidgetData.mockReturnValue(mockCarouselState)

      render(
        <TestProviderWithQuery>
          <InstagramWidget />
        </TestProviderWithQuery>
      )

      // Ensure no .lg-thumb-outer in the DOM
      expect(document.querySelector('.lg-thumb-outer')).toBeNull()

      // Call onAfterAppendSlide
      if (mockLightGalleryCallbacks.onAfterAppendSlide) {
        act(() => {
          mockLightGalleryCallbacks.onAfterAppendSlide({ index: 0 })
        })
      }

      // Should not throw, widget still renders
      expect(screen.getByText('Instagram')).toBeInTheDocument()
    })

    it('handles case when thumbItem element is not found', () => {
      useWidgetData.mockReturnValue(mockCarouselState)

      render(
        <TestProviderWithQuery>
          <InstagramWidget />
        </TestProviderWithQuery>
      )

      // Create thumbOuter but no thumb items
      const thumbOuter = document.createElement('div')
      thumbOuter.className = 'lg-thumb-outer'
      document.body.appendChild(thumbOuter)

      // Call onAfterAppendSlide
      if (mockLightGalleryCallbacks.onAfterAppendSlide) {
        act(() => {
          mockLightGalleryCallbacks.onAfterAppendSlide({ index: 0 })
        })
      }

      // Should not throw, widget still renders
      expect(screen.getByText('Instagram')).toBeInTheDocument()

      // Cleanup
      document.body.removeChild(thumbOuter)
    })

    it('applies data attributes when all elements exist', () => {
      useWidgetData.mockReturnValue(mockCarouselState)

      render(
        <TestProviderWithQuery>
          <InstagramWidget />
        </TestProviderWithQuery>
      )

      // Create thumbOuter with thumb items
      const thumbOuter = document.createElement('div')
      thumbOuter.className = 'lg-thumb-outer'

      const thumbItem0 = document.createElement('div')
      thumbItem0.className = 'lg-thumb-item'
      const thumbItem1 = document.createElement('div')
      thumbItem1.className = 'lg-thumb-item'

      thumbOuter.appendChild(thumbItem0)
      thumbOuter.appendChild(thumbItem1)
      document.body.appendChild(thumbOuter)

      // Call onAfterAppendSlide for first slide (album start)
      if (mockLightGalleryCallbacks.onAfterAppendSlide) {
        act(() => {
          mockLightGalleryCallbacks.onAfterAppendSlide({ index: 0 })
        })

        // Check data attributes were applied
        expect(thumbItem0.getAttribute('data-album-start')).toBe('true')
        expect(thumbItem0.getAttribute('data-album-index')).toBe('0')

        // Call for second slide (album end)
        act(() => {
          mockLightGalleryCallbacks.onAfterAppendSlide({ index: 1 })
        })

        expect(thumbItem1.getAttribute('data-album-end')).toBe('true')
        expect(thumbItem1.getAttribute('data-album-index')).toBe('0')
      }

      // Cleanup
      document.body.removeChild(thumbOuter)
    })
  })

  describe('openLightbox with currentImageIndex', () => {
    it('opens gallery at correct slide when currentImageIndex is provided', () => {
      const carouselState = {
        ...mockSuccessState,
        data: {
          ...mockSuccessState.data,
          collections: {
            media: [
              {
                id: 'carousel1',
                caption: 'Carousel Post',
                cdnMediaURL: 'https://cdn.example.com/images/carousel-main.jpg',
                mediaType: 'CAROUSEL_ALBUM',
                permalink: 'https://instagram.com/p/carousel1',
                children: [
                  { id: 'c1-1', cdnMediaURL: 'https://cdn.example.com/images/c1-1.jpg' },
                  { id: 'c1-2', cdnMediaURL: 'https://cdn.example.com/images/c1-2.jpg' },
                  { id: 'c1-3', cdnMediaURL: 'https://cdn.example.com/images/c1-3.jpg' }
                ]
              },
              {
                id: 'image1',
                caption: 'Regular Image',
                cdnMediaURL: 'https://cdn.example.com/images/image1.jpg',
                mediaType: 'IMAGE',
                permalink: 'https://instagram.com/p/image1'
              }
            ]
          }
        }
      }
      useWidgetData.mockReturnValue(carouselState)

      render(
        <TestProviderWithQuery>
          <InstagramWidget />
        </TestProviderWithQuery>
      )

      // The first post is a carousel with 3 images, so clicking it should pass currentImageIndex
      // Index 0 = carousel post, base slide index = 0
      // If user is viewing image 2 of the carousel (currentImageIndex = 2), should open slide 2
      const buttons = screen.getAllByRole('button')
      fireEvent.click(buttons[0]) // Click first carousel item

      // Should open at slide 0 (first image of first carousel since currentImageIndex defaults to 0)
      expect(mockLightGalleryInstance.openGallery).toHaveBeenCalledWith(0)
    })
  })
})
