import { isHostnameUnderRegistrableDomain, validateRegistrableDomain } from './registrable-domain.js'

describe('validateRegistrableDomain', () => {
  it('normalizes and rejects unsafe values', () => {
    expect(validateRegistrableDomain(' Example.COM ')).toBe('example.com')
    expect(validateRegistrableDomain('')).toBe(null)
    expect(validateRegistrableDomain('a..b')).toBe(null)
    expect(validateRegistrableDomain('bad;path')).toBe(null)
  })
})

describe('isHostnameUnderRegistrableDomain', () => {
  it('matches apex and subdomains', () => {
    expect(isHostnameUnderRegistrableDomain('www.example.com', 'example.com')).toBe(true)
    expect(isHostnameUnderRegistrableDomain('example.com', 'example.com')).toBe(true)
  })

  it('rejects hosts outside the registrable domain', () => {
    expect(isHostnameUnderRegistrableDomain('notexample.com', 'example.com')).toBe(false)
    expect(isHostnameUnderRegistrableDomain('localhost', 'example.com')).toBe(false)
  })

  it('rejects invalid inputs', () => {
    expect(isHostnameUnderRegistrableDomain('', 'example.com')).toBe(false)
    expect(isHostnameUnderRegistrableDomain('www.example.com', '')).toBe(false)
    expect(isHostnameUnderRegistrableDomain('www.example.com', 'bad..')).toBe(false)
  })
})
