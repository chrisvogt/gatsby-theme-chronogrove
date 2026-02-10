import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import Seo from '../components/seo'

export default function HomeHead() {
  const data = useStaticQuery(graphql`
    query HomeHeadQuery {
      site {
        siteMetadata {
          description
          siteUrl
          baseURL
          social {
            twitterUsername
          }
          hCard {
            givenName
            category
          }
        }
      }
    }
  `)

  const {
    description = 'A personal website and digital garden built with Gatsby.',
    siteUrl = '',
    baseURL = '',
    social = {},
    hCard = {}
  } = data.site.siteMetadata

  const url = baseURL || siteUrl
  const personName = hCard?.givenName || 'Person'
  const twitterUsername = social?.twitterUsername

  // Generate basic structured data for person/organization
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': hCard?.category === 'Organization' ? 'Organization' : 'Person',
    name: personName,
    url: url
  }

  // Add Twitter/X profile if available
  if (twitterUsername) {
    structuredData.sameAs = [`https://twitter.com/${twitterUsername}`, `https://x.com/${twitterUsername}`]
  }

  return (
    <Seo title='Home' description={description}>
      {url && <meta property='og:url' content={url} />}
      <meta property='og:type' content='website' />
      <script type='application/ld+json'>{JSON.stringify(structuredData)}</script>
    </Seo>
  )
}
