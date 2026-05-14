import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

const mockUseColorMode = jest.fn()
jest.mock('theme-ui', () => ({
  ...jest.requireActual('theme-ui'),
  useColorMode: () => mockUseColorMode()
}))

import { MusicRepertoirePromo } from '../../../../websites/www.chrisvogt.me/src/pages/music'
import { TestProvider } from '../testUtils'

describe('MusicRepertoirePromo', () => {
  beforeEach(() => {
    mockUseColorMode.mockReturnValue(['default'])
  })

  it('links to repertoire.chrisvogt.me with expected copy', () => {
    render(
      <TestProvider>
        <MusicRepertoirePromo />
      </TestProvider>
    )

    const link = screen.getByRole('link', { name: /My piano repertoire/i })
    expect(link).toHaveAttribute('href', 'https://repertoire.chrisvogt.me/')
    expect(screen.getByRole('heading', { level: 2, name: 'My piano repertoire' })).toBeInTheDocument()
    expect(screen.getByText(/Browse the full list online/)).toBeInTheDocument()
    expect(screen.getByText('Visit repertoire.chrisvogt.me')).toBeInTheDocument()
    expect(screen.getByTestId('music-repertoire-promo')).toBeInTheDocument()
  })

  it('uses light screenshot URL in default color mode', () => {
    mockUseColorMode.mockReturnValue(['default'])
    const { container } = render(
      <TestProvider>
        <MusicRepertoirePromo />
      </TestProvider>
    )
    const img = container.querySelector('img')
    expect(img).toBeTruthy()
    expect(img.getAttribute('src')).toContain('repertoire-screenshot-light')
    expect(img).toHaveAttribute('alt', '')
  })

  it('uses dark screenshot URL in dark color mode', () => {
    mockUseColorMode.mockReturnValue(['dark'])
    const { container } = render(
      <TestProvider>
        <MusicRepertoirePromo />
      </TestProvider>
    )
    const img = container.querySelector('img')
    expect(img).toBeTruthy()
    expect(img.getAttribute('src')).toContain('repertoire-screenshot-dark')
  })
})
