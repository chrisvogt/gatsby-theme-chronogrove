import React from 'react'
import { useSiteMetadata } from '../hooks/use-site-metadata'
import Seo from '../components/seo'

export default function BlogHead() {
  const { title, description, siteUrl } = useSiteMetadata()

  return (
    <Seo title={`Blog - ${title}`} description={description}>
      <meta property='og:url' content={`${siteUrl}/blog/`} />
      <meta property='og:type' content='website' />
    </Seo>
  )
}
