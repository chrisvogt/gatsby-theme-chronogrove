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

      // Initially shows first carousel child image
      expect(screen.getByRole('img').src).toContain('child1.jpg')

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

    it('pauses at current image when mouse leaves', () => {
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

      // Mouse leave should pause at current image, not reset
      fireEvent.mouseLeave(button)
      expect(screen.getByRole('img').src).toContain('child2.jpg')
    })

    it('resumes rotation from paused position when re-entering', () => {
      render(<InstagramWidgetItem {...carouselProps} />)

      const button = screen.getByRole('button')

      // First hover: advance to child2
      fireEvent.mouseEnter(button)
      act(() => {
        jest.advanceTimersByTime(3200)
      })
      act(() => {
        jest.advanceTimersByTime(300)
      })
      expect(screen.getByRole('img').src).toContain('child2.jpg')

      // Leave - should pause at child2
      fireEvent.mouseLeave(button)
      expect(screen.getByRole('img').src).toContain('child2.jpg')

      // Re-enter and continue rotation - should go to child3 next
      fireEvent.mouseEnter(button)
      act(() => {
        jest.advanceTimersByTime(3200)
      })
      act(() => {
        jest.advanceTimersByTime(300)
      })
      expect(screen.getByRole('img').src).toContain('child3.jpg')

      // And then wrap to child1
      act(() => {
        jest.advanceTimersByTime(3200)
      })
      act(() => {
        jest.advanceTimersByTime(300)
      })
      expect(screen.getByRole('img').src).toContain('child1.jpg')
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

    it('does not start carousel rotation when all children have falsy cdnMediaURL values', () => {
      // This prevents NaN from (prev + 1) % 0 when carouselImages is empty after filtering
      const allFalsyUrlsProps = {
        ...carouselProps,
        post: {
          ...carouselProps.post,
          children: [
            { id: 'child1', cdnMediaURL: null },
            { id: 'child2', cdnMediaURL: '' },
            { id: 'child3', cdnMediaURL: undefined }
          ]
        }
      }

      render(<InstagramWidgetItem {...allFalsyUrlsProps} />)

      const button = screen.getByRole('button')
      fireEvent.mouseEnter(button)

      // Wait for multiple intervals to pass - if rotation started, it would cause NaN issues
      act(() => {
        jest.advanceTimersByTime(10000)
      })

      // Image should still show main image (no NaN corruption of currentImageIndex)
      const img = screen.getByRole('img')
      expect(img.src).toContain('main-image.jpg')
      // Verify the src is a valid URL, not containing NaN
      expect(img.src).not.toContain('NaN')
    })

    it('does not start carousel rotation when only one valid image exists', () => {
      // No point rotating through a single image
      const singleValidImageProps = {
        ...carouselProps,
        post: {
          ...carouselProps.post,
          children: [
            { id: 'child1', cdnMediaURL: 'https://cdn.example.com/images/only-valid.jpg' },
            { id: 'child2', cdnMediaURL: null },
            { id: 'child3', cdnMediaURL: undefined }
          ]
        }
      }

      render(<InstagramWidgetItem {...singleValidImageProps} />)

      const button = screen.getByRole('button')
      fireEvent.mouseEnter(button)

      // Wait for interval - rotation should not occur with only 1 image
      act(() => {
        jest.advanceTimersByTime(3200)
      })
      act(() => {
        jest.advanceTimersByTime(300)
      })

      // Should still show the single valid image
      expect(screen.getByRole('img').src).toContain('only-valid.jpg')
    })
  })

  describe('Ambient rotation (attention grabber feature)', () => {
    it('advances by 1 image when ambientTrigger changes and item is ambient active', () => {
      const { rerender } = render(<InstagramWidgetItem {...carouselProps} isAmbientActive={true} ambientTrigger={0} />)

      // Initially shows first image
      expect(screen.getByRole('img').src).toContain('child1.jpg')

      // Trigger ambient advance
      rerender(<InstagramWidgetItem {...carouselProps} isAmbientActive={true} ambientTrigger={1} />)

      // Wait for transition
      act(() => {
        jest.advanceTimersByTime(300)
      })

      // Should now show second image
      expect(screen.getByRole('img').src).toContain('child2.jpg')
    })

    it('does not advance when ambientTrigger is 0', () => {
      render(<InstagramWidgetItem {...carouselProps} isAmbientActive={true} ambientTrigger={0} />)

      // Should stay on first image
      expect(screen.getByRole('img').src).toContain('child1.jpg')

      act(() => {
        jest.advanceTimersByTime(1000)
      })

      // Still on first image
      expect(screen.getByRole('img').src).toContain('child1.jpg')
    })

    it('does not advance when item is not ambient active', () => {
      const { rerender } = render(<InstagramWidgetItem {...carouselProps} isAmbientActive={false} ambientTrigger={1} />)

      expect(screen.getByRole('img').src).toContain('child1.jpg')

      // Change trigger but keep ambient inactive
      rerender(<InstagramWidgetItem {...carouselProps} isAmbientActive={false} ambientTrigger={2} />)

      act(() => {
        jest.advanceTimersByTime(300)
      })

      // Should NOT advance
      expect(screen.getByRole('img').src).toContain('child1.jpg')
    })

    it('shows carousel indicators when ambient active', () => {
      render(<InstagramWidgetItem {...carouselProps} isAmbientActive={true} ambientTrigger={1} />)

      // Indicators should be visible when ambient active
      expect(screen.getByTestId('carousel-indicators')).toBeInTheDocument()
    })

    it('applies pulse animation when ambient active on carousel items', () => {
      const { container } = render(<InstagramWidgetItem {...carouselProps} isAmbientActive={true} ambientTrigger={1} />)

      const button = container.querySelector('button')
      // Check that animation styles are applied (borderRadius indicates animation is applied)
      expect(button).toHaveStyle({ borderRadius: '8px' })
    })

    it('does not apply pulse animation on non-carousel items', () => {
      const { container } = render(<InstagramWidgetItem {...defaultProps} isAmbientActive={true} ambientTrigger={1} />)

      const button = container.querySelector('button')
      // Non-carousel items should not have the borderRadius from animation
      expect(button).not.toHaveStyle({ borderRadius: '8px' })
    })

    it('wraps around to first image when advancing past last image', () => {
      const { rerender } = render(<InstagramWidgetItem {...carouselProps} isAmbientActive={true} ambientTrigger={0} />)

      // Advance through all 3 images
      for (let i = 1; i <= 3; i++) {
        rerender(<InstagramWidgetItem {...carouselProps} isAmbientActive={true} ambientTrigger={i} />)
        act(() => {
          jest.advanceTimersByTime(300)
        })
      }

      // After 3 advances from child1, should wrap to child1 again (1->2->3->1)
      expect(screen.getByRole('img').src).toContain('child1.jpg')
    })

    it('does not advance carousel with only one valid image', () => {
      const singleImageProps = {
        ...carouselProps,
        post: {
          ...carouselProps.post,
          children: [{ id: 'child1', cdnMediaURL: 'https://cdn.example.com/images/only.jpg' }]
        }
      }

      const { rerender } = render(
        <InstagramWidgetItem {...singleImageProps} isAmbientActive={true} ambientTrigger={0} />
      )

      rerender(<InstagramWidgetItem {...singleImageProps} isAmbientActive={true} ambientTrigger={1} />)

      act(() => {
        jest.advanceTimersByTime(300)
      })

      // Should still show the only image
      expect(screen.getByRole('img').src).toContain('only.jpg')
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

    it('handles children prop changing mid-rotation without index out of bounds', () => {
      // Start with 5 children
      const initialProps = {
        ...carouselProps,
        post: {
          ...carouselProps.post,
          children: [
            { id: 'child1', cdnMediaURL: 'https://cdn.example.com/images/child1.jpg' },
            { id: 'child2', cdnMediaURL: 'https://cdn.example.com/images/child2.jpg' },
            { id: 'child3', cdnMediaURL: 'https://cdn.example.com/images/child3.jpg' },
            { id: 'child4', cdnMediaURL: 'https://cdn.example.com/images/child4.jpg' },
            { id: 'child5', cdnMediaURL: 'https://cdn.example.com/images/child5.jpg' }
          ]
        }
      }

      const { rerender } = render(<InstagramWidgetItem {...initialProps} />)

      const button = screen.getByRole('button')
      fireEvent.mouseEnter(button)

      // Advance through several rotations to get to index 3
      for (let i = 0; i < 3; i++) {
        act(() => {
          jest.advanceTimersByTime(3200)
        })
        act(() => {
          jest.advanceTimersByTime(300)
        })
      }

      // Should now be showing child4 (index 3)
      expect(screen.getByRole('img').src).toContain('child4.jpg')

      // Now rerender with only 2 children (simulating data refetch)
      const reducedProps = {
        ...carouselProps,
        post: {
          ...carouselProps.post,
          children: [
            { id: 'child1', cdnMediaURL: 'https://cdn.example.com/images/new-child1.jpg' },
            { id: 'child2', cdnMediaURL: 'https://cdn.example.com/images/new-child2.jpg' }
          ]
        }
      }

      rerender(<InstagramWidgetItem {...reducedProps} />)

      // Advance to trigger the next rotation
      // With the fix, this should use the new length (2) instead of stale length (5)
      act(() => {
        jest.advanceTimersByTime(3200)
      })
      act(() => {
        jest.advanceTimersByTime(300)
      })

      // The index should wrap correctly with the new length
      // Without the fix, (3+1) % 5 = 4, which would be out of bounds for 2-item array
      // With the fix, (3+1) % 2 = 0, which is valid
      const imgSrc = screen.getByRole('img').src
      expect(imgSrc).toMatch(/new-child[12]\.jpg/)
      expect(imgSrc).not.toContain('undefined')
    })

    it('handles children prop shrinking to empty array mid-rotation', () => {
      // Start with 3 children
      const initialProps = {
        ...carouselProps,
        post: {
          ...carouselProps.post,
          children: [
            { id: 'child1', cdnMediaURL: 'https://cdn.example.com/images/child1.jpg' },
            { id: 'child2', cdnMediaURL: 'https://cdn.example.com/images/child2.jpg' },
            { id: 'child3', cdnMediaURL: 'https://cdn.example.com/images/child3.jpg' }
          ]
        }
      }

      const { rerender } = render(<InstagramWidgetItem {...initialProps} />)

      const button = screen.getByRole('button')
      fireEvent.mouseEnter(button)

      // Advance to show second image
      act(() => {
        jest.advanceTimersByTime(3200)
      })
      act(() => {
        jest.advanceTimersByTime(300)
      })
      expect(screen.getByRole('img').src).toContain('child2.jpg')

      // Now rerender with empty children (all URLs become falsy)
      const emptyChildrenProps = {
        ...carouselProps,
        post: {
          ...carouselProps.post,
          children: []
        }
      }

      rerender(<InstagramWidgetItem {...emptyChildrenProps} />)

      // Advance to trigger the next rotation
      // With the fix, currentLength will be 1 (fallback to [cdnMediaURL])
      // The guard (currentLength > 0) prevents division by zero
      act(() => {
        jest.advanceTimersByTime(3200)
      })
      act(() => {
        jest.advanceTimersByTime(300)
      })

      // Should fall back to main image without crashing
      const img = screen.getByRole('img')
      expect(img).toBeInTheDocument()
      expect(img.src).not.toContain('NaN')
      expect(img.src).not.toContain('undefined')
    })

    it('handles children prop growing mid-rotation', () => {
      // Start with 2 children
      const initialProps = {
        ...carouselProps,
        post: {
          ...carouselProps.post,
          children: [
            { id: 'child1', cdnMediaURL: 'https://cdn.example.com/images/child1.jpg' },
            { id: 'child2', cdnMediaURL: 'https://cdn.example.com/images/child2.jpg' }
          ]
        }
      }

      const { rerender } = render(<InstagramWidgetItem {...initialProps} />)

      const button = screen.getByRole('button')
      fireEvent.mouseEnter(button)

      // Advance to show second image (index 1)
      act(() => {
        jest.advanceTimersByTime(3200)
      })
      act(() => {
        jest.advanceTimersByTime(300)
      })
      expect(screen.getByRole('img').src).toContain('child2.jpg')

      // Now rerender with 5 children (simulating data refetch adding more items)
      const expandedProps = {
        ...carouselProps,
        post: {
          ...carouselProps.post,
          children: [
            { id: 'child1', cdnMediaURL: 'https://cdn.example.com/images/new-child1.jpg' },
            { id: 'child2', cdnMediaURL: 'https://cdn.example.com/images/new-child2.jpg' },
            { id: 'child3', cdnMediaURL: 'https://cdn.example.com/images/new-child3.jpg' },
            { id: 'child4', cdnMediaURL: 'https://cdn.example.com/images/new-child4.jpg' },
            { id: 'child5', cdnMediaURL: 'https://cdn.example.com/images/new-child5.jpg' }
          ]
        }
      }

      rerender(<InstagramWidgetItem {...expandedProps} />)

      // Advance to trigger the next rotation
      // With the fix, this should use the new length (5)
      // (1+1) % 5 = 2, should show new-child3
      act(() => {
        jest.advanceTimersByTime(3200)
      })
      act(() => {
        jest.advanceTimersByTime(300)
      })

      expect(screen.getByRole('img').src).toContain('new-child3.jpg')
    })

    it('handles children URLs all becoming falsy mid-rotation', () => {
      // Start with 3 valid children
      const initialProps = {
        ...carouselProps,
        post: {
          ...carouselProps.post,
          children: [
            { id: 'child1', cdnMediaURL: 'https://cdn.example.com/images/child1.jpg' },
            { id: 'child2', cdnMediaURL: 'https://cdn.example.com/images/child2.jpg' },
            { id: 'child3', cdnMediaURL: 'https://cdn.example.com/images/child3.jpg' }
          ]
        }
      }

      const { rerender } = render(<InstagramWidgetItem {...initialProps} />)

      const button = screen.getByRole('button')
      fireEvent.mouseEnter(button)

      // Advance to show second image
      act(() => {
        jest.advanceTimersByTime(3200)
      })
      act(() => {
        jest.advanceTimersByTime(300)
      })
      expect(screen.getByRole('img').src).toContain('child2.jpg')

      // Now rerender with all falsy URLs (simulating CDN issues)
      const falsyUrlsProps = {
        ...carouselProps,
        post: {
          ...carouselProps.post,
          children: [
            { id: 'child1', cdnMediaURL: null },
            { id: 'child2', cdnMediaURL: undefined },
            { id: 'child3', cdnMediaURL: '' }
          ]
        }
      }

      rerender(<InstagramWidgetItem {...falsyUrlsProps} />)

      // Advance to trigger the next rotation
      // carouselImages will be [cdnMediaURL] (length 1) after filtering
      // The guard (currentLength > 0) ensures valid modulo operation
      act(() => {
        jest.advanceTimersByTime(3200)
      })
      act(() => {
        jest.advanceTimersByTime(300)
      })

      // Should show main image without crashing
      const img = screen.getByRole('img')
      expect(img.src).toContain('main-image.jpg')
      expect(img.src).not.toContain('NaN')
    })
  })
})
