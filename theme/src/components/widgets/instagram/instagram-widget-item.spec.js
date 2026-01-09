import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import InstagramWidgetItem from './instagram-widget-item'

describe('InstagramWidgetItem', () => {
  const mockHandleClick = jest.fn()

  const defaultProps = {
    handleClick: mockHandleClick,
    index: 0,
    post: {
      id: '0123456789',
      caption: 'This is a test caption',
      cdnMediaURL: 'https://cdn.example.com/images/fake-instagram-image.jpg',
      mediaType: 'IMAGE',
      permalink: 'https://instagram.com/fake-image-link'
    }
  }

  const carouselProps = {
    handleClick: mockHandleClick,
    index: 0,
    post: {
      id: '0123456789',
      caption: 'Carousel post caption',
      cdnMediaURL: 'https://cdn.example.com/images/main-image.jpg',
      mediaType: 'CAROUSEL_ALBUM',
      permalink: 'https://instagram.com/fake-carousel-link',
      children: [
        { id: 'child1', cdnMediaURL: 'https://cdn.example.com/images/child1.jpg' },
        { id: 'child2', cdnMediaURL: 'https://cdn.example.com/images/child2.jpg' },
        { id: 'child3', cdnMediaURL: 'https://cdn.example.com/images/child3.jpg' }
      ]
    }
  }

  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.useRealTimers()
  })

  it('matches the snapshot', () => {
    const { asFragment } = render(<InstagramWidgetItem {...defaultProps} />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders the image with correct alt text and source', () => {
    render(<InstagramWidgetItem {...defaultProps} />)

    const img = screen.getByAltText(`Instagram post: ${defaultProps.post.caption}`)
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute(
      'src',
      `${defaultProps.post.cdnMediaURL}?h=234&w=234&fit=crop&crop=faces,focalpoint&auto=compress&auto=enhance&auto=format`
    )
  })

  it('calls handleClick when the button is clicked', () => {
    render(<InstagramWidgetItem {...defaultProps} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(mockHandleClick).toHaveBeenCalledTimes(1)
    expect(mockHandleClick).toHaveBeenCalledWith(expect.any(Object), {
      index: defaultProps.index,
      photo: {
        caption: defaultProps.post.caption,
        id: defaultProps.post.id,
        src: defaultProps.post.cdnMediaURL
      }
    })
  })

  it('displays the carousel icon when mediaType is CAROUSEL_ALBUM', () => {
    const carouselProps = {
      ...defaultProps,
      post: {
        ...defaultProps.post,
        mediaType: 'CAROUSEL_ALBUM'
      }
    }

    render(<InstagramWidgetItem {...carouselProps} />)

    const carouselIcon = screen.getByTestId('carousel-icon')
    expect(carouselIcon).toBeInTheDocument()
  })

  it('displays the video icon when mediaType is VIDEO', () => {
    const videoProps = {
      ...defaultProps,
      post: {
        ...defaultProps.post,
        mediaType: 'VIDEO'
      }
    }

    render(<InstagramWidgetItem {...videoProps} />)

    const videoIcon = screen.getByTestId('video-icon')
    expect(videoIcon).toBeInTheDocument()
  })

  it('does not display any icon when mediaType is IMAGE', () => {
    render(<InstagramWidgetItem {...defaultProps} />)

    const carouselIcon = screen.queryByTestId('carousel-icon')
    const videoIcon = screen.queryByTestId('video-icon')
    expect(carouselIcon).not.toBeInTheDocument()
    expect(videoIcon).not.toBeInTheDocument()
  })

  describe('Carousel rotation on hover', () => {
    it('shows carousel indicators when hovering over a carousel post', () => {
      render(<InstagramWidgetItem {...carouselProps} />)

      const button = screen.getByRole('button')

      // Indicators should not be visible initially
      expect(screen.queryByTestId('carousel-indicators')).not.toBeInTheDocument()

      // Hover over the button
      fireEvent.mouseEnter(button)

      // Indicators should now be visible
      expect(screen.getByTestId('carousel-indicators')).toBeInTheDocument()
    })

    it('hides carousel indicators when mouse leaves', () => {
      render(<InstagramWidgetItem {...carouselProps} />)

      const button = screen.getByRole('button')

      fireEvent.mouseEnter(button)
      expect(screen.getByTestId('carousel-indicators')).toBeInTheDocument()

      fireEvent.mouseLeave(button)
      expect(screen.queryByTestId('carousel-indicators')).not.toBeInTheDocument()
    })

    it('cycles through carousel images on hover with Ken Burns effect', () => {
      render(<InstagramWidgetItem {...carouselProps} />)

      const button = screen.getByRole('button')

      // Initially shows main cdnMediaURL (when not hovering)
      expect(screen.getByRole('img').src).toContain('main-image.jpg')

      // Start hovering
      fireEvent.mouseEnter(button)

      // After first interval + transition time, should show second image
      act(() => {
        jest.advanceTimersByTime(5000) // Interval
      })
      act(() => {
        jest.advanceTimersByTime(400) // Transition duration
      })
      expect(screen.getByRole('img').src).toContain('child2.jpg')

      // After another interval + transition, should show third image
      act(() => {
        jest.advanceTimersByTime(5000)
      })
      act(() => {
        jest.advanceTimersByTime(400)
      })
      expect(screen.getByRole('img').src).toContain('child3.jpg')

      // After another interval + transition, should wrap back to first image
      act(() => {
        jest.advanceTimersByTime(5000)
      })
      act(() => {
        jest.advanceTimersByTime(400)
      })
      expect(screen.getByRole('img').src).toContain('child1.jpg')
    })

    it('resets to main image when mouse leaves', () => {
      render(<InstagramWidgetItem {...carouselProps} />)

      const button = screen.getByRole('button')

      fireEvent.mouseEnter(button)

      // Advance to show a different image (interval + transition)
      act(() => {
        jest.advanceTimersByTime(5000)
      })
      act(() => {
        jest.advanceTimersByTime(400)
      })
      expect(screen.getByRole('img').src).toContain('child2.jpg')

      // Mouse leave should reset to main image
      fireEvent.mouseLeave(button)
      expect(screen.getByRole('img').src).toContain('main-image.jpg')
    })

    it('shows carousel indicators on focus for accessibility', () => {
      render(<InstagramWidgetItem {...carouselProps} />)

      const button = screen.getByRole('button')

      fireEvent.focus(button)
      expect(screen.getByTestId('carousel-indicators')).toBeInTheDocument()

      fireEvent.blur(button)
      expect(screen.queryByTestId('carousel-indicators')).not.toBeInTheDocument()
    })

    it('does not show carousel indicators for non-carousel posts', () => {
      render(<InstagramWidgetItem {...defaultProps} />)

      const button = screen.getByRole('button')

      fireEvent.mouseEnter(button)
      expect(screen.queryByTestId('carousel-indicators')).not.toBeInTheDocument()
    })

    it('does not show carousel indicators for carousel posts without children', () => {
      const noChildrenProps = {
        ...carouselProps,
        post: {
          ...carouselProps.post,
          children: []
        }
      }

      render(<InstagramWidgetItem {...noChildrenProps} />)

      const button = screen.getByRole('button')

      fireEvent.mouseEnter(button)
      expect(screen.queryByTestId('carousel-indicators')).not.toBeInTheDocument()
    })
  })
})
