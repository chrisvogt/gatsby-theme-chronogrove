import {
  buildHtmlBackgroundInlineScript,
  buildThemeUiColorModeFallbackCss,
  buildThemeUiNoFlashInlineScript
} from './head-inline.js'

describe('head-inline scripts', () => {
  it('buildThemeUiNoFlashInlineScript references storage and data attribute', () => {
    const s = buildThemeUiNoFlashInlineScript()
    expect(s).toContain('theme-ui-color-mode')
    expect(s).toContain('data-theme-ui-color-mode')
  })

  it('buildHtmlBackgroundInlineScript embeds background hexes', () => {
    const s = buildHtmlBackgroundInlineScript({
      defaultBackgroundHex: '#aaa',
      darkBackgroundHex: '#bbb'
    })
    expect(s).toContain('#aaa')
    expect(s).toContain('#bbb')
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
