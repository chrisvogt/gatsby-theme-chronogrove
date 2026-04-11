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
})
