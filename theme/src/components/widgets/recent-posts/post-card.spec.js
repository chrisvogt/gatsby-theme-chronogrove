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

  it('renders thumbnails instead of banner when thumbnails are provided (vertical mode)', () => {
    const propsWithThumbnails = {
      ...baseProps,
      thumbnails: [
        'https://example.com/thumb1.jpg',
        'https://example.com/thumb2.jpg',
        'https://example.com/thumb3.jpg',
        'https://example.com/thumb4.jpg'
      ]
    }
    const { container, asFragment } = render(<PostCard {...propsWithThumbnails} />)

    // Should render thumbnails container
    expect(container.querySelector('.card-thumbnails')).toBeInTheDocument()

    // Should not render banner
    expect(container.querySelector('.card-media')).not.toBeInTheDocument()

    expect(asFragment()).toMatchSnapshot()
  })

  it('renders thumbnails inside text area when horizontal mode with thumbnails', () => {
    const propsWithThumbnailsHorizontal = {
      ...baseProps,
      horizontal: true,
      thumbnails: ['https://example.com/thumb1.jpg', 'https://example.com/thumb2.jpg', 'https://example.com/thumb3.jpg']
    }
    const { container, asFragment } = render(<PostCard {...propsWithThumbnailsHorizontal} />)

    // Should render thumbnails container
    expect(container.querySelector('.card-thumbnails')).toBeInTheDocument()

    // Should not render banner
    expect(container.querySelector('.card-media')).not.toBeInTheDocument()

    expect(asFragment()).toMatchSnapshot()
  })

  it('renders banner when thumbnails array is empty', () => {
    const propsWithEmptyThumbnails = {
      ...baseProps,
      thumbnails: []
    }
    const { container, asFragment } = render(<PostCard {...propsWithEmptyThumbnails} />)

    // Should render banner since thumbnails is empty
    expect(container.querySelector('.card-media')).toBeInTheDocument()

    // Should not render thumbnails
    expect(container.querySelector('.card-thumbnails')).not.toBeInTheDocument()

    expect(asFragment()).toMatchSnapshot()
  })

  it('renders banner when thumbnails is null', () => {
    const propsWithNullThumbnails = {
      ...baseProps,
      thumbnails: null
    }
    const { container, asFragment } = render(<PostCard {...propsWithNullThumbnails} />)

    // Should render banner since thumbnails is null
    expect(container.querySelector('.card-media')).toBeInTheDocument()

    // Should not render thumbnails
    expect(container.querySelector('.card-thumbnails')).not.toBeInTheDocument()

    expect(asFragment()).toMatchSnapshot()
  })

  it('renders neither banner nor thumbnails when both are missing', () => {
    const propsWithoutMedia = {
      category: 'personal',
      date: '1592202624',
      link: '/blog/article',
      title: 'My Blog Post'
    }
    const { container, asFragment } = render(<PostCard {...propsWithoutMedia} />)

    // Should not render banner or thumbnails
    expect(container.querySelector('.card-media')).not.toBeInTheDocument()
    expect(container.querySelector('.card-thumbnails')).not.toBeInTheDocument()

    expect(asFragment()).toMatchSnapshot()
  })

  it('renders YouTube embed when youtubeSrc is provided', () => {
    const propsWithYouTube = {
      category: 'music',
      date: '2025-06-19',
      link: '/music/here-and-now',
      title: 'Here and Now',
      youtubeSrc: 'https://www.youtube.com/embed/OMiKQ2XHXYU'
    }
    const { container, asFragment } = render(<PostCard {...propsWithYouTube} />)

    // Should render YouTube embed
    expect(container.querySelector('.card-youtube')).toBeInTheDocument()
    expect(container.querySelector('iframe')).toBeInTheDocument()

    // Should not render excerpt
    expect(container.querySelector('.description')).not.toBeInTheDocument()

    // Title should be wrapped in a link
    expect(container.querySelector('a h3')).toBeInTheDocument()

    expect(asFragment()).toMatchSnapshot()
  })

  it('renders YouTube embed instead of excerpt when both are provided', () => {
    const propsWithBoth = {
      category: 'music',
      date: '2025-06-19',
      link: '/music/here-and-now',
      title: 'Here and Now',
      excerpt: 'This excerpt should not be shown',
      youtubeSrc: 'https://www.youtube.com/embed/OMiKQ2XHXYU'
    }
    const { container } = render(<PostCard {...propsWithBoth} />)

    // Should render YouTube embed
    expect(container.querySelector('.card-youtube')).toBeInTheDocument()

    // Should not render excerpt
    expect(container.querySelector('.description')).not.toBeInTheDocument()
  })

  it('does not wrap card in link when YouTube is present', () => {
    const propsWithYouTube = {
      category: 'music',
      date: '2025-06-19',
      link: '/music/here-and-now',
      title: 'Here and Now',
      youtubeSrc: 'https://www.youtube.com/embed/OMiKQ2XHXYU'
    }
    const { container } = render(<PostCard {...propsWithYouTube} />)

    // The outer element should be a div, not an anchor
    const outerElement = container.firstChild
    expect(outerElement.tagName).toBe('DIV')

    // But the title should still be linked
    expect(container.querySelector('a')).toBeInTheDocument()
  })
})
