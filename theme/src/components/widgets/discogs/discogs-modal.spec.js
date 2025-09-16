import React from 'react'
import renderer from 'react-test-renderer'

import DiscogsModal from './discogs-modal'

// Mock createPortal to render directly in the test environment
jest.mock('react-dom', () => ({
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
    // Mock document.body
    Object.defineProperty(document, 'body', {
      value: {
        style: {}
      },
      writable: true
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders nothing when isOpen is false', () => {
    const tree = renderer.create(<DiscogsModal isOpen={false} onClose={mockOnClose} release={mockRelease} />).toJSON()
    expect(tree).toBeNull()
  })

  it('renders nothing when release is null', () => {
    const tree = renderer.create(<DiscogsModal isOpen={true} onClose={mockOnClose} release={null} />).toJSON()
    expect(tree).toBeNull()
  })

  it('renders nothing when release is undefined', () => {
    const tree = renderer.create(<DiscogsModal isOpen={true} onClose={mockOnClose} release={undefined} />).toJSON()
    expect(tree).toBeNull()
  })

  it('renders modal with complete release data', () => {
    const tree = renderer.create(<DiscogsModal isOpen={true} onClose={mockOnClose} release={mockRelease} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders modal with minimal release data', () => {
    const tree = renderer
      .create(<DiscogsModal isOpen={true} onClose={mockOnClose} release={mockReleaseMinimal} />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('handles release with missing basicInformation', () => {
    const releaseWithMissingBasicInfo = {
      id: 99999
    }
    const tree = renderer
      .create(<DiscogsModal isOpen={true} onClose={mockOnClose} release={releaseWithMissingBasicInfo} />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('handles release with missing title', () => {
    const releaseWithoutTitle = {
      ...mockRelease,
      basicInformation: {
        ...mockRelease.basicInformation,
        title: null
      }
    }
    const tree = renderer
      .create(<DiscogsModal isOpen={true} onClose={mockOnClose} release={releaseWithoutTitle} />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('handles release with missing artists', () => {
    const releaseWithoutArtists = {
      ...mockRelease,
      basicInformation: {
        ...mockRelease.basicInformation,
        artists: []
      }
    }
    const tree = renderer
      .create(<DiscogsModal isOpen={true} onClose={mockOnClose} release={releaseWithoutArtists} />)
      .toJSON()
    expect(tree).toMatchSnapshot()
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
    const tree = renderer
      .create(<DiscogsModal isOpen={true} onClose={mockOnClose} release={releaseWithoutCover} />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('handles release with missing resourceUrl', () => {
    const releaseWithoutResourceUrl = {
      ...mockRelease,
      basicInformation: {
        ...mockRelease.basicInformation,
        resourceUrl: null
      },
      resource: {
        ...mockRelease.resource,
        uri: null
      }
    }
    const tree = renderer
      .create(<DiscogsModal isOpen={true} onClose={mockOnClose} release={releaseWithoutResourceUrl} />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('uses coverImage when cdnCoverUrl is not available', () => {
    const releaseWithFallbackCover = {
      ...mockRelease,
      basicInformation: {
        ...mockRelease.basicInformation,
        cdnCoverUrl: null
      }
    }
    const tree = renderer
      .create(<DiscogsModal isOpen={true} onClose={mockOnClose} release={releaseWithFallbackCover} />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('handles release with multiple artists', () => {
    const releaseWithMultipleArtists = {
      id: 11111,
      basicInformation: {
        id: 11111,
        title: 'Collaboration Album',
        year: 2024,
        artists: [{ name: 'Artist One' }, { name: 'Artist Two' }, { name: 'Artist Three' }],
        genres: ['Electronic', 'Ambient'],
        styles: ['Downtempo', 'Chillout'],
        formats: [
          { name: 'Vinyl', qty: '2', text: '12"' },
          { name: 'CD', qty: '1' }
        ],
        labels: [
          { name: 'Label One', catno: 'L001' },
          { name: 'Label Two', catno: 'L002' }
        ],
        resourceUrl: 'https://discogs.com/release/11111'
      },
      resource: {
        id: 11111,
        uri: 'https://www.discogs.com/release/11111-Artist-One-Artist-Two-Artist-Three-Collaboration-Album'
      }
    }
    const tree = renderer
      .create(<DiscogsModal isOpen={true} onClose={mockOnClose} release={releaseWithMultipleArtists} />)
      .toJSON()
    expect(tree).toMatchSnapshot()
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
    const tree = renderer
      .create(<DiscogsModal isOpen={true} onClose={mockOnClose} release={releaseWithEmptyArrays} />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('handles release with null arrays', () => {
    const releaseWithNullArrays = {
      id: 77777,
      basicInformation: {
        id: 77777,
        title: 'Null Arrays Album',
        year: 2023,
        artists: null,
        genres: null,
        styles: null,
        formats: null,
        labels: null
      },
      resource: {
        id: 77777,
        uri: 'https://www.discogs.com/release/77777-Null-Arrays-Album'
      }
    }
    const tree = renderer
      .create(<DiscogsModal isOpen={true} onClose={mockOnClose} release={releaseWithNullArrays} />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('uses resource.uri for external link when available', () => {
    const releaseWithUri = {
      ...mockRelease,
      resource: {
        ...mockRelease.resource,
        uri: 'https://www.discogs.com/release/12345-Test-Artist-Test-Album'
      }
    }
    const tree = renderer.create(<DiscogsModal isOpen={true} onClose={mockOnClose} release={releaseWithUri} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('falls back to basicInformation.resourceUrl when resource.uri is not available', () => {
    const releaseWithoutUri = {
      ...mockRelease,
      resource: {
        ...mockRelease.resource,
        uri: null
      }
    }
    const tree = renderer
      .create(<DiscogsModal isOpen={true} onClose={mockOnClose} release={releaseWithoutUri} />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('handles release with undefined arrays', () => {
    const releaseWithUndefinedArrays = {
      id: 66666,
      basicInformation: {
        id: 66666,
        title: 'Undefined Arrays Album',
        year: 2023,
        artists: undefined,
        genres: undefined,
        styles: undefined,
        formats: undefined,
        labels: undefined
      }
    }
    const tree = renderer
      .create(<DiscogsModal isOpen={true} onClose={mockOnClose} release={releaseWithUndefinedArrays} />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('formats labels with catalog numbers', () => {
    const releaseWithLabels = {
      id: 55555,
      basicInformation: {
        id: 55555,
        title: 'Label Test Album',
        year: 2023,
        artists: [{ name: 'Label Test Artist' }],
        labels: [
          { name: 'Label One', catno: 'L001' },
          { name: 'Label Two', catno: 'L002' },
          { name: 'Label Three' } // No catalog number
        ]
      }
    }
    const tree = renderer
      .create(<DiscogsModal isOpen={true} onClose={mockOnClose} release={releaseWithLabels} />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('formats formats with quantity and text', () => {
    const releaseWithFormats = {
      id: 44444,
      basicInformation: {
        id: 44444,
        title: 'Format Test Album',
        year: 2023,
        artists: [{ name: 'Format Test Artist' }],
        formats: [
          { name: 'Vinyl', qty: '2', text: '12"' },
          { name: 'CD', qty: '1' }, // No text
          { name: 'Digital' } // No quantity or text
        ]
      }
    }
    const tree = renderer
      .create(<DiscogsModal isOpen={true} onClose={mockOnClose} release={releaseWithFormats} />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
