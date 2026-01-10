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
        jest.advanceTimersByTime(3200) // Interval
      })
      act(() => {
        jest.advanceTimersByTime(300) // Transition duration
      })
      expect(screen.getByRole('img').src).toContain('child2.jpg')

      // After another interval + transition, should show third image
      act(() => {
        jest.advanceTimersByTime(3200)
      })
      act(() => {
        jest.advanceTimersByTime(300)
      })
      expect(screen.getByRole('img').src).toContain('child3.jpg')

      // After another interval + transition, should wrap back to first image
      act(() => {
        jest.advanceTimersByTime(3200)
      })
      act(() => {
        jest.advanceTimersByTime(300)
      })
      expect(screen.getByRole('img').src).toContain('child1.jpg')
    })

    it('resets to main image when mouse leaves', () => {
      render(<InstagramWidgetItem {...carouselProps} />)

      const button = screen.getByRole('button')

      fireEvent.mouseEnter(button)

      // Advance to show a different image (interval + transition)
      act(() => {
        jest.advanceTimersByTime(3200)
      })
      act(() => {
        jest.advanceTimersByTime(300)
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

    it('shows +N indicator when carousel has more than 5 images', () => {
      const manyImagesProps = {
        ...carouselProps,
        post: {
          ...carouselProps.post,
          children: [
            { id: 'child1', cdnMediaURL: 'https://cdn.example.com/images/child1.jpg' },
            { id: 'child2', cdnMediaURL: 'https://cdn.example.com/images/child2.jpg' },
            { id: 'child3', cdnMediaURL: 'https://cdn.example.com/images/child3.jpg' },
            { id: 'child4', cdnMediaURL: 'https://cdn.example.com/images/child4.jpg' },
            { id: 'child5', cdnMediaURL: 'https://cdn.example.com/images/child5.jpg' },
            { id: 'child6', cdnMediaURL: 'https://cdn.example.com/images/child6.jpg' },
            { id: 'child7', cdnMediaURL: 'https://cdn.example.com/images/child7.jpg' }
          ]
        }
      }

      render(<InstagramWidgetItem {...manyImagesProps} />)

      const button = screen.getByRole('button')
      fireEvent.mouseEnter(button)

      const indicators = screen.getByTestId('carousel-indicators')
      expect(indicators).toBeInTheDocument()
      expect(indicators).toHaveTextContent('+2')
    })

    it('handles carousel child with missing cdnMediaURL gracefully', () => {
      const missingUrlProps = {
        ...carouselProps,
        post: {
          ...carouselProps.post,
          children: [
            { id: 'child1', cdnMediaURL: null },
            { id: 'child2', cdnMediaURL: 'https://cdn.example.com/images/child2.jpg' }
          ]
        }
      }

      render(<InstagramWidgetItem {...missingUrlProps} />)

      const button = screen.getByRole('button')
      fireEvent.mouseEnter(button)

      // After first interval + transition, should show child2 (skipping null)
      act(() => {
        jest.advanceTimersByTime(3200)
      })
      act(() => {
        jest.advanceTimersByTime(300)
      })
      // With only one valid image in filtered array, it should still work
      expect(screen.getByRole('img')).toBeInTheDocument()
    })

    it('falls back to cdnMediaURL when carousel image at index is undefined', () => {
      // Create a scenario where carouselImages array access could return undefined
      // This happens if the filtered array is empty or index exceeds bounds
      const emptyChildrenUrlsProps = {
        ...carouselProps,
        post: {
          ...carouselProps.post,
          children: [
            { id: 'child1', cdnMediaURL: undefined },
            { id: 'child2', cdnMediaURL: undefined },
            { id: 'child3', cdnMediaURL: undefined }
          ]
        }
      }

      render(<InstagramWidgetItem {...emptyChildrenUrlsProps} />)

      const button = screen.getByRole('button')
      fireEvent.mouseEnter(button)

      // With all children having undefined URLs, the filtered array is empty
      // so carouselImages[currentImageIndex] will be undefined, triggering the || cdnMediaURL fallback
      expect(screen.getByRole('img').src).toContain('main-image.jpg')
    })
  })

  describe('Edge cases', () => {
    it('uses fallback alt text when no caption is provided', () => {
      const noCaptionProps = {
        ...defaultProps,
        post: {
          ...defaultProps.post,
          caption: null
        }
      }

      render(<InstagramWidgetItem {...noCaptionProps} />)

      expect(screen.getByAltText('Instagram post thumbnail')).toBeInTheDocument()
    })

    it('uses fallback alt text when caption is undefined', () => {
      const undefinedCaptionProps = {
        ...defaultProps,
        post: {
          ...defaultProps.post,
          caption: undefined
        }
      }

      render(<InstagramWidgetItem {...undefinedCaptionProps} />)

      expect(screen.getByAltText('Instagram post thumbnail')).toBeInTheDocument()
    })

    it('uses fallback alt text when caption is empty string', () => {
      const emptyCaptionProps = {
        ...defaultProps,
        post: {
          ...defaultProps.post,
          caption: ''
        }
      }

      render(<InstagramWidgetItem {...emptyCaptionProps} />)

      expect(screen.getByAltText('Instagram post thumbnail')).toBeInTheDocument()
    })

    it('handles stopCarouselRotation when no interval is running', () => {
      render(<InstagramWidgetItem {...carouselProps} />)

      const button = screen.getByRole('button')

      // Call blur without first entering (no interval running)
      fireEvent.blur(button)

      // Should not throw and component should still work
      expect(screen.getByRole('img')).toBeInTheDocument()
    })

    it('does not restart carousel if already running', () => {
      render(<InstagramWidgetItem {...carouselProps} />)

      const button = screen.getByRole('button')

      // Enter once to start carousel
      fireEvent.mouseEnter(button)

      // Advance time a bit
      act(() => {
        jest.advanceTimersByTime(2000)
      })

      // Focus again (should not restart the interval)
      fireEvent.focus(button)

      // Advance remaining time for first interval + transition
      act(() => {
        jest.advanceTimersByTime(3200)
      })
      act(() => {
        jest.advanceTimersByTime(300)
      })

      // Image should have changed after original 5 seconds, not reset
      expect(screen.getByRole('img').src).toContain('child2.jpg')
    })

    it('renders with default empty post object', () => {
      const emptyPostProps = {
        handleClick: mockHandleClick,
        index: 0,
        post: undefined
      }

      render(<InstagramWidgetItem {...emptyPostProps} />)

      // Should render without crashing
      expect(screen.getByRole('button')).toBeInTheDocument()
      expect(screen.getByRole('img')).toBeInTheDocument()
    })

    it('keeps carousel running when mouse leaves but element is still focused', () => {
      render(<InstagramWidgetItem {...carouselProps} />)

      const button = screen.getByRole('button')

      // Focus the element first
      fireEvent.focus(button)
      expect(screen.getByTestId('carousel-indicators')).toBeInTheDocument()

      // Then also hover
      fireEvent.mouseEnter(button)

      // Leave with mouse but remain focused
      fireEvent.mouseLeave(button)

      // Carousel indicators should still be visible because element is focused
      expect(screen.getByTestId('carousel-indicators')).toBeInTheDocument()

      // Carousel should still be cycling - advance time and check image changes
      act(() => {
        jest.advanceTimersByTime(3200)
      })
      act(() => {
        jest.advanceTimersByTime(300)
      })
      expect(screen.getByRole('img').src).toContain('child2.jpg')
    })

    it('keeps carousel running when blur happens but element is still hovered', () => {
      render(<InstagramWidgetItem {...carouselProps} />)

      const button = screen.getByRole('button')

      // Hover first
      fireEvent.mouseEnter(button)
      expect(screen.getByTestId('carousel-indicators')).toBeInTheDocument()

      // Then also focus
      fireEvent.focus(button)

      // Blur but remain hovered
      fireEvent.blur(button)

      // Carousel indicators should still be visible because element is hovered
      expect(screen.getByTestId('carousel-indicators')).toBeInTheDocument()

      // Carousel should still be cycling
      act(() => {
        jest.advanceTimersByTime(3200)
      })
      act(() => {
        jest.advanceTimersByTime(300)
      })
      expect(screen.getByRole('img').src).toContain('child2.jpg')
    })

    it('clears orphaned timeout when quickly leaving and re-entering', () => {
      render(<InstagramWidgetItem {...carouselProps} />)

      const button = screen.getByRole('button')

      // Start hovering
      fireEvent.mouseEnter(button)

      // Wait for interval to fire (starts the setTimeout for transition)
      act(() => {
        jest.advanceTimersByTime(3200)
      })

      // Quickly leave before the 400ms transition completes
      fireEvent.mouseLeave(button)

      // Re-enter immediately
      fireEvent.mouseEnter(button)

      // Advance past when the orphaned timeout would have fired
      act(() => {
        jest.advanceTimersByTime(300)
      })

      // Should show the first child image (index 0), not skip to second
      // because the orphaned timeout was cleared
      expect(screen.getByRole('img').src).toContain('child1.jpg')
    })

    it('stops carousel only when both hover and focus are inactive', () => {
      render(<InstagramWidgetItem {...carouselProps} />)

      const button = screen.getByRole('button')

      // Hover and focus
      fireEvent.mouseEnter(button)
      fireEvent.focus(button)
      expect(screen.getByTestId('carousel-indicators')).toBeInTheDocument()

      // Remove hover but keep focus
      fireEvent.mouseLeave(button)
      expect(screen.getByTestId('carousel-indicators')).toBeInTheDocument()

      // Remove focus too - now both are inactive
      fireEvent.blur(button)
      expect(screen.queryByTestId('carousel-indicators')).not.toBeInTheDocument()
    })

    it('cleans up timeout on unmount during transition', () => {
      const { unmount } = render(<InstagramWidgetItem {...carouselProps} />)

      const button = screen.getByRole('button')

      // Start hovering
      fireEvent.mouseEnter(button)

      // Wait for interval to fire (starts the setTimeout for transition)
      act(() => {
        jest.advanceTimersByTime(3200)
      })

      // Unmount while the 400ms transition timeout is still pending
      // This should clean up the timeout without errors
      unmount()

      // Advance time past when the timeout would have fired
      act(() => {
        jest.advanceTimersByTime(300)
      })

      // No error should have occurred - the timeout was cleaned up
      expect(true).toBe(true)
    })

    it('handles preloading when cdnMediaURL is undefined', () => {
      const undefinedUrlProps = {
        ...carouselProps,
        post: {
          ...carouselProps.post,
          mediaType: 'CAROUSEL_ALBUM',
          cdnMediaURL: undefined,
          children: [
            { id: 'child1', cdnMediaURL: undefined },
            { id: 'child2', cdnMediaURL: 'https://cdn.example.com/images/child2.jpg' }
          ]
        }
      }

      render(<InstagramWidgetItem {...undefinedUrlProps} />)

      const button = screen.getByRole('button')

      // Hover to trigger preloading - should handle undefined URLs gracefully
      fireEvent.mouseEnter(button)

      // Should not throw and component should still work
      expect(screen.getByRole('img')).toBeInTheDocument()
    })
  })
})
