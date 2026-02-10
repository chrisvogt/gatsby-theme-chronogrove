import React from 'react'
import Seo from '../../../../theme/src/components/seo'

export default function BlogHead() {
  return (
    <Seo
      title='Blog - Latest Posts'
      description='Read the latest blog posts and insights from the blog. Explore articles on technology, photography, music, and personal growth on chrisvogt.me.'
    >
      <meta property='og:url' content='https://www.chrisvogt.me/blog/' />
      <meta property='og:type' content='website' />
    </Seo>
  )
}
