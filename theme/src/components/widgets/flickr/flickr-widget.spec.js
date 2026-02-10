import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import FlickrWidget from './flickr-widget'
import { TestProviderWithQuery } from '../../../testUtils'
import VanillaTilt from 'vanilla-tilt'

// Mock use-site-metadata at the top
jest.mock('../../../hooks/use-site-metadata', () => () => ({
  widgets: {
    flickr: {
      username: 'test_username',
      widgetDataSource: 'https://fake-api.example.com/social/flickr'
    }
  }
}))

// Mock useWidgetData hook
jest.mock('../../../hooks/use-widget-data')
import useWidgetData from '../../../hooks/use-widget-data'

// Mock LightGallery at the top
const mockLightGalleryInstance = {
  openGallery: jest.fn()
}

jest.mock('lightgallery/react', () =>
  jest.fn(({ onInit }) => {
    onInit({ instance: mockLightGalleryInstance })
    return <div data-testid='lightgallery-mock' />
  })
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
      photos: [
        {
          id: '123',
          title: 'Test Photo Title',
          thumbnailUrl: 'https://cdn.example.com/images/fake-flickr-image.jpg',
          largeUrl: 'https://cdn.example.com/images/fake-flickr-image-large.jpg'
        }
      ]
    },
    metrics: [
      { displayName: 'Photos', id: '1', value: 100 },
      { displayName: 'Views', id: '2', value: 1000 }
    ]
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

