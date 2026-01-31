/** @jsx jsx */
import { Container, Flex, jsx } from 'theme-ui'
import { Themed } from '@theme-ui/mdx'
import { graphql } from 'gatsby'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import Category from '../components/category'
import Layout from '../components/layout'
import PageHeader from '../components/blog/page-header'
import Seo from '../components/seo'
import { setSoundcloudTrack } from '../reducers/audioPlayer'

import YouTube from '../shortcodes/youtube'
import useSiteMetadata from '../hooks/use-site-metadata'

const getBanner = mdx => mdx.frontmatter.banner
const getDescription = mdx => mdx.frontmatter.description
const getTitle = mdx => mdx.frontmatter.title

const MediaTemplate = ({ data: { mdx }, children }) => {
  const dispatch = useDispatch()
  const category = mdx.fields.category
  const date = mdx.frontmatter.date
  const soundcloudId = mdx.frontmatter.soundcloudId
  const title = getTitle(mdx)
  const youtubeSrc = mdx.frontmatter.youtubeSrc
  const description = getDescription(mdx)
  const banner = getBanner(mdx)
  const keywords = mdx.frontmatter.keywords
  const path = mdx.fields.path
  const { siteUrl = '', baseURL = '' } = useSiteMetadata()

  // Build canonical URL from site metadata
  const canonicalUrl = `${baseURL || siteUrl || ''}${path}`

  // Set the SoundCloud track in Redux when this component mounts
  useEffect(() => {
    if (soundcloudId) {
      dispatch(setSoundcloudTrack(soundcloudId))
    }
  }, [soundcloudId, dispatch])

  return (
    <Layout>
      {youtubeSrc && (
        <Themed.div
          sx={{
            background: theme => theme.colors['panel-background'],
            textAlign: 'center',
            paddingY: 3,
            position: 'relative'
          }}
        >
          <Container>
            <YouTube url={youtubeSrc} />
          </Container>
        </Themed.div>
      )}

      <Flex
        sx={{
          flexDirection: 'column',
          flexGrow: 1,
          py: 3,
          position: 'relative'
        }}
      >
        <Container sx={{ width: ['', 'max(80ch, 50vw)'], lineHeight: 1.7 }}>
          <article className='h-entry' id={mdx.id}>
            {category && <Category type={category} sx={{ mb: 2 }} />}

            <PageHeader>{title}</PageHeader>

            <time className='dt-published created'>Published {date}</time>

            {/* Hidden microformats data */}
            <div style={{ display: 'none' }}>
              <a className='u-url' href={canonicalUrl} />
              <span className='u-uid'>{mdx.id}</span>
              {description && <div className='p-summary'>{description}</div>}
              {banner && <img className='u-photo' src={banner} alt='' />}
              {category && <span className='p-category'>{category}</span>}
              {keywords &&
                keywords.map((keyword, index) => (
                  <span key={index} className='p-category'>
                    {keyword}
                  </span>
                ))}
            </div>

            <div className='e-content article-content'>{children}</div>
          </article>
        </Container>
      </Flex>
    </Layout>
  )
}

export const Head = ({ data: { mdx } }) => {
  const banner = getBanner(mdx)
  const description = getDescription(mdx)
  const title = getTitle(mdx)
  const category = mdx.fields.category

  // Format category for display (capitalize first letter)
  const categoryDisplay = category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Music'

  // Breadcrumb structured data for SEO
  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.chrisvogt.me'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: categoryDisplay,
        item: `https://www.chrisvogt.me/${category || 'music'}`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: title
      }
    ]
  }

  return (
    <Seo article={true} description={description} image={banner} title={title}>
      <script type='application/ld+json'>{JSON.stringify(breadcrumbData)}</script>
    </Seo>
  )
}

export const pageQuery = graphql`
  query ($id: String!) {
    mdx(fields: { id: { eq: $id } }) {
      body
      id
      fields {
        category
        path
      }
      frontmatter {
        banner
        date(formatString: "MMMM DD, YYYY")
        description
        keywords
        title
        type
        soundcloudId
        youtubeSrc
      }
    }
  }
`

export default MediaTemplate
