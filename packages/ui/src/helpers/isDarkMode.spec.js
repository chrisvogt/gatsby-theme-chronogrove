import isDarkMode from './isDarkMode'

describe('isDarkMode', () => {
  it('is true only for dark', () => {
    expect(isDarkMode('dark')).toBe(true)
    expect(isDarkMode('default')).toBe(false)
    expect(isDarkMode(undefined)).toBe(false)
  })
})
