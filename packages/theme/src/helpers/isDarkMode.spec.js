import isDarkMode from './isDarkMode'

describe('isDarkMode', () => {
  it('returns true when the color mode is dark', () => {
    const result = isDarkMode('dark')
    expect(result).toBeTruthy()
  })
  it('returns false when the color mode is not dark', () => {
    const result = isDarkMode('light')
    expect(result).toBeFalsy()
  })
})
