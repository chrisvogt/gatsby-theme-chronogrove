import React from 'react'
import { useThemeUI } from 'theme-ui'

import useSiteMetadata from '../hooks/use-site-metadata'

import { getTitle, getTitleTemplate, getTwitterUsername } from '../selectors/metadata'

/**
 * SEO
 *
 * Updates <head> tags.
 * @param {string} [canonicalPath] - Path (e.g. /travel/belize) for the canonical URL. When set, outputs <link rel="canonical"> so search engines treat this as the preferred URL (important after redirects).
 */
const Seo = ({ article, canonicalPath, children, description, image: imageURL, keywords, title: pageTitle }) => {
  const metadata = useSiteMetadata()
  const { theme } = useThemeUI()

  const siteTitle = getTitle(metadata)
  const titleTemplate = getTitleTemplate(metadata)
  const twitterUsername = getTwitterUsername(metadata)

  const title = titleTemplate ? titleTemplate.replace(/%s/g, pageTitle) : siteTitle
  const webmentionUrl = metadata.webmentionUrl
  const origin = metadata?.baseURL || metadata?.siteUrl || ''
  const canonicalUrl = canonicalPath ? `${origin.replace(/\/$/, '')}${canonicalPath}` : null

  return (
    <>
      <title>{title}</title>
      {canonicalUrl && <link rel='canonical' href={canonicalUrl} />}
      {description && <meta name='description' content={description} />}
      {imageURL && <meta name='image' content={imageURL} />}
      <meta name='theme-color' content={theme.colors.background} />
      <meta property='og:title' content={title} />
      {keywords && <meta name='keywords' content={keywords} />}
      {article && <meta property='og:type' content='article' />}
      {description && <meta property='og:description' content={description} />}
      {imageURL && <meta property='og:image' content={imageURL} />}
      <meta name='twitter:card' content='summary_large_image' />
      {twitterUsername && <meta name='twitter:creator' content={twitterUsername} />}
      <meta name='twitter:title' content={title} />
      {imageURL && <meta name='twitter:image' content={imageURL} />}
      {description && <meta name='twitter:description' content={description} />}
      {webmentionUrl && <link rel='webmention' href={webmentionUrl} />}
      {children}
    </>
  )
}

export default Seo
