import { renderHook } from '@testing-library/react'
import { useStaticQuery } from 'gatsby'
import useNavigationData from './use-navigation-data'

const data = {
  site: {
    siteMetadata: {
      navigation: {
        header: {
          left: [
            {
              path: '/about',
              slug: 'about',
              text: 'About',
              title: 'About Me'
            },
            {
              path: '/blog',
              slug: 'blog',
              text: 'Blog',
              title: 'Latest posts from the blog'
            }
          ],
          home: [
            {
              path: '#github',
              slug: 'github',
              text: 'GitHub',
              title: 'GitHub'
            }
          ]
        }
      }
    }
  }
}

jest.mock('gatsby')

describe('useNavigationData', () => {
  it('returns navigation data from site metadata', () => {
    useStaticQuery.mockImplementation(() => data)
    const { result } = renderHook(() => useNavigationData())
    expect(result.current).toEqual(data.site.siteMetadata.navigation)
  })

  it('handles missing navigation data', () => {
    useStaticQuery.mockImplementation(() => ({ site: { siteMetadata: {} } }))
    const { result } = renderHook(() => useNavigationData())
    expect(result.current).toEqual({})
  })

  it('handles missing site metadata', () => {
    useStaticQuery.mockImplementation(() => ({ site: {} }))
    const { result } = renderHook(() => useNavigationData())
    expect(result.current).toEqual({})
  })

  it('handles missing site', () => {
    useStaticQuery.mockImplementation(() => ({}))
    const { result } = renderHook(() => useNavigationData())
    expect(result.current).toEqual({})
  })

  it('returns empty arrays when header.left or header.home are missing', () => {
    useStaticQuery.mockImplementation(() => ({
      site: {
        siteMetadata: {
          navigation: {
            header: {}
          }
        }
      }
    }))
    const { result } = renderHook(() => useNavigationData())
    expect(result.current).toEqual({
      header: {
        left: [],
        home: []
      }
    })
  })

  it('returns empty array for header.home when only header.left is present', () => {
    useStaticQuery.mockImplementation(() => ({
      site: {
        siteMetadata: {
          navigation: {
            header: {
              left: [{ path: '/about', slug: 'about', text: 'About', title: 'About' }]
            }
          }
        }
      }
    }))
    const { result } = renderHook(() => useNavigationData())
    expect(result.current.header.left).toHaveLength(1)
    expect(result.current.header.home).toEqual([])
  })
})
