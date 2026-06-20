import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ThemeUIProvider } from 'theme-ui'
import { PhotoGallery } from './PhotoGallery'

// ─── Mocks ──────────────────────────────────────────────────────────────────

let capturedOnChange = null
const mockRef = jest.fn()
const mockUseInView = jest.fn(({ onChange } = {}) => {
  capturedOnChange = onChange
  return { ref: mockRef }
})
jest.mock('react-intersection-observer', () => ({
  useInView: opts => mockUseInView(opts)
}))

// react-photo-gallery renders clickable buttons so we can trigger openLightbox
const MockGallery = jest.fn(({ onClick, photos }) => (
  <div data-testid='gallery'>
    {photos.map((photo, i) => (
      <button key={i} data-testid={`photo-${i}`} onClick={e => onClick(e, { index: i })}>
        photo-{i}
      </button>
    ))}
  </div>
))
jest.mock('react-photo-gallery', () => ({ __esModule: true, default: props => MockGallery(props) }))

// Stable mock instance used across tests
const mockOpenGallery = jest.fn()
const mockInstance = { openGallery: mockOpenGallery }

const MockLightGallery = jest.fn(({ onInit, dynamicEl, loop, plugins }) => {
  // Call onInit synchronously so the ref is set before assertions
  React.useEffect(() => {
    if (onInit) onInit({ instance: mockInstance })
  }, [onInit])
  return (
    <div
      data-testid='lightgallery'
      data-count={dynamicEl?.length}
      data-loop={String(loop)}
      data-plugins={plugins?.length}
    />
  )
})

jest.mock('lightgallery/react', () => ({ __esModule: true, default: props => MockLightGallery(props) }))
jest.mock('lightgallery/plugins/thumbnail', () => ({ __esModule: true, default: 'lgThumbnail' }))
jest.mock('lightgallery/plugins/zoom', () => ({ __esModule: true, default: 'lgZoom' }))

// ─── Helpers ─────────────────────────────────────────────────────────────────

const theme = {
  colors: { text: '#000', background: '#fff', modes: { dark: { text: '#fff', background: '#000' } } }
}

const renderWithTheme = ui => render(<ThemeUIProvider theme={theme}>{ui}</ThemeUIProvider>)

const samplePhotos = [
  { src: 'https://example.com/photo1.jpg', width: 4, height: 3, title: 'Photo 1' },
  { src: 'https://example.com/photo2.jpg', width: 3, height: 4, title: 'Photo 2' },
  { src: 'https://example.com/photo3.jpg', width: 1, height: 1 }
]

