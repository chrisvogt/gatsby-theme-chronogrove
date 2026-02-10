import getTimeSpent from './get-time-spent'

describe('getTimeSpent', () => {
  it('formats 5 minutes correctly', () => {
    const result = getTimeSpent(5 * 60 * 1000)
    expect(result).toBe('5 minutes')
  })

  it('formats 1 hour correctly', () => {
    const result = getTimeSpent(60 * 60 * 1000)
    expect(result).toBe('1 hour')
  })

  it('formats 2 hours correctly', () => {
    const result = getTimeSpent(2 * 60 * 60 * 1000)
    expect(result).toBe('2 hours')
  })

  it('formats 1 hour and 30 minutes correctly', () => {
    const result = getTimeSpent(90 * 60 * 1000)
    expect(result).toBe('1 hour, 30 minutes')
  })

  it('formats 757 hours and 21 minutes correctly', () => {
    const result = getTimeSpent(757 * 60 * 60 * 1000 + 21 * 60 * 1000)
    expect(result).toBe('757 hours, 21 minutes')
  })

  it('formats 0 milliseconds as 0 minutes', () => {
    const result = getTimeSpent(0)
    expect(result).toBe('0 minutes')
  })

  it('formats 30 seconds correctly', () => {
    const result = getTimeSpent(30 * 1000)
    expect(result).toBe('1 minute')
  })

  it('formats 1 minute correctly', () => {
    const result = getTimeSpent(60 * 1000)
    expect(result).toBe('1 minute')
  })
})
