import { getHeaderLeftItems, getFooterLinkItems, isExternalNavigationPath } from './navigation'

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
})