/** Trigger the inView callback to simulate the sentinel entering the viewport */
const triggerInView = () => {
  act(() => {
    if (capturedOnChange) capturedOnChange(true)
  })
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('PhotoGallery', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    capturedOnChange = null
    mockUseInView.mockImplementation(({ onChange } = {}) => {
      capturedOnChange = onChange
      return { ref: mockRef }
    })
  })

  describe('Rendering', () => {
    it('renders the photo gallery grid', () => {
      renderWithTheme(<PhotoGallery photos={samplePhotos} />)
      expect(screen.getByTestId('gallery')).toBeInTheDocument()
    })

    it('passes photos to Gallery', () => {
      renderWithTheme(<PhotoGallery photos={samplePhotos} />)
      expect(MockGallery).toHaveBeenCalledWith(expect.objectContaining({ photos: samplePhotos }))
    })

    it('renders a sentinel div for intersection observer', () => {
      const { container } = renderWithTheme(<PhotoGallery photos={samplePhotos} />)
      // The outer wrapper contains the sentinel div after the gallery
      const divs = container.querySelectorAll('div')
      expect(divs.length).toBeGreaterThan(0)
    })

    it('does not render LightGallery before scrolling into view', () => {
      renderWithTheme(<PhotoGallery photos={samplePhotos} />)
      expect(screen.queryByTestId('lightgallery')).not.toBeInTheDocument()
    })

    it('configures useInView with rootMargin and triggerOnce', () => {
      renderWithTheme(<PhotoGallery photos={samplePhotos} />)
      expect(mockUseInView).toHaveBeenCalledWith(expect.objectContaining({ rootMargin: '300px', triggerOnce: true }))
    })
  })

  describe('Lazy loading LightGallery', () => {
    it('renders LightGallery after the sentinel enters the viewport', async () => {
      renderWithTheme(<PhotoGallery photos={samplePhotos} />)
      triggerInView()
      await waitFor(() => expect(screen.getByTestId('lightgallery')).toBeInTheDocument())
    })

    it('does not re-trigger if onChange is called with false after loading', async () => {
      renderWithTheme(<PhotoGallery photos={samplePhotos} />)
      triggerInView()
      await waitFor(() => expect(screen.getByTestId('lightgallery')).toBeInTheDocument())
      // Calling onChange(false) should not remove the already-loaded component (triggerOnce)
      act(() => capturedOnChange(false))
      expect(screen.getByTestId('lightgallery')).toBeInTheDocument()
    })
  })

  describe('dynamicEl memoization', () => {
    it('passes the correct number of slides to LightGallery', async () => {
      renderWithTheme(<PhotoGallery photos={samplePhotos} />)
      triggerInView()
      await waitFor(() => {
        const lg = screen.getByTestId('lightgallery')
        expect(lg).toHaveAttribute('data-count', String(samplePhotos.length))
      })
    })

    it('maps photo src and title into dynamicEl correctly', async () => {
      renderWithTheme(<PhotoGallery photos={samplePhotos} />)
      triggerInView()
      await waitFor(() => expect(screen.getByTestId('lightgallery')).toBeInTheDocument())
      const call = MockLightGallery.mock.calls[0][0]
      expect(call.dynamicEl[0]).toEqual({ src: samplePhotos[0].src, thumb: samplePhotos[0].src, subHtml: 'Photo 1' })
      expect(call.dynamicEl[1]).toEqual({ src: samplePhotos[1].src, thumb: samplePhotos[1].src, subHtml: 'Photo 2' })
    })

    it('uses empty string for subHtml when photo has no title', async () => {
      renderWithTheme(<PhotoGallery photos={samplePhotos} />)
      triggerInView()
      await waitFor(() => expect(screen.getByTestId('lightgallery')).toBeInTheDocument())
      const call = MockLightGallery.mock.calls[0][0]
      expect(call.dynamicEl[2].subHtml).toBe('')
    })
  })

  describe('LightGallery configuration', () => {
    it('sets loop={false} to prevent index desync on wrap-around', async () => {
      renderWithTheme(<PhotoGallery photos={samplePhotos} />)
      triggerInView()
      await waitFor(() => {
        expect(screen.getByTestId('lightgallery')).toHaveAttribute('data-loop', 'false')
      })
    })

    it('passes two plugins (thumbnail + zoom)', async () => {
      renderWithTheme(<PhotoGallery photos={samplePhotos} />)
      triggerInView()
      await waitFor(() => {
        expect(screen.getByTestId('lightgallery')).toHaveAttribute('data-plugins', '2')
      })
    })
  })

  describe('openLightbox', () => {
    it('opens the lightbox at the correct index when a photo is clicked', async () => {
      renderWithTheme(<PhotoGallery photos={samplePhotos} />)
      triggerInView()
      await waitFor(() => expect(screen.getByTestId('lightgallery')).toBeInTheDocument())

      fireEvent.click(screen.getByTestId('photo-1'))
      expect(mockOpenGallery).toHaveBeenCalledWith(1)
    })

    it('opens the lightbox at index 0 when the first photo is clicked', async () => {
      renderWithTheme(<PhotoGallery photos={samplePhotos} />)
      triggerInView()
      await waitFor(() => expect(screen.getByTestId('lightgallery')).toBeInTheDocument())

      fireEvent.click(screen.getByTestId('photo-0'))
      expect(mockOpenGallery).toHaveBeenCalledWith(0)
    })

    it('logs an error when the LightGallery instance is not yet initialized', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      renderWithTheme(<PhotoGallery photos={samplePhotos} />)
      // LightGallery not yet loaded — clicking a photo should log an error
      fireEvent.click(screen.getByTestId('photo-0'))
      expect(consoleSpy).toHaveBeenCalledWith('LightGallery instance is not initialized')
      consoleSpy.mockRestore()
    })
  })

  describe('Empty photos array', () => {
    it('renders without crashing when photos is empty', () => {
      renderWithTheme(<PhotoGallery photos={[]} />)
      expect(screen.getByTestId('gallery')).toBeInTheDocument()
    })

    it('passes empty dynamicEl when photos is empty', async () => {
      renderWithTheme(<PhotoGallery photos={[]} />)
      triggerInView()
      await waitFor(() => expect(screen.getByTestId('lightgallery')).toBeInTheDocument())
      expect(screen.getByTestId('lightgallery')).toHaveAttribute('data-count', '0')
    })
  })
})
