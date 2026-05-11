import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ThemeUIProvider } from 'theme-ui'
import theme from '@chronogrove/ui/theme'

const mockUseColorMode = jest.fn()
jest.mock('theme-ui', () => ({
  ...jest.requireActual('theme-ui'),
  useColorMode: () => mockUseColorMode()
}))

import ColorModeImage, { applyCloudinaryAutoTransform } from './color-mode-image'

const LIGHT = 'https://res.cloudinary.com/demo/image/upload/v169/example/light.png'
const DARK = 'https://res.cloudinary.com/demo/image/upload/v169/example/dark.png'

describe('applyCloudinaryAutoTransform', () => {
  it('inserts f_auto,q_auto when only a version segment follows upload', () => {
    expect(applyCloudinaryAutoTransform(LIGHT)).toBe(
      'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/v169/example/light.png'
    )
  })

  it('leaves URLs that already specify f_auto unchanged', () => {
    const u = 'https://res.cloudinary.com/demo/image/upload/f_auto/v169/example/light.png'
    expect(applyCloudinaryAutoTransform(u)).toBe(u)
  })

  it('leaves URLs that already specify q_auto unchanged', () => {
    const u = 'https://res.cloudinary.com/demo/image/upload/q_auto,w_800/v169/example/light.png'
    expect(applyCloudinaryAutoTransform(u)).toBe(u)
  })

  it('ignores non-Cloudinary URLs', () => {
    const u = 'https://example.com/image/upload/v1/foo.png'
    expect(applyCloudinaryAutoTransform(u)).toBe(u)
  })

  it('returns the original input when it cannot be parsed as a URL', () => {
    expect(applyCloudinaryAutoTransform('/relative-only/path')).toBe('/relative-only/path')
  })

  it('returns falsy or non-string input unchanged', () => {
    expect(applyCloudinaryAutoTransform(null)).toBe(null)
    expect(applyCloudinaryAutoTransform(undefined)).toBe(undefined)
    expect(applyCloudinaryAutoTransform(/** @type {any} */ (101))).toBe(101)
    expect(applyCloudinaryAutoTransform('')).toBe('')
  })

  it('returns URL unchanged when path has no upload segment', () => {
    const u = 'https://res.cloudinary.com/demo/v169/catalog/asset-id/raw/upload.bin'
    expect(applyCloudinaryAutoTransform(u)).toBe(u)
  })

  it('returns URL unchanged when nothing follows upload', () => {
    const u = 'https://res.cloudinary.com/demo/image/upload'
    expect(applyCloudinaryAutoTransform(u)).toBe(u)
  })
})

describe('ColorModeImage', () => {
  beforeEach(() => {
    mockUseColorMode.mockReturnValue(['default'])
  })

  const renderImg = (ui, colorMode = 'default') => {
    mockUseColorMode.mockReturnValue([colorMode])
    return render(<ThemeUIProvider theme={theme}>{ui}</ThemeUIProvider>)
  }

  it('uses light src in default mode', () => {
    renderImg(<ColorModeImage light={LIGHT} dark={DARK} alt='Screenshot' />)
    const img = screen.getByRole('img', { name: 'Screenshot' })
    expect(img).toHaveAttribute(
      'src',
      'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/v169/example/light.png'
    )
  })

  it('uses dark src when color mode is dark', () => {
    renderImg(<ColorModeImage light={LIGHT} dark={DARK} alt='Screenshot' />, 'dark')
    const img = screen.getByRole('img', { name: 'Screenshot' })
    expect(img).toHaveAttribute(
      'src',
      'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/v169/example/dark.png'
    )
  })

  it('uses light src when color mode is light', () => {
    renderImg(<ColorModeImage light={LIGHT} dark={DARK} alt='Screenshot' />, 'light')
    expect(screen.getByRole('img')).toHaveAttribute(
      'src',
      'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/v169/example/light.png'
    )
  })

  it('forwards extra img props to Themed.img', () => {
    renderImg(<ColorModeImage light={LIGHT} dark={DARK} alt='Screenshot' data-test-prop='x' />)
    expect(screen.getByRole('img')).toHaveAttribute('data-test-prop', 'x')
  })

  it('defaults loading to lazy', () => {
    renderImg(<ColorModeImage light={LIGHT} dark={DARK} alt='Screenshot' />)
    expect(screen.getByRole('img')).toHaveAttribute('loading', 'lazy')
  })

  it('allows overriding loading', () => {
    renderImg(<ColorModeImage light={LIGHT} dark={DARK} alt='Screenshot' loading='eager' />)
    expect(screen.getByRole('img')).toHaveAttribute('loading', 'eager')
  })

  it('skips Cloudinary optimization when optimizeDelivery is false', () => {
    renderImg(<ColorModeImage light={LIGHT} dark={DARK} alt='Screenshot' optimizeDelivery={false} />)
    expect(screen.getByRole('img')).toHaveAttribute('src', LIGHT)
  })
})
