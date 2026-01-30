import { renderHook } from '@testing-library/react'
import { useStaticQuery } from 'gatsby'
import useSiteMetadata from './use-site-metadata'

const data = {
  site: {
    siteMetadata: {
      baseURL: 'https://www.fake-site.com',
      description: 'A fake website for unit tests!',
      footerText: '© 2025',
      headline: 'My New Website',
      subhead: 'A place for my stuff on the web'
    }
  }
}

jest.mock('gatsby')

describe('useSiteMetadata', () => {
  beforeEach(() => {
    useStaticQuery.mockImplementation(() => data)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('returns the site metadata', () => {
    const { result } = renderHook(() => useSiteMetadata())
    expect(result.current).toEqual(data.site.siteMetadata)
  })

  it('handles missing site', () => {
    useStaticQuery.mockImplementation(() => ({}))
    const { result } = renderHook(() => useSiteMetadata())
    expect(result.current).toBeUndefined()
  })

  it('handles missing siteMetadata', () => {
    useStaticQuery.mockImplementation(() => ({ site: {} }))
    const { result } = renderHook(() => useSiteMetadata())
    expect(result.current).toBeUndefined()
  })
})
