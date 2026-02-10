import React from 'react'
import { render } from '@testing-library/react'
import PlaylistsErrorBoundary from './playlists-error-boundary'

// A simple component that renders normally.
const NormalChild = () => <div data-testid='normal-child'>I am fine</div>

// A component that simulates a render error.
const ErrorChild = () => {
  throw new Error('Simulated error')
}

describe('PlaylistsErrorBoundary', () => {
  // Suppress error logging for the test that intentionally causes an error.
  const consoleError = console.error
  beforeAll(() => {
    console.error = () => {} // no-op
  })

  afterAll(() => {
    console.error = consoleError
  })

  it('renders its children when no error is thrown', () => {
    const { getByTestId } = render(
      <PlaylistsErrorBoundary>
        <NormalChild />
      </PlaylistsErrorBoundary>
    )
    expect(getByTestId('normal-child')).toBeTruthy()
  })

  it('catches errors from children and renders null', () => {
    const { container } = render(
      <PlaylistsErrorBoundary>
        <ErrorChild />
      </PlaylistsErrorBoundary>
    )
    // When an error is caught, the boundary renders null via FallbackComponent,
    // so container.firstChild should be null.
    expect(container.firstChild).toBeNull()
  })
})
