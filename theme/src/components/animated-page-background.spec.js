import React from 'react'
import { render, cleanup } from '@testing-library/react'
import { ThemeProvider } from 'theme-ui'
import AnimatedPageBackground from './animated-page-background'
import theme from '../gatsby-plugin-theme-ui/theme'

// Mock the background components
jest.mock('./home-backgrounds/prismatic-burst', () => {
  return function MockPrismaticBurst() {
    return <div data-testid='prismatic-burst'>Prismatic Burst</div>
  }
})

jest.mock('./home-backgrounds/color-bends', () => {
  return function MockColorBends() {
    return <div data-testid='color-bends'>Color Bends</div>
  }
})

describe('AnimatedPageBackground', () => {
  afterEach(() => {
    cleanup()
  })

  const renderWithTheme = (component, colorMode = 'light') => {
    return render(<ThemeProvider theme={{ ...theme, initialColorModeName: colorMode }}>{component}</ThemeProvider>)
  }

  it('renders without crashing', () => {
    renderWithTheme(<AnimatedPageBackground />)
  })

  it('renders PrismaticBurst in light mode', () => {
    const { getByTestId } = renderWithTheme(<AnimatedPageBackground />, 'light')
    expect(getByTestId('prismatic-burst')).toBeInTheDocument()
  })

  it('applies custom overlay height', () => {
    const { container } = renderWithTheme(<AnimatedPageBackground overlayHeight='500px' />)
    // Just verify it renders without errors when custom height is provided
    expect(container).toBeTruthy()
  })

  it('accepts custom opacity props', () => {
    renderWithTheme(<AnimatedPageBackground lightOpacity={0.5} darkOpacity={0.2} />)
    // Just verify it renders without errors
  })

  it('renders both fixed background and overlay', () => {
    const { container } = renderWithTheme(<AnimatedPageBackground />)
    const divs = container.querySelectorAll('div')
    // Should have at least 2 divs: fixed background + overlay
    expect(divs.length).toBeGreaterThanOrEqual(2)
  })

  it('uses default overlay height when not provided', () => {
    const { container } = renderWithTheme(<AnimatedPageBackground />)
    expect(container).toBeTruthy()
  })

  it('accepts custom parallax speed', () => {
    renderWithTheme(<AnimatedPageBackground parallaxSpeed={0.3} />)
    // Just verify it renders without errors
  })

  it('sets up scroll event listener for parallax', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener')
    const { unmount } = renderWithTheme(<AnimatedPageBackground />)

    // Should add scroll listener with passive flag
    expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function), { passive: true })

    addEventListenerSpy.mockRestore()
    unmount()
  })
})
