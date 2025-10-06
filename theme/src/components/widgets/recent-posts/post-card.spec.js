import React from 'react'
import renderer from 'react-test-renderer'
import { render, screen, fireEvent } from '@testing-library/react'
import PostCard from './post-card'

// Mock window.scrollTo
const mockScrollTo = jest.fn()
Object.defineProperty(window, 'scrollTo', {
  value: mockScrollTo,
  writable: true
})

// Mock Gatsby navigation
const mockNavigate = jest.fn()
Object.defineProperty(window, '___navigate', {
  value: mockNavigate,
  writable: true
})

describe('PostCard', () => {
  const baseProps = {
    banner: 'https://cdn.example.com/images/article-og-banner.jpg',
    category: 'personal',
    date: '1592202624',
    link: '/blog/article',
    title: 'My Blog Post'
  }

  it('matches the snapshot without excerpt', () => {
    const tree = renderer.create(<PostCard {...baseProps} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders excerpt when provided', () => {
    const propsWithExcerpt = {
      ...baseProps,
      excerpt: 'This is a sample excerpt for the blog post.'
    }
    const tree = renderer.create(<PostCard {...propsWithExcerpt} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('does not render excerpt when explicitly null', () => {
    const propsWithNullExcerpt = {
      ...baseProps,
      excerpt: null
    }
    const tree = renderer.create(<PostCard {...propsWithNullExcerpt} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('does not render excerpt when explicitly undefined', () => {
    const propsWithUndefinedExcerpt = {
      ...baseProps,
      excerpt: undefined
    }
    const tree = renderer.create(<PostCard {...propsWithUndefinedExcerpt} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders without banner when not provided', () => {
    const propsWithoutBanner = {
      category: 'personal',
      date: '1592202624',
      link: '/blog/article',
      title: 'My Blog Post'
    }
    const tree = renderer.create(<PostCard {...propsWithoutBanner} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders without category when not provided', () => {
    const propsWithoutCategory = {
      banner: 'https://cdn.example.com/images/article-og-banner.jpg',
      date: '1592202624',
      link: '/blog/article',
      title: 'My Blog Post'
    }
    const tree = renderer.create(<PostCard {...propsWithoutCategory} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('specifically tests excerpt prop handling for blog page change', () => {
    // This test specifically addresses the user's change where excerpt was commented out
    const propsWithoutExcerpt = {
      ...baseProps
      // excerpt is intentionally not included, simulating the commented out line
    }

    const component = renderer.create(<PostCard {...propsWithoutExcerpt} />)
    const tree = component.toJSON()

    // Verify that no excerpt paragraph is rendered
    const excerptParagraph = findExcerptParagraph(tree)
    expect(excerptParagraph).toBeNull()

    // Verify that the component still renders correctly without excerpt
    expect(tree).toBeTruthy()
  })

  it('renders in horizontal layout when horizontal prop is true', () => {
    const propsWithHorizontal = {
      ...baseProps,
      horizontal: true
    }
    const tree = renderer.create(<PostCard {...propsWithHorizontal} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders as image-only recap when isRecap prop is true', () => {
    const propsWithRecap = {
      ...baseProps,
      isRecap: true
    }
    const tree = renderer.create(<PostCard {...propsWithRecap} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('calls window.scrollTo when clicked', () => {
    mockScrollTo.mockClear()
    mockNavigate.mockClear()

    render(<PostCard {...baseProps} />)
    const link = screen.getByRole('link')

    fireEvent.click(link)

    expect(mockScrollTo).toHaveBeenCalledWith(0, 0)
  })
})

// Helper function to find the excerpt paragraph in the rendered tree
function findExcerptParagraph(tree) {
  if (!tree || !tree.children) return null

  for (const child of tree.children) {
    if (child.type === 'p' && child.props && child.props.className && child.props.className.includes('description')) {
      return child
    }
    if (child.children) {
      const found = findExcerptParagraph(child)
      if (found) return found
    }
  }
  return null
}
