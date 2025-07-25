import React from 'react'
import renderer from 'react-test-renderer'
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
    const tree = renderer.create(<Post data={data}>{BlogPostContent}</Post>).toJSON()
    expect(tree).toMatchSnapshot()
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
    const tree = renderer.create(<Post data={noCategoryData}>{BlogPostContent}</Post>).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders Seo component with the correct props', () => {
    const seoTree = renderer.create(<Head data={data} />).toJSON()
    expect(seoTree).toMatchSnapshot()
  })
})