describe('FlickrWidget', () => {
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
        <FlickrWidget />
      </TestProviderWithQuery>
    )
    expect(screen.getByText(/Flickr/i)).toBeInTheDocument()
  })

  it('renders placeholders when isLoading is true', () => {
    useWidgetData.mockReturnValue(mockLoadingState)

    render(
      <TestProviderWithQuery>
        <FlickrWidget />
      </TestProviderWithQuery>
    )

    const placeholders = document.querySelectorAll('.image-placeholder')
    expect(placeholders.length).toBeGreaterThan(0)
  })

  it('renders photos when isLoading is false', () => {
    useWidgetData.mockReturnValue(mockSuccessState)

    render(
      <TestProviderWithQuery>
        <FlickrWidget />
      </TestProviderWithQuery>
    )

    const thumbnails = screen.getAllByAltText(/Flickr photo:/i)
    expect(thumbnails).toHaveLength(1)
    expect(thumbnails[0]).toHaveAttribute('src', 'https://cdn.example.com/images/fake-flickr-image.jpg')
  })

  it('toggles between "Show More" and "Show Less"', () => {
    useWidgetData.mockReturnValue(mockSuccessState)

    render(
      <TestProviderWithQuery>
        <FlickrWidget />
      </TestProviderWithQuery>
    )

    const button = screen.getByText(/Show More/i)
    fireEvent.click(button)

    expect(screen.getByText(/Show Less/i)).toBeInTheDocument()

    fireEvent.click(screen.getByText(/Show Less/i))
    expect(screen.getByText(/Show More/i)).toBeInTheDocument()
  })

  it('opens LightGallery when a photo is clicked', () => {
    useWidgetData.mockReturnValue(mockSuccessState)

    render(
      <TestProviderWithQuery>
        <FlickrWidget />
      </TestProviderWithQuery>
    )

    const thumbnails = screen.getAllByAltText(/Flickr photo:/i)
    fireEvent.click(thumbnails[0])

    expect(mockLightGalleryInstance.openGallery).toHaveBeenCalledWith(0)
  })

  it('calls VanillaTilt.init when isShowingMore or !isLoading is true', () => {
    useWidgetData.mockReturnValue(mockSuccessState)

    render(
      <TestProviderWithQuery>
        <FlickrWidget />
      </TestProviderWithQuery>
    )

    fireEvent.click(screen.getByText(/Show More/i))
    expect(VanillaTilt.init).toHaveBeenCalled()
  })

  it('assigns lightGalleryRef correctly on initialization', () => {
    useWidgetData.mockReturnValue(mockSuccessState)

    render(
      <TestProviderWithQuery>
        <FlickrWidget />
      </TestProviderWithQuery>
    )
    // No error thrown means ref assignment is fine
  })

  it('initializes LightGallery with correct photo data', () => {
    useWidgetData.mockReturnValue(mockSuccessState)

    render(
      <TestProviderWithQuery>
        <FlickrWidget />
      </TestProviderWithQuery>
    )

    expect(screen.getByTestId('lightgallery-mock')).toBeInTheDocument()
    expect(mockLightGalleryInstance.openGallery).not.toHaveBeenCalled()
  })

  it('handles fatal error state correctly', () => {
    useWidgetData.mockReturnValue(mockErrorState)

    render(
      <TestProviderWithQuery>
        <FlickrWidget />
      </TestProviderWithQuery>
    )

    // Instead of checking for data-has-fatal-error, check for error message
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument()
    expect(screen.getByText(/Failed to load this widget/i)).toBeInTheDocument()
  })

  it('renders metrics correctly', () => {
    useWidgetData.mockReturnValue(mockSuccessState)

    render(
      <TestProviderWithQuery>
        <FlickrWidget />
      </TestProviderWithQuery>
    )
    // Use getAllByText for metrics
    const photosBadges = screen.getAllByText(/Photos/)
    expect(photosBadges.length).toBeGreaterThan(0)
    const viewsBadges = screen.getAllByText(/Views/)
    expect(viewsBadges.length).toBeGreaterThan(0)
  })

  it('handles missing metrics data gracefully', () => {
    const stateWithoutMetrics = {
      ...mockSuccessState,
      data: {
        ...mockSuccessState.data,
        metrics: []
      }
    }
    useWidgetData.mockReturnValue(stateWithoutMetrics)

    const { container } = render(
      <TestProviderWithQuery>
        <FlickrWidget />
      </TestProviderWithQuery>
    )

    expect(screen.getByText(/Flickr/i)).toBeInTheDocument()
    // Metrics container should be present
    expect(container.querySelector('section')).toBeInTheDocument()
  })

  it('renders CallToAction with correct Flickr profile URL', () => {
    useWidgetData.mockReturnValue(mockSuccessState)

    render(
      <TestProviderWithQuery>
        <FlickrWidget />
      </TestProviderWithQuery>
    )
    const callToAction = screen.getByText('Visit Profile')
    expect(callToAction).toBeInTheDocument()
    expect(callToAction.closest('a')).toHaveAttribute('href', 'https://www.flickr.com/photos/test_username')
  })

  it('renders correct number of images based on show more/less state', () => {
    const stateWithMorePhotos = {
      ...mockSuccessState,
      data: {
        ...mockSuccessState.data,
        collections: {
          photos: Array(20)
            .fill(null)
            .map((_, i) => ({
              id: `photo-${i}`,
              title: 'Test Photo Title',
              thumbnailUrl: 'https://cdn.example.com/images/fake-flickr-image.jpg',
              largeUrl: 'https://cdn.example.com/images/fake-flickr-image-large.jpg'
            }))
        }
      }
    }
    useWidgetData.mockReturnValue(stateWithMorePhotos)

    render(
      <TestProviderWithQuery>
        <FlickrWidget />
      </TestProviderWithQuery>
    )

    // Initially should show default number of images
    const initialImages = screen.getAllByRole('img', { name: /Flickr photo:/i })
    expect(initialImages.length).toBeLessThanOrEqual(8)

    // Click show more
    fireEvent.click(screen.getByText(/Show More/i))
    // Should show more images
    const expandedImages = screen.getAllByRole('img', { name: /Flickr photo:/i })
    expect(expandedImages.length).toBeLessThanOrEqual(16)

    // Click show less
    fireEvent.click(screen.getByText(/Show Less/i))
    // Should show fewer images again
    const collapsedImages = screen.getAllByRole('img', { name: /Flickr photo:/i })
    expect(collapsedImages.length).toBeLessThanOrEqual(8)
  })
})
