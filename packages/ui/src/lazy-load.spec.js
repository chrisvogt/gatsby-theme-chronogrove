import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import LazyLoad from './lazy-load.js'

let mockInView = false

jest.mock('react-intersection-observer', () => ({
  useInView: () => ({
    ref: jest.fn(),
    inView: mockInView
  })
}))

const MockPlaceholder = () => <div data-testid='placeholder'>Placeholder</div>

describe('LazyLoad', () => {
  afterEach(() => {
    jest.clearAllMocks()
    mockInView = false
  })

  it('renders the default placeholder initially', () => {
    render(
      <LazyLoad>
        <div data-testid='content'>Lazy Loaded Content</div>
      </LazyLoad>
    )

    expect(screen.getByTestId('default-placeholder')).toBeInTheDocument()
    expect(screen.queryByTestId('content')).not.toBeInTheDocument()
  })

  it('renders the children when visible', async () => {
    mockInView = true

    render(
      <LazyLoad>
        <div data-testid='content'>Lazy Loaded Content</div>
      </LazyLoad>
    )

    await waitFor(() => {
      expect(screen.getByTestId('content')).toBeInTheDocument()
    })
  })

  it('renders the custom placeholder when provided', () => {
    render(
      <LazyLoad placeholder={<MockPlaceholder />}>
        <div data-testid='content'>Lazy Loaded Content</div>
      </LazyLoad>
    )

    expect(screen.getByTestId('placeholder')).toBeInTheDocument()
    expect(screen.queryByTestId('content')).not.toBeInTheDocument()
  })

  it('does not re-render children if already visible', async () => {
    mockInView = true

    const { rerender } = render(
      <LazyLoad>
        <div data-testid='content'>Lazy Loaded Content</div>
      </LazyLoad>
    )

    await waitFor(() => {
      expect(screen.getByTestId('content')).toBeInTheDocument()
    })

    mockInView = false

    rerender(
      <LazyLoad>
        <div data-testid='content'>Lazy Loaded Content</div>
      </LazyLoad>
    )

    expect(screen.getByTestId('content')).toBeInTheDocument()
  })

  it('does not render children when visibility remains false', () => {
    render(
      <LazyLoad>
        <div data-testid='content'>Lazy Loaded Content</div>
      </LazyLoad>
    )

    expect(screen.queryByTestId('content')).not.toBeInTheDocument()
  })
})
