import { getAiSummaryFadeBackground } from './ai-summary-fade'

describe('getAiSummaryFadeBackground', () => {
  it('builds a hex-aware gradient when background is a hex string', () => {
    const css = getAiSummaryFadeBackground({ colors: { background: '#fdf8f5' } })
    expect(css).toContain('linear-gradient')
    expect(css).toContain('#fdf8f5')
    expect(css).toContain('0%')
  })

  it('uses a simple fade when background is a non-hex string', () => {
    const css = getAiSummaryFadeBackground({ colors: { background: 'rgb(15, 23, 42)' } })
    expect(css).toContain('linear-gradient')
    expect(css).toContain('rgb(15, 23, 42)')
  })

  it('falls back when background is missing or not a string', () => {
    expect(getAiSummaryFadeBackground({ colors: {} })).toContain('253, 248, 245')
    expect(getAiSummaryFadeBackground(undefined)).toContain('253, 248, 245')
  })
})
