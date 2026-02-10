import React from 'react'
import Seo from '../../../../theme/src/components/seo'

export default function HomeHead() {
  return (
    <Seo
      title='Home'
      description='Official demo site for gatsby-theme-chronogrove - A beautiful Gatsby theme for personal websites and blogs with social media widgets and modern design.'
      keywords='gatsby theme, personal website, blog theme, gatsby, react, chronogrove, theme ui, social media widgets'
    >
      <meta property='og:url' content='https://www.chronogrove.com' />
      <meta property='og:type' content='website' />
      <script type='application/ld+json'>
        {`{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Chronogrove",
          "applicationCategory": "WebApplication",
          "operatingSystem": "Web",
          "description": "A beautiful Gatsby theme for personal websites and blogs",
          "url": "https://www.chronogrove.com",
          "author": {
            "@type": "Person",
            "name": "Chris Vogt"
          },
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        }`}
      </script>
    </Seo>
  )
}
