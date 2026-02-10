import React from 'react'
import { render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import Widget from './widget'
import { trackWidgetInteraction } from '../../utils/analytics'

jest.mock('../../utils/analytics', () => ({
  trackWidgetInteraction: jest.fn()
}))

describe('Widget', () => {
  let mockIntersectionObserver

  beforeEach(() => {
    jest.clearAllMocks()

    // Mock IntersectionObserver
    // eslint-disable-next-line no-unused-vars
    mockIntersectionObserver = jest.fn(function (callback, options) {
      this.observe = jest.fn(element => {
        // Simulate the element being visible (50% or more)
        setTimeout(() => {
          callback([
            {
              isIntersecting: true,
              intersectionRatio: 0.75,
              target: element
            }
          ])
        }, 0)
      })
      this.disconnect = jest.fn()
      this.unobserve = jest.fn()
    })

    global.IntersectionObserver = mockIntersectionObserver
  })

  afterEach(() => {
    delete global.IntersectionObserver
  })

  it('matches the snapshot', () => {
    const { asFragment } = render(<Widget>Test</Widget>)
    expect(asFragment()).toMatchSnapshot()
  })

  it('sets the widget id attribute when provided', () => {
    const id = 'fake-widget'
    render(<Widget id={id}>Test</Widget>)
    const section = document.querySelector('section')
    expect(section).toHaveAttribute('id', id)
  })

  it('tracks impression when widget becomes visible', async () => {
    const id = 'test-widget'
    render(<Widget id={id}>Test Content</Widget>)

    // Wait for the intersection observer callback to fire
    await waitFor(() => {
      expect(trackWidgetInteraction).toHaveBeenCalledWith(id, 'impression', {
        visibility_ratio: 0.75,
        fatal_error: undefined
      })
    })
  })

  it('does not track impression when widget has no id', async () => {
    render(<Widget>Test Content</Widget>)

    // Wait a bit to ensure no tracking happens
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(trackWidgetInteraction).not.toHaveBeenCalled()
  })

  it('tracks fatal error state in impression event', async () => {
    const id = 'error-widget'
    render(
      <Widget id={id} hasFatalError={true}>
        Error Content
      </Widget>
    )

    await waitFor(() => {
      expect(trackWidgetInteraction).toHaveBeenCalledWith(id, 'impression', {
        visibility_ratio: 0.75,
        fatal_error: true
      })
    })
  })

  it('only tracks impression once', async () => {
    const id = 'test-widget'
    const { rerender } = render(<Widget id={id}>Test Content</Widget>)

    await waitFor(() => {
      expect(trackWidgetInteraction).toHaveBeenCalledTimes(1)
    })

    // Re-render the component
    rerender(<Widget id={id}>Updated Content</Widget>)

    // Wait a bit and verify it was still only called once
    await new Promise(resolve => setTimeout(resolve, 100))
    expect(trackWidgetInteraction).toHaveBeenCalledTimes(1)
  })
})
