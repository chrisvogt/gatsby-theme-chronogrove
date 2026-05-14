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
  it('returns navigation data from site metadata with normalized footer', () => {
    useStaticQuery.mockImplementation(() => data)
    const { result } = renderHook(() => useNavigationData())
    expect(result.current).toEqual({
      header: {
        left: data.site.siteMetadata.navigation.header.left,
        home: data.site.siteMetadata.navigation.header.home
      },
      footer: []
    })
  })

  it('returns footer items when present', () => {
    const footer = [
      {
        path: '/rss.xml',
        slug: 'rss',
        text: 'RSS',
        title: 'RSS'
      }
    ]
    useStaticQuery.mockImplementation(() => ({
      site: {
        siteMetadata: {
          navigation: {
            ...data.site.siteMetadata.navigation,
            footer
          }
        }
      }
    }))
    const { result } = renderHook(() => useNavigationData())
    expect(result.current.footer).toEqual(footer)
  })

  it('handles missing navigation data', () => {
    useStaticQuery.mockImplementation(() => ({ site: { siteMetadata: {} } }))
    const { result } = renderHook(() => useNavigationData())
    expect(result.current).toEqual({
      header: { left: [], home: [] },
      footer: []
    })
  })

  it('handles missing site metadata', () => {
    useStaticQuery.mockImplementation(() => ({ site: {} }))
    const { result } = renderHook(() => useNavigationData())
    expect(result.current).toEqual({
      header: { left: [], home: [] },
      footer: []
    })
  })

  it('handles missing site', () => {
    useStaticQuery.mockImplementation(() => ({}))
    const { result } = renderHook(() => useNavigationData())
    expect(result.current).toEqual({
      header: { left: [], home: [] },
      footer: []
    })
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
      },
      footer: []
    })
  })

  it('returns header when only footer is configured', () => {
    useStaticQuery.mockImplementation(() => ({
      site: {
        siteMetadata: {
          navigation: {
            footer: [
              {
                path: 'https://example.com',
                slug: 'ext',
                text: 'Example',
                title: 'Example'
              }
            ]
          }
        }
      }
    }))
    const { result } = renderHook(() => useNavigationData())
    expect(result.current).toEqual({
      header: { left: [], home: [] },
      footer: [
        {
          path: 'https://example.com',
          slug: 'ext',
          text: 'Example',
          title: 'Example'
        }
      ]
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
    expect(result.current.footer).toEqual([])
  })

  it('treats non-array footer as empty', () => {
    useStaticQuery.mockImplementation(() => ({
      site: {
        siteMetadata: {
          navigation: {
            header: data.site.siteMetadata.navigation.header,
            footer: null
          }
        }
      }
    }))
    const { result } = renderHook(() => useNavigationData())
    expect(result.current.footer).toEqual([])
  })
})
