import { resolveChronogroveSurfaceColors } from './resolve-theme-colors.js'

describe('resolveChronogroveSurfaceColors', () => {
  it('reads string colors from Theme UI-shaped theme', () => {
    const theme = {
      colors: {
        background: '#fdf8f5',
        text: '#111',
        textMuted: '#333',
        modes: {
          dark: {
            background: '#14141F',
            text: '#fff',
            textMuted: '#d8d8d8'
          }
        }
      }
    }
    expect(resolveChronogroveSurfaceColors(theme)).toEqual({
      defaultBackgroundHex: '#fdf8f5',
      darkBackgroundHex: '#14141F',
      defaultTextHex: '#111',
      defaultTextMutedHex: '#333',
      darkTextHex: '#fff',
      darkTextMutedHex: '#d8d8d8'
    })
  })

  it('uses fallbacks when theme is empty', () => {
    expect(resolveChronogroveSurfaceColors(null)).toEqual({
      defaultBackgroundHex: '#fdf8f5',
      darkBackgroundHex: '#14141F',
      defaultTextHex: '#111',
      defaultTextMutedHex: '#333',
      darkTextHex: '#fff',
      darkTextMutedHex: '#d8d8d8'
    })
  })
})
