import React from 'react'
import Seo from '../../../../theme/src/components/seo'

const HOME_META_DESCRIPTION =
  'Principal software engineer in San Francisco (GoDaddy). Long-form writing on code, travel, and piano; home-page tiles sync daily from my own Firebase-backed API.'
const HOME_KEYWORDS =
  'Chris Vogt, principal software engineer, San Francisco, GoDaddy, software blog, piano, travel photography, personal website'

export default function HomeHead() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://www.chrisvogt.me/#website',
        url: 'https://www.chrisvogt.me',
        name: 'Chris Vogt',
        description: HOME_META_DESCRIPTION,
        publisher: {
          '@id': 'https://www.chrisvogt.me/#person'
        },
        inLanguage: 'en-US'
      },
      {
        '@type': 'Person',
        '@id': 'https://www.chrisvogt.me/#person',
        name: 'Chris Vogt',
        url: 'https://www.chrisvogt.me',
        image: {
          '@type': 'ImageObject',
          url: 'https://www.chrisvogt.me/images/avatar-256px.jpg'
        },
        sameAs: [
          'https://linkedin.com/in/cjvogt',
          'https://github.com/chrisvogt',
          'https://www.instagram.com/c1v0',
          'https://stackoverflow.com/users/1391826/chris-vogt',
          'https://bsky.app/profile/chrisvogt.me',
          'https://hachyderm.io/@chrisvogt'
        ],
        jobTitle: 'Principal Software Engineer',
        worksFor: {
          '@type': 'Organization',
          name: 'GoDaddy'
        }
      }
    ]
  }

  return (
    <Seo canonicalPath='/' title='Home' description={HOME_META_DESCRIPTION} keywords={HOME_KEYWORDS}>
      <meta property='og:url' content='https://www.chrisvogt.me' />
      <meta property='og:type' content='website' />
      <script type='application/ld+json'>{JSON.stringify(structuredData)}</script>
    </Seo>
  )
}
