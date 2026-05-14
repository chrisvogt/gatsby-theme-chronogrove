import {
  buildHtmlBackgroundInlineScript,
  buildInitialThemeUiColorModeResolutionInlineFragment,
  buildThemeUiColorModeFallbackCss,
  buildThemeUiNoFlashInlineScript
} from './head-inline.js'

describe('head-inline scripts', () => {
  it('buildInitialThemeUiColorModeResolutionInlineFragment() uses default args (local-only)', () => {
    const fragment = buildInitialThemeUiColorModeResolutionInlineFragment()
    expect(fragment).not.toContain('__cgGetCookie')
  })

  it('buildThemeUiNoFlashInlineScript uses localStorage-only resolution when cross-domain is off', () => {
    const s = buildThemeUiNoFlashInlineScript()
    expect(s).toContain('theme-ui-color-mode')
    expect(s).toContain('localStorage.getItem')
    expect(s).not.toContain('__cgGetCookie')
    expect(s).toContain('dataset.themeUiColorMode')
  })

  it('embeds cookie merge when crossDomainColorMode.registrableDomain is set', () => {
    const s = buildThemeUiNoFlashInlineScript({
      crossDomainColorMode: { registrableDomain: 'example.com' }
    })
    expect(s).toContain('__cgGetCookie')
    expect(s).toContain('chronogrove-theme-ui-color-mode')
  })

  it('respects optional cookieName when registrableDomain is set', () => {
    const s = buildThemeUiNoFlashInlineScript({
      crossDomainColorMode: { registrableDomain: 'example.com', cookieName: 'my-shared-mode' }
    })
    expect(s).toContain('__cgGetCookie')
    expect(s).toContain('my-shared-mode')
  })

  it('treats crossDomainColorMode without registrableDomain as local-only', () => {
    const s = buildThemeUiNoFlashInlineScript({
      crossDomainColorMode: { cookieName: 'orphan-name' }
    })
    expect(s).not.toContain('__cgGetCookie')
  })

  it('omits cookie merge when registrableDomain is invalid', () => {
    const s = buildThemeUiNoFlashInlineScript({
      crossDomainColorMode: { registrableDomain: 'a..b' }
    })
    expect(s).not.toContain('__cgGetCookie')
  })

  it('accepts a custom storage key string (legacy signature)', () => {
    const s = buildThemeUiNoFlashInlineScript('my-mode-key')
    expect(s).toContain('my-mode-key')
  })

  it('accepts storageKey on the options object with cross-domain config', () => {
    const s = buildThemeUiNoFlashInlineScript({
      storageKey: 'custom-storage',
      crossDomainColorMode: { registrableDomain: 'example.com' }
    })
    expect(s).toContain('custom-storage')
    expect(s).toContain('__cgGetCookie')
  })

  it('buildHtmlBackgroundInlineScript embeds background hexes', () => {
    const s = buildHtmlBackgroundInlineScript({
      defaultBackgroundHex: '#aaa',
      darkBackgroundHex: '#bbb'
    })
    expect(s).toContain('#aaa')
    expect(s).toContain('#bbb')
  })

  it('passes crossDomainColorMode through to the resolution fragment', () => {
    const s = buildHtmlBackgroundInlineScript({
      defaultBackgroundHex: '#aaa',
      darkBackgroundHex: '#bbb',
      crossDomainColorMode: { registrableDomain: 'example.com' }
    })
    expect(s).toContain('__cgGetCookie')
    expect(s).toContain('#aaa')
  })

  it('applies the default empty options object when buildHtmlBackgroundInlineScript is called with no args', () => {
    const s = buildHtmlBackgroundInlineScript()
    expect(s).toContain('document.documentElement.style.backgroundColor')
  })

  it('buildThemeUiColorModeFallbackCss sets CSS vars', () => {
    const css = buildThemeUiColorModeFallbackCss({
      defaultBackgroundHex: '#fdf8f5',
      darkBackgroundHex: '#14141F',
      defaultTextHex: '#111',
      defaultTextMutedHex: '#333',
      darkTextHex: '#fff',
      darkTextMutedHex: '#ccc'
    })
    expect(css).toContain(':root {')
    expect(css).toContain('--theme-ui-colors-background: #fdf8f5')
    expect(css).toContain('--theme-ui-colors-text: #111')
    expect(css).toContain('--theme-ui-colors-text: #fff')
    expect(css).toContain('--theme-ui-colors-panel-background:')
    expect(css).toContain('--theme-ui-colors-panel-text:')
  })

  it('buildThemeUiColorModeFallbackCss uses default background hexes when omitted', () => {
    const css = buildThemeUiColorModeFallbackCss({
      defaultTextHex: '#111',
      defaultTextMutedHex: '#333',
      darkTextHex: '#fff',
      darkTextMutedHex: '#ccc'
    })
    expect(css).toContain('--theme-ui-colors-background: #fdf8f5')
    expect(css).toContain('--theme-ui-colors-background: #14141F')
  })

  it('buildThemeUiColorModeFallbackCss uses chronogrove-theme-surface-colors when called with no options', () => {
    const css = buildThemeUiColorModeFallbackCss()
    expect(css).toContain('--theme-ui-colors-background: #fdf8f5')
    expect(css).toContain('--theme-ui-colors-background: #14141F')
    expect(css).toContain('rgba(255, 255, 255, 0.45)')
    expect(css).toContain('rgba(20, 20, 31, 0.45)')
    expect(css).toMatch(/--theme-ui-colors-text: #111/)
    expect(css).toMatch(/--theme-ui-colors-text-muted: #333/)
    expect(css).toMatch(/--theme-ui-colors-text: #fff/)
    expect(css).toMatch(/--theme-ui-colors-text-muted: #d8d8d8/)
  })
})
