import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useStaticQuery } from 'gatsby'

import Post, { Head } from './post'
import * as useSiteMetadataModule from '../hooks/use-site-metadata'

const data = {
  mdx: {
    id: 'mock-post-id',
    fields: {
      category: 'Mock Category',
      path: '/blog/mock-post'
    },
    frontmatter: {
      date: 'Mon, 17 Jun 2024 03:30:26 GMT',
      title: 'A Mock Blog Post',
      description: 'This is a mock description',
      banner: 'mock-banner.jpg',
      keywords: ['mock', 'test', 'blog']
    }
  }
}

jest.mock('gatsby')
jest.mock('../components/layout', () => {
  return ({ children }) => <div className='layoutMock'>{children}</div>
})

jest.mock('../components/seo', () => {
  return ({ children }) => <div className='seoMock'>{children}</div>
})

const BlogPostContent = <div>Lorum ipsum dolor sit amet.</div>

describe('Blog Post', () => {
  beforeEach(() => {
    useStaticQuery.mockImplementation(() => data)
    jest
      .spyOn(useSiteMetadataModule, 'default')
      .mockReturnValue({ siteUrl: 'https://example.com', baseURL: 'https://example.com' })
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  it('matches the snapshot', () => {
    const { asFragment } = render(<Post data={data}>{BlogPostContent}</Post>)
    expect(asFragment()).toMatchSnapshot()
  })

  it('does not render category when not provided', () => {
    const noCategoryData = {
      ...data,
      mdx: {
        ...data.mdx,
        fields: {
          ...data.mdx.fields,
          category: null
        }
      }
    }
    const { asFragment } = render(<Post data={noCategoryData}>{BlogPostContent}</Post>)
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders Seo component with the correct props', () => {
    const { asFragment } = render(<Head data={data} />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders breadcrumb structured data', () => {
    const { container } = render(<Head data={data} />)
    const script = container.querySelector('script[type="application/ld+json"]')

    expect(script).toBeInTheDocument()
    const breadcrumbData = JSON.parse(script.textContent)

    expect(breadcrumbData['@context']).toBe('https://schema.org')
    expect(breadcrumbData['@type']).toBe('BreadcrumbList')
    expect(breadcrumbData.itemListElement).toHaveLength(3)

    // Check Home breadcrumb
    expect(breadcrumbData.itemListElement[0].name).toBe('Home')
    expect(breadcrumbData.itemListElement[0].position).toBe(1)

    // Check Category breadcrumb
    expect(breadcrumbData.itemListElement[1].name).toBe('Mock Category')
    expect(breadcrumbData.itemListElement[1].position).toBe(2)

    // Check Post title breadcrumb
    expect(breadcrumbData.itemListElement[2].name).toBe('A Mock Blog Post')
    expect(breadcrumbData.itemListElement[2].position).toBe(3)
  })
})
