import isDarkMode from './is-dark-mode'

describe('isDarkMode', () => {
  it('is true only for dark', () => {
    expect(isDarkMode('dark')).toBe(true)
    expect(isDarkMode('default')).toBe(false)
    expect(isDarkMode(undefined)).toBe(false)
  })
})
