import { renderHook } from '@testing-library/react'
import { useStaticQuery } from 'gatsby'
import useSocialProfiles from './use-social-profiles'

const data = {
  site: {
    siteMetadata: {
      socialProfiles: [
        {
          href: 'https://twitter.com/c1v0',
          slug: 'twitter',
          displayName: 'Twitter',
          icon: {
            class: 'fab fa-twitter',
            name: 'twitter',
            reactIcon: 'faTwitter',
            set: 'fab'
          }
        }
      ]
    }
  }
}

jest.mock('gatsby')

describe('useSocialProfiles', () => {
  beforeEach(() => {
    useStaticQuery.mockImplementation(() => data)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('returns the expected number of profiles', () => {
    const { result } = renderHook(() => useSocialProfiles())
    expect(result.current).toHaveLength(1)
  })

  it('returns the social profiles from site metadata', () => {
    const { result } = renderHook(() => useSocialProfiles())
    expect(result.current[0]).toEqual(data.site.siteMetadata.socialProfiles[0])
  })

  it('handles missing site', () => {
    useStaticQuery.mockImplementation(() => ({}))
    const { result } = renderHook(() => useSocialProfiles())
    expect(result.current).toEqual([])
  })

  it('handles missing siteMetadata', () => {
    useStaticQuery.mockImplementation(() => ({ site: {} }))
    const { result } = renderHook(() => useSocialProfiles())
    expect(result.current).toEqual([])
  })

  it('handles missing socialProfiles', () => {
    useStaticQuery.mockImplementation(() => ({ site: { siteMetadata: {} } }))
    const { result } = renderHook(() => useSocialProfiles())
    expect(result.current).toEqual([])
  })

  it('handles empty socialProfiles array', () => {
    useStaticQuery.mockImplementation(() => ({ site: { siteMetadata: { socialProfiles: [] } } }))
    const { result } = renderHook(() => useSocialProfiles())
    expect(result.current).toEqual([])
  })
})
