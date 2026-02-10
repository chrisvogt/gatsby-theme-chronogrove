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
})
