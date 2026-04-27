import {
  getHeaderLeftItems,
  getFooterLinkItems,
  isExternalNavigationPath,
  isStaticOutputNavigationPath,
  shouldUseNativeNavigationLink
} from './navigation'

const navigation = {
  header: {
    left: [
      {
        path: '/about-me',
        slug: '/about-me',
        text: 'About Me',
        title: 'About Me'
      }
    ]
  },
  footer: [
    {
      path: '/rss.xml',
      slug: 'rss',
      text: 'RSS',
      title: 'RSS'
    }
  ]
}

describe('navigation selectors', () => {
  it('getHeaderLeftItems returns header left links', () => {
    const result = getHeaderLeftItems(navigation)
    expect(result).toEqual(navigation.header.left)
  })

  it('getFooterLinkItems returns footer links', () => {
    expect(getFooterLinkItems(navigation)).toEqual(navigation.footer)
  })

  it('getFooterLinkItems returns empty array when missing', () => {
    expect(getFooterLinkItems({})).toEqual([])
    expect(getFooterLinkItems({ header: { left: [] } })).toEqual([])
  })

  it('isExternalNavigationPath is true for http(s) URLs', () => {
    expect(isExternalNavigationPath('https://example.com/x')).toBe(true)
    expect(isExternalNavigationPath('http://example.com')).toBe(true)
  })

  it('isExternalNavigationPath is false for site-relative paths', () => {
    expect(isExternalNavigationPath('/rss.xml')).toBe(false)
    expect(isExternalNavigationPath('/privacy')).toBe(false)
  })

  it('isStaticOutputNavigationPath is true for common static output paths', () => {
    expect(isStaticOutputNavigationPath('/rss.xml')).toBe(true)
    expect(isStaticOutputNavigationPath('/feed.atom')).toBe(true)
    expect(isStaticOutputNavigationPath('/rss.xml?v=1')).toBe(true)
  })

  it('isStaticOutputNavigationPath is false for pages and external URLs', () => {
    expect(isStaticOutputNavigationPath('/privacy')).toBe(false)
    expect(isStaticOutputNavigationPath('https://example.com/feed.xml')).toBe(false)
  })

  it('shouldUseNativeNavigationLink is true for external, static output, or nativeAnchor', () => {
    expect(shouldUseNativeNavigationLink('https://x.com', {})).toBe(true)
    expect(shouldUseNativeNavigationLink('/rss.xml', {})).toBe(true)
    expect(shouldUseNativeNavigationLink('/odd-path', { nativeAnchor: true })).toBe(true)
    expect(shouldUseNativeNavigationLink('/privacy', {})).toBe(false)
  })
})
