import React from 'react'
import Seo from '../../../../theme/src/components/seo'

export default function HomeHead() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://www.chrisvogt.me/#website',
        url: 'https://www.chrisvogt.me',
        name: 'Chris Vogt',
        description: 'Software Engineer in San Francisco blogging about code, photography and piano music.',
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
          'https://x.com/c1v0',
          'https://twitter.com/c1v0',
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
    <Seo
      title='Home'
      description="Explore Chris Vogt's digital garden. A Software Engineer in San Francisco, Chris shares his interest in photography, piano, and travel."
      keywords='Chris Vogt, Software Engineer in San Francisco, GoDaddy engineer blog, photography blog, piano recordings, travel blog, personal blog, digital garden'
    >
      <meta property='og:url' content='https://www.chrisvogt.me' />
      <meta property='og:type' content='website' />
      <script type='application/ld+json'>{JSON.stringify(structuredData)}</script>
    </Seo>
  )
}
