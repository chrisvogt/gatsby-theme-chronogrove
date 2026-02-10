import React from 'react'
import Seo from '../../../../theme/src/components/seo'

export default function BlogHead() {
  return (
    <Seo
      title='Blog - Chronogrove'
      description='Latest blog posts and articles from Chronogrove. Discover insights on technology, development, and more.'
    >
      <meta property='og:url' content='https://www.chronogrove.com/blog/' />
      <meta property='og:type' content='website' />
    </Seo>
  )
}
