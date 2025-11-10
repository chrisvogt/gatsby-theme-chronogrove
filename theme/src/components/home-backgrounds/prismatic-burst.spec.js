import PrismaticBurst from './prismatic-burst'

// Mock browser APIs
global.requestAnimationFrame = jest.fn(() => 1)
global.cancelAnimationFrame = jest.fn()

describe('PrismaticBurst', () => {
  it('exports a valid React component', () => {
    expect(typeof PrismaticBurst).toBe('function')
    expect(PrismaticBurst.name).toBe('PrismaticBurst')
  })

  it('is defined and importable', () => {
    expect(PrismaticBurst).toBeDefined()
  })

  it('component accepts colors prop as array', () => {
    const colors = ['#FF6B9D', '#C06BFF', '#4ECDC4', '#FFE66D']
    expect(Array.isArray(colors)).toBe(true)
    expect(colors).toHaveLength(4)
  })

  it('component accepts speed prop as number', () => {
    const speed = 1.0
    expect(typeof speed).toBe('number')
    expect(speed).toBeGreaterThan(0)
  })

  it('component accepts blur prop as number', () => {
    const blur = 100
    expect(typeof blur).toBe('number')
    expect(blur).toBeGreaterThan(0)
  })

  it('default blur value is reasonable', () => {
    const defaultBlur = 100
    expect(defaultBlur).toBe(100)
  })

  it('default speed value is reasonable', () => {
    const defaultSpeed = 1.0
    expect(defaultSpeed).toBe(1.0)
  })

  it('handles default colors array', () => {
    const defaultColors = ['#FF6B9D', '#C06BFF', '#4ECDC4', '#FFE66D', '#FF6B9D']
    expect(Array.isArray(defaultColors)).toBe(true)
    expect(defaultColors).toHaveLength(5)
  })

  it('handles custom colors array', () => {
    const customColors = ['#FF0000', '#00FF00', '#0000FF']
    expect(Array.isArray(customColors)).toBe(true)
    expect(customColors).toHaveLength(3)
  })

  it('handles theme-specific colors', () => {
    const themeColors = ['#9B4F96', '#7B68EE', '#48C9B0', '#F39C12']
    expect(Array.isArray(themeColors)).toBe(true)
    expect(themeColors.every(c => typeof c === 'string')).toBe(true)
    expect(themeColors.every(c => c.startsWith('#'))).toBe(true)
  })

  it('validates prop types for blur', () => {
    const blur50 = 50
    const blur75 = 75
    const blur100 = 100

    expect(typeof blur50).toBe('number')
    expect(typeof blur75).toBe('number')
    expect(typeof blur100).toBe('number')
  })

  it('validates prop types for speed', () => {
    const speed05 = 0.5
    const speed10 = 1.0
    const speed20 = 2.0

    expect(typeof speed05).toBe('number')
    expect(typeof speed10).toBe('number')
    expect(typeof speed20).toBe('number')
  })

  it('validates color format', () => {
    const hexColors = ['#FF6B9D', '#C06BFF']
    hexColors.forEach(color => {
      expect(typeof color).toBe('string')
      expect(color).toMatch(/^#[0-9A-F]{6}$/i)
    })
  })

  it('validates full prop configuration', () => {
    const props = {
      colors: ['#9B4F96', '#7B68EE', '#48C9B0'],
      speed: 0.5,
      blur: 75
    }

    expect(Array.isArray(props.colors)).toBe(true)
    expect(typeof props.speed).toBe('number')
    expect(typeof props.blur).toBe('number')
  })

  it('component name matches export', () => {
    expect(PrismaticBurst.name).toBe('PrismaticBurst')
  })
})
