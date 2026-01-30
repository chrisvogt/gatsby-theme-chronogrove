import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import PostCard from './post-card'

describe('PostCard', () => {
  const baseProps = {
    banner: 'https://cdn.example.com/images/article-og-banner.jpg',
    category: 'personal',
    date: '1592202624',
    link: '/blog/article',
    title: 'My Blog Post'
  }

  it('matches the snapshot without excerpt', () => {
    const { asFragment } = render(<PostCard {...baseProps} />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders excerpt when provided', () => {
    const propsWithExcerpt = {
      ...baseProps,
      excerpt: 'This is a sample excerpt for the blog post.'
    }
    const { asFragment } = render(<PostCard {...propsWithExcerpt} />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('does not render excerpt when explicitly null', () => {
    const propsWithNullExcerpt = {
      ...baseProps,
      excerpt: null
    }
    const { asFragment } = render(<PostCard {...propsWithNullExcerpt} />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('does not render excerpt when explicitly undefined', () => {
    const propsWithUndefinedExcerpt = {
      ...baseProps,
      excerpt: undefined
    }
    const { asFragment } = render(<PostCard {...propsWithUndefinedExcerpt} />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders without banner when not provided', () => {
    const propsWithoutBanner = {
      category: 'personal',
      date: '1592202624',
      link: '/blog/article',
      title: 'My Blog Post'
    }
    const { asFragment } = render(<PostCard {...propsWithoutBanner} />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders without category when not provided', () => {
    const propsWithoutCategory = {
      banner: 'https://cdn.example.com/images/article-og-banner.jpg',
      date: '1592202624',
      link: '/blog/article',
      title: 'My Blog Post'
    }
    const { asFragment } = render(<PostCard {...propsWithoutCategory} />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('specifically tests excerpt prop handling for blog page change', () => {
    // This test specifically addresses the user's change where excerpt was commented out
    const propsWithoutExcerpt = {
      ...baseProps
      // excerpt is intentionally not included, simulating the commented out line
    }

    const { container, asFragment } = render(<PostCard {...propsWithoutExcerpt} />)

    // Verify that no excerpt paragraph is rendered (check for description class)
    const excerptParagraph = container.querySelector('p.description, [class*="description"]')
    expect(excerptParagraph).not.toBeInTheDocument()

    // Verify that the component still renders correctly without excerpt
    expect(asFragment()).toBeTruthy()
  })

  it('renders in horizontal layout when horizontal prop is true', () => {
    const propsWithHorizontal = {
      ...baseProps,
      horizontal: true
    }
    const { asFragment } = render(<PostCard {...propsWithHorizontal} />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders as image-only recap when isRecap prop is true', () => {
    const propsWithRecap = {
      ...baseProps,
      isRecap: true
    }
    const { asFragment } = render(<PostCard {...propsWithRecap} />)
    expect(asFragment()).toMatchSnapshot()
  })
})
