import {
  getAvatarURL,
  getBaseURL,
  getDescription,
  getGithubUsername,
  getGithubWidgetDataSource,
  getGoodreadsUsername,
  getGoodreadsWidgetDataSource,
  getHeadline,
  getImageURL,
  getInstagramUsername,
  getLanguageCode,
  getSubhead,
  getTitle,
  getTitleTemplate,
  getTwitterUsername
} from './metadata'

const metadata = {
  avatarURL: 'https://cdn.fake-site.com/images/avatar.jpg',
  baseURL: 'https://www.fake-site.com/blog',
  description: 'Personal blog for web developer and creative.',
  headline: 'My Site Headline',
  imageURL: 'https://cdn.fake-site.com/images/og-banner.jpg',
  languageCode: 'en',
  social: {
    twitterUsername: '@c1v0'
  },
  subhead: 'Just another GatsbyJS blog',
  title: 'My Cool Website',
  titleTemplate: '%s | My Cool Website',
  widgets: {
    github: {
      username: 'themeuser',
      widgetDataSource: 'https://api.example.com/api/widget-content?widget=github'
    },
    goodreads: {
      username: 'themeuser',
      widgetDataSource: 'https://api.example.com/api/widget-content?widget=goodreads'
    },
    instagram: {
      username: 'themeuser',
      widgetDataSource: 'https://api.example.com/api/widget-content?widget=instagram'
    },
    spotify: {
      widgetDataSource: 'https://api.example.com/api/widget-content?widget=spotify'
    }
  }
}

describe('Metadata Selectors', () => {
  it('selects the avatar URL', () => {
    const result = getAvatarURL(metadata)
    expect(result).toEqual(metadata.avatarURL)
  })

  it('selects the site base URL', () => {
    const result = getBaseURL(metadata)
    expect(result).toEqual(metadata.baseURL)
  })

  it('selects the site open graph description', () => {
    const result = getDescription(metadata)
    expect(result).toEqual(metadata.description)
  })

  it('selects the github username', () => {
    const result = getGithubUsername(metadata)
    expect(result).toEqual(metadata.widgets.github.username)
  })

  it('selects the github widget data source', () => {
    const result = getGithubWidgetDataSource(metadata)
    expect(result).toEqual(metadata.widgets.github.widgetDataSource)
  })

  it('selects the goodreads username', () => {
    const result = getGoodreadsUsername(metadata)
    expect(result).toEqual(metadata.widgets.goodreads.username)
  })

  it('selects the goodreads widget data source', () => {
    const result = getGoodreadsWidgetDataSource(metadata)
    expect(result).toEqual(metadata.widgets.goodreads.widgetDataSource)
  })

  it('selects the twitter username', () => {
    const result = getTwitterUsername(metadata)
    expect(result).toEqual(metadata.widgets.twitterUsername)
  })

  it('selects the home page headline text', () => {
    const result = getHeadline(metadata)
    expect(result).toEqual(metadata.headline)
  })

  it('selects the home page subheadline text', () => {
    const result = getSubhead(metadata)
    expect(result).toEqual(metadata.subhead)
  })

  it('selects the open graph banner URL', () => {
    const result = getImageURL(metadata)
    expect(result).toEqual(metadata.imageURL)
  })

  it('selects the instagram username', () => {
    const result = getInstagramUsername(metadata)
    expect(result).toEqual(metadata.widgets.instagram.username)
  })

  it('selects the language code for the site', () => {
    const result = getLanguageCode(metadata)
    expect(result).toEqual(metadata.languageCode)
  })

  it('selects the default site document title', () => {
    const result = getTitle(metadata)
    expect(result).toEqual(metadata.title)
  })

  it('selects the site doc title template', () => {
    const result = getTitleTemplate(metadata)
    expect(result).toEqual(metadata.titleTemplate)
  })
})
