import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
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

describe('InstagramWidget', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.clearAllMocks()
    console.error.mockRestore()
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
})
