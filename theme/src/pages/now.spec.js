import React from 'react'
import { render } from '@testing-library/react'
import { navigate } from 'gatsby'

import NowPage from './now'

// Mock Gatsby's navigate function
jest.mock('gatsby', () => ({
  navigate: jest.fn()
}))

describe('NowPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('redirects to the latest recap on mount', () => {
    render(<NowPage />)

    expect(navigate).toHaveBeenCalledWith('/personal/october-2025', { replace: true })
  })

  it('uses replace to avoid adding to browser history', () => {
    render(<NowPage />)

    const callArgs = navigate.mock.calls[0]
    expect(callArgs[1].replace).toBe(true)
  })

  it('renders nothing (returns null)', () => {
    const { container } = render(<NowPage />)

    expect(container.firstChild).toBeNull()
  })
})
