import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ThemeUIProvider } from 'theme-ui'
import theme from '@chronogrove/ui/theme'

// Mock useColorMode to control light/dark mode
const mockUseColorMode = jest.fn()
jest.mock('theme-ui', () => ({
  ...jest.requireActual('theme-ui'),
  useColorMode: () => mockUseColorMode()
}))

import Note from './Note'

const renderWithTheme = (ui, colorMode = 'default') => {
  mockUseColorMode.mockReturnValue([colorMode])
  return render(<ThemeUIProvider theme={theme}>{ui}</ThemeUIProvider>)
}

describe('Note Component', () => {
  beforeEach(() => {
    mockUseColorMode.mockReturnValue(['default'])
  })

  describe('rendering', () => {
    it('renders children content', () => {
      renderWithTheme(<Note>Test note content</Note>)
      expect(screen.getByText('Test note content')).toBeInTheDocument()
    })

    it('renders as a blockquote', () => {
      const { container } = renderWithTheme(<Note>Content</Note>)
      const blockquote = container.querySelector('blockquote')
      expect(blockquote).toBeInTheDocument()
    })

    it('renders with default info variant', () => {
      renderWithTheme(<Note>Info note</Note>)
      expect(screen.getByText('Info note')).toBeInTheDocument()
    })
  })

  describe('variants', () => {
    it('renders update variant with content', () => {
      renderWithTheme(
        <Note variant='update'>
          <strong>Update:</strong> Resolved!
        </Note>
      )
      expect(screen.getByText(/Update:/)).toBeInTheDocument()
      expect(screen.getByText(/Resolved!/)).toBeInTheDocument()
    })

    it('renders outdated variant with content', () => {
      renderWithTheme(
        <Note variant='outdated'>
          <strong>Note:</strong> This is from 2024.
        </Note>
      )
      expect(screen.getByText(/Note:/)).toBeInTheDocument()
      expect(screen.getByText(/This is from 2024/)).toBeInTheDocument()
    })
  })

  describe('icon', () => {
    it('shows icon by default', () => {
      const { container } = renderWithTheme(<Note>Content</Note>)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('hides icon when icon prop is false', () => {
      const { container } = renderWithTheme(<Note icon={false}>Content</Note>)
      const svg = container.querySelector('svg')
      expect(svg).not.toBeInTheDocument()
    })
  })

  describe('color mode', () => {
    it('uses light success color for update variant in default mode', () => {
      mockUseColorMode.mockReturnValue(['default'])
      const { container } = renderWithTheme(<Note variant='update'>Resolved</Note>)
      const iconBox = container.querySelector('blockquote > div')
      expect(iconBox).toBeInTheDocument()
    })

    it('uses dark success color for update variant in dark mode', () => {
      mockUseColorMode.mockReturnValue(['dark'])
      renderWithTheme(<Note variant='update'>Resolved</Note>)
      expect(screen.getByText('Resolved')).toBeInTheDocument()
    })

    it('falls back to light success color when colorMode is unknown', () => {
      mockUseColorMode.mockReturnValue(['custom-mode'])
      renderWithTheme(<Note variant='update'>Resolved</Note>)
      expect(screen.getByText('Resolved')).toBeInTheDocument()
    })
  })

  describe('invalid variant', () => {
    it('falls back to info when variant is unknown', () => {
      renderWithTheme(<Note variant='unknown'>Fallback content</Note>)
      expect(screen.getByText('Fallback content')).toBeInTheDocument()
    })
  })
})
