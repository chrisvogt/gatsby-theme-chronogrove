import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import LazyLoad from './lazy-load'

// Control visibility per test
let mockInView = false

jest.mock('react-intersection-observer', () => ({
  useInView: () => ({
    ref: jest.fn(),
    inView: mockInView
  })
}))

// Mock placeholder component
const MockPlaceholder = () => <div data-testid='placeholder'>Placeholder</div>

describe('LazyLoad', () => {
  afterEach(() => {
    jest.clearAllMocks()
    mockInView = false // Reset visibility after each test
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

  it('renders the children when visible', () => {
    mockInView = true

    render(
      <LazyLoad>
        <div data-testid='content'>Lazy Loaded Content</div>
      </LazyLoad>
    )

    expect(screen.getByTestId('content')).toBeInTheDocument()
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

  it('does not re-render children if already visible', () => {
    mockInView = true

    const { rerender } = render(
      <LazyLoad>
        <div data-testid='content'>Lazy Loaded Content</div>
      </LazyLoad>
    )

    expect(screen.getByTestId('content')).toBeInTheDocument()

    // Change visibility to false (should not affect render after being visible once)
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
