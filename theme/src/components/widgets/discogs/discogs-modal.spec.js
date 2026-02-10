import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

import DiscogsModal from './discogs-modal'

// Mock createPortal to render directly in the test environment
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: node => node
}))

// Mock isDarkMode helper
jest.mock('../../../helpers/isDarkMode', () => jest.fn(() => false))

const mockRelease = {
  id: 12345,
  basicInformation: {
    id: 12345,
    title: 'Test Album',
    year: 2023,
    artists: [{ name: 'Test Artist' }],
    genres: ['Rock', 'Alternative'],
    styles: ['Indie Rock', 'Alternative Rock'],
    formats: [{ name: 'Vinyl', qty: '1', text: '12"', descriptions: ['LP', 'Album'] }],
    labels: [{ name: 'Test Records', catno: 'TR001' }],
    cdnCoverUrl: 'https://example.com/cover.jpg',
    coverImage: 'https://example.com/cover-fallback.jpg',
    resourceUrl: 'https://discogs.com/release/12345'
  },
  resource: {
    id: 12345,
    uri: 'https://www.discogs.com/release/12345-Test-Artist-Test-Album',
    country: 'US',
    data_quality: 'Correct',
    notes: 'Gatefold sleeve.\n\nSpecial thanks to all contributors.',
    tracklist: [
      { position: 'A1', title: 'Pardon Me Sir', duration: '3:37' },
      { position: 'A2', title: 'High Time We Went', duration: '4:25' },
      { position: 'B1', title: 'Midnight Rider', duration: '4:00' },
      { position: 'B2', title: 'Do Right Woman', duration: '7:00' }
    ]
  }
}

const mockReleaseMinimal = {
  id: 67890,
  basicInformation: {
    id: 67890,
    title: 'Minimal Album',
    year: 2022,
    artists: [{ name: 'Minimal Artist' }]
  },
  resource: {
    id: 67890,
    uri: 'https://www.discogs.com/release/67890-Minimal-Artist-Minimal-Album'
  }
}

describe('DiscogsModal', () => {
  const mockOnClose = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
    // Reset body styles
    document.body.style.overflow = ''
  })

  it('renders nothing when isOpen is false', () => {
    const { container } = render(<DiscogsModal isOpen={false} onClose={mockOnClose} release={mockRelease} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders nothing when release is null', () => {
    const { container } = render(<DiscogsModal isOpen={true} onClose={mockOnClose} release={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders nothing when release is undefined', () => {
    const { container } = render(<DiscogsModal isOpen={true} onClose={mockOnClose} release={undefined} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders modal with complete release data', () => {
    const { asFragment } = render(<DiscogsModal isOpen={true} onClose={mockOnClose} release={mockRelease} />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders modal with minimal release data', () => {
    const { asFragment } = render(<DiscogsModal isOpen={true} onClose={mockOnClose} release={mockReleaseMinimal} />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('displays album title and artist', () => {
    render(<DiscogsModal isOpen={true} onClose={mockOnClose} release={mockRelease} />)
    expect(screen.getByText('Test Album')).toBeInTheDocument()
    expect(screen.getByText('Test Artist')).toBeInTheDocument()
  })

  it('displays year when available', () => {
    render(<DiscogsModal isOpen={true} onClose={mockOnClose} release={mockRelease} />)
    expect(screen.getByText('2023')).toBeInTheDocument()
  })

  it('displays genres when available', () => {
    render(<DiscogsModal isOpen={true} onClose={mockOnClose} release={mockRelease} />)
    // Rock appears in multiple places (genres), use getAllByText
    expect(screen.getAllByText(/Rock/).length).toBeGreaterThan(0)
  })

  it('displays tracklist when available', () => {
    render(<DiscogsModal isOpen={true} onClose={mockOnClose} release={mockRelease} />)
    expect(screen.getByText('Pardon Me Sir')).toBeInTheDocument()
    expect(screen.getByText('Midnight Rider')).toBeInTheDocument()
  })

  it('handles release with missing basicInformation', () => {
    const releaseWithMissingBasicInfo = { id: 99999 }
    const { asFragment } = render(
      <DiscogsModal isOpen={true} onClose={mockOnClose} release={releaseWithMissingBasicInfo} />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('handles release with empty arrays', () => {
    const releaseWithEmptyArrays = {
      id: 88888,
      basicInformation: {
        id: 88888,
        title: 'Empty Arrays Album',
        year: 2023,
        artists: [],
        genres: [],
        styles: [],
        formats: [],
        labels: []
      },
      resource: {
        id: 88888,
        uri: 'https://www.discogs.com/release/88888-Empty-Arrays-Album'
      }
    }
    const { asFragment } = render(<DiscogsModal isOpen={true} onClose={mockOnClose} release={releaseWithEmptyArrays} />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('calls onClose when escape key is pressed', () => {
    render(<DiscogsModal isOpen={true} onClose={mockOnClose} release={mockRelease} />)

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('does not call onClose for other keys', () => {
    render(<DiscogsModal isOpen={true} onClose={mockOnClose} release={mockRelease} />)

    fireEvent.keyDown(document, { key: 'Enter' })
    expect(mockOnClose).not.toHaveBeenCalled()
  })

  describe('dark mode', () => {
    it('renders with dark mode styling', () => {
      const isDarkModeMock = require('../../../helpers/isDarkMode')
      isDarkModeMock.mockReturnValue(true)

      const { asFragment } = render(<DiscogsModal isOpen={true} onClose={mockOnClose} release={mockRelease} />)
      expect(asFragment()).toMatchSnapshot()

      isDarkModeMock.mockReturnValue(false)
    })
  })

  describe('cover image handling', () => {
    it('uses cdnCoverUrl when available', () => {
      render(<DiscogsModal isOpen={true} onClose={mockOnClose} release={mockRelease} />)
      const img = screen.getByRole('img')
      expect(img).toHaveAttribute('src', 'https://example.com/cover.jpg')
    })

    it('uses coverImage when cdnCoverUrl is not available', () => {
      const releaseWithFallbackCover = {
        ...mockRelease,
        basicInformation: {
          ...mockRelease.basicInformation,
          cdnCoverUrl: null
        }
      }
      render(<DiscogsModal isOpen={true} onClose={mockOnClose} release={releaseWithFallbackCover} />)
      const img = screen.getByRole('img')
      expect(img).toHaveAttribute('src', 'https://example.com/cover-fallback.jpg')
    })

    it('handles release with missing cover image', () => {
      const releaseWithoutCover = {
        ...mockRelease,
        basicInformation: {
          ...mockRelease.basicInformation,
          cdnCoverUrl: null,
          coverImage: null
        }
      }
      const { asFragment } = render(<DiscogsModal isOpen={true} onClose={mockOnClose} release={releaseWithoutCover} />)
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
