import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ThemeUIProvider } from 'theme-ui'

import Category from './category'
import theme from '../gatsby-plugin-theme-ui/theme'

const renderWithTheme = ui => render(<ThemeUIProvider theme={theme}>{ui}</ThemeUIProvider>)

describe('Category Component', () => {
  describe('Category Mappings', () => {
    it('renders "Travel Photography" when type is "photography/travel"', () => {
      renderWithTheme(<Category type='photography/travel' />)
      expect(screen.getByText('Travel Photography')).toBeInTheDocument()
    })

    it('renders "Event Photography" when type is "photography/events"', () => {
      renderWithTheme(<Category type='photography/events' />)
      expect(screen.getByText('Event Photography')).toBeInTheDocument()
    })

    it('renders "Piano Covers" when type is "music/piano-covers"', () => {
      renderWithTheme(<Category type='music/piano-covers' />)
      expect(screen.getByText('Piano Covers')).toBeInTheDocument()
    })

    it('renders "Cycling Videos" when type is "videos/bike-rides"', () => {
      renderWithTheme(<Category type='videos/bike-rides' />)
      expect(screen.getByText('Cycling Videos')).toBeInTheDocument()
    })

    it('renders "Travel" when type is "travel"', () => {
      renderWithTheme(<Category type='travel' />)
      expect(screen.getByText('Travel')).toBeInTheDocument()
    })
  })

  describe('Title Case Transformation', () => {
    it('converts hyphenated words to title case', () => {
      renderWithTheme(<Category type='blog-post' />)
      expect(screen.getByText('Blog Post')).toBeInTheDocument()
    })

    it('converts slash-separated words to title case', () => {
      renderWithTheme(<Category type='blog/tech' />)
      expect(screen.getByText('Blog Tech')).toBeInTheDocument()
    })

    it('handles mixed case input', () => {
      renderWithTheme(<Category type='BLOG/TECH' />)
      expect(screen.getByText('Blog Tech')).toBeInTheDocument()
    })

    it('handles single word categories', () => {
      renderWithTheme(<Category type='blog' />)
      expect(screen.getByText('Blog')).toBeInTheDocument()
    })

    it('handles multiple separators', () => {
      renderWithTheme(<Category type='blog/tech-post' />)
      expect(screen.getByText('Blog Tech Post')).toBeInTheDocument()
    })
  })

  describe('Component Styling', () => {
    it('applies the passed sx styles', () => {
      const sx = { color: 'red' }
      renderWithTheme(<Category type='photography/travel' sx={sx} />)
      const element = screen.getByText('Travel Photography')
      expect(getComputedStyle(element).color).toMatch(/red|rgb\(255, 0, 0\)/)
    })
  })
})
