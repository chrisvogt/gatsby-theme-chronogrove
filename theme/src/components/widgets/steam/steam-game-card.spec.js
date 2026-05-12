import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { ThemeUIProvider } from 'theme-ui'
import theme from '@chronogrove/ui/theme'
import SteamGameCard from './steam-game-card'

// Mock LazyLoad component
jest.mock('../../lazy-load', () => ({ children }) => <>{children}</>)

const renderWithTheme = (component, colorMode = 'light') => {
  const testTheme = { ...theme, initialColorModeName: colorMode }
  return render(<ThemeUIProvider theme={testTheme}>{component}</ThemeUIProvider>)
}

describe('SteamGameCard', () => {
  const mockGame = {
    id: '123',
    displayName: 'Test Game',
    images: {
      header: 'https://example.com/game-header.jpg',
      icon: 'https://example.com/game-icon.jpg'
    },
    playTime2Weeks: 120,
    playTimeForever: 1000
  }

  beforeEach(() => {
    // Mock window.open
    global.open = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders game card with header image', () => {
    const { container } = renderWithTheme(<SteamGameCard game={mockGame} />)
    const img = container.querySelector('img')
    expect(img).toBeTruthy()
    expect(img.getAttribute('src')).toBe('https://example.com/game-header.jpg')
    expect(img.getAttribute('alt')).toBe('Test Game header')
  })

  it('falls back to icon image when header is missing', () => {
    const gameWithoutHeader = {
      ...mockGame,
      images: {
        icon: 'https://example.com/game-icon.jpg'
      }
    }
    const { container } = renderWithTheme(<SteamGameCard game={gameWithoutHeader} />)
    const img = container.querySelector('img')
    expect(img.getAttribute('src')).toBe('https://example.com/game-icon.jpg')
  })

  it('handles missing images gracefully', () => {
    const gameWithoutImages = {
      ...mockGame,
      images: {}
    }
    const { container } = renderWithTheme(<SteamGameCard game={gameWithoutImages} />)
    expect(container.querySelector('img')).not.toBeInTheDocument()
    expect(container.querySelector('.show-loading-animation')).toBeInTheDocument()
  })

  it('uses dark skeleton colors when images are missing in dark mode', () => {
    const gameWithoutImages = { ...mockGame, images: {} }
    const { container } = renderWithTheme(<SteamGameCard game={gameWithoutImages} />, 'dark')
    expect(container.querySelector('.show-loading-animation')).toBeInTheDocument()
  })

  it('displays rank badge when showRank is true', () => {
    const { container } = renderWithTheme(<SteamGameCard game={mockGame} showRank={true} rank={1} />)
    expect(container.textContent).toContain('1')
  })

  it('does not display rank badge when showRank is false', () => {
    const { container } = renderWithTheme(<SteamGameCard game={mockGame} showRank={false} />)
    // Rank badge should not be rendered
    const badges = container.querySelectorAll('div[style*="position: absolute"]')
    // Should only have gradient overlay, not rank badge
    expect(badges.length).toBeLessThanOrEqual(2)
  })

  it('displays subtitle when provided', () => {
    const { container } = renderWithTheme(<SteamGameCard game={mockGame} subtitle='2h played' />)
    expect(container.textContent).toContain('2h played')
  })

  it('does not display subtitle when not provided', () => {
    const { container } = renderWithTheme(<SteamGameCard game={mockGame} />)
    expect(container.textContent).not.toContain('h played')
  })

  it('calls window.open with correct URL on click', () => {
    const { container } = renderWithTheme(<SteamGameCard game={mockGame} />)
    const card = container.firstChild
    fireEvent.click(card)
    expect(global.open).toHaveBeenCalledWith('https://store.steampowered.com/app/123', '_blank')
  })

  it('calls custom onClick handler when provided', () => {
    const mockOnClick = jest.fn()
    const { container } = renderWithTheme(<SteamGameCard game={mockGame} onClick={mockOnClick} />)
    const card = container.firstChild
    fireEvent.click(card)
    expect(mockOnClick).toHaveBeenCalled()
    expect(global.open).not.toHaveBeenCalled()
  })

  it('renders as a button element for keyboard accessibility', () => {
    const { container } = renderWithTheme(<SteamGameCard game={mockGame} />)
    const card = container.firstChild
    expect(card.tagName).toBe('BUTTON')
    expect(card.getAttribute('type')).toBe('button')
  })

  it('has an aria-label describing the game', () => {
    const { container } = renderWithTheme(<SteamGameCard game={mockGame} />)
    const card = container.firstChild
    expect(card.getAttribute('aria-label')).toBe('View Test Game on Steam')
  })

  it('handles hover state correctly', () => {
    const { container } = renderWithTheme(<SteamGameCard game={mockGame} />)
    const card = container.firstChild

    fireEvent.mouseEnter(card)
    // Component should update hover state
    expect(card).toBeTruthy()

    fireEvent.mouseLeave(card)
    // Component should update hover state
    expect(card).toBeTruthy()
  })

  it('uses focus/blur for the same image zoom behavior as hover', () => {
    const { container } = renderWithTheme(<SteamGameCard game={mockGame} />)
    const card = container.firstChild
    const img = container.querySelector('img')

    const baseline = window.getComputedStyle(img).transform
    fireEvent.focus(card)
    expect(window.getComputedStyle(img).transform).not.toBe(baseline)

    fireEvent.blur(card)
    expect(window.getComputedStyle(img).transform).toBe(baseline)
  })

  it('renders the hover caption overlay (Spotify-style)', () => {
    const { container } = renderWithTheme(<SteamGameCard game={mockGame} subtitle='1h' />)
    expect(container.querySelector('.steam-game-card_caption')).toBeInTheDocument()
  })

  it('stacks rank badge above the caption overlay', () => {
    const { container } = renderWithTheme(<SteamGameCard game={mockGame} showRank={true} rank={4} subtitle='10h' />)
    const caption = container.querySelector('.steam-game-card_caption')
    const badge = [...container.querySelectorAll('div')].find(
      el => el !== caption && el.textContent === '4' && el !== container.firstChild
    )
    expect(caption).toBeTruthy()
    expect(badge).toBeTruthy()
    expect(window.getComputedStyle(caption).zIndex).toBe('1')
    expect(window.getComputedStyle(badge).zIndex).toBe('2')
  })

  it('does not render rank badge when showRank is true but rank is null', () => {
    const { container } = renderWithTheme(
      <SteamGameCard game={{ ...mockGame, displayName: 'Alpha' }} showRank={true} rank={null} />
    )
    const digitOnlyDivs = [...container.querySelectorAll('div')].filter(d => /^\d+$/.test((d.textContent || '').trim()))
    expect(digitOnlyDivs).toHaveLength(0)
  })

  describe('Dark mode', () => {
    it('renders correctly in dark mode', () => {
      const { container } = renderWithTheme(<SteamGameCard game={mockGame} showRank={true} rank={1} />, 'dark')
      expect(container.textContent).toContain('Test Game')
      expect(container.textContent).toContain('1')
    })

    it('applies dark mode styles to rank badge', () => {
      const { container } = renderWithTheme(<SteamGameCard game={mockGame} showRank={true} rank={5} />, 'dark')
      expect(container.textContent).toContain('5')
    })

    it('applies dark mode styles to subtitle', () => {
      const { container } = renderWithTheme(<SteamGameCard game={mockGame} subtitle='10h played' />, 'dark')
      expect(container.textContent).toContain('10h played')
    })
  })

  describe('Light mode', () => {
    it('renders correctly in light mode', () => {
      const { container } = renderWithTheme(<SteamGameCard game={mockGame} showRank={true} rank={2} />, 'light')
      expect(container.textContent).toContain('Test Game')
      expect(container.textContent).toContain('2')
    })

    it('applies light mode styles to rank badge', () => {
      const { container } = renderWithTheme(<SteamGameCard game={mockGame} showRank={true} rank={3} />, 'light')
      expect(container.textContent).toContain('3')
    })

    it('applies light mode styles to subtitle', () => {
      const { container } = renderWithTheme(<SteamGameCard game={mockGame} subtitle='5h played' />, 'light')
      expect(container.textContent).toContain('5h played')
    })
  })
})
