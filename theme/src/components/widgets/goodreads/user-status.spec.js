import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ThemeUIProvider } from 'theme-ui'
import UserStatus from './user-status'

const mockTheme = {
  colors: {
    panel: {
      text: '#333'
    }
  }
}

const renderWithTheme = component => render(<ThemeUIProvider theme={mockTheme}>{component}</ThemeUIProvider>)

describe('UserStatus', () => {
  it('returns null when status is undefined and not loading', () => {
    const { container } = renderWithTheme(<UserStatus isLoading={false} status={undefined} actorName='Test User' />)

    expect(container.firstChild).toBeNull()
  })

  it('returns null when status is null and not loading', () => {
    const { container } = renderWithTheme(<UserStatus isLoading={false} status={null} actorName='Test User' />)

    expect(container.firstChild).toBeNull()
  })

  it('renders when loading even without status', () => {
    const { container } = renderWithTheme(<UserStatus isLoading={true} status={undefined} actorName='Test User' />)

    expect(container).toHaveTextContent('Last Update')
  })

  const mockReviewStatus = {
    type: 'review',
    book: { title: 'The Great Gatsby' },
    rating: 4,
    created: '2023-01-01T12:00:00Z',
    link: 'https://goodreads.com/review/123'
  }

  const mockUserStatus = {
    type: 'userstatus',
    actionText: 'Currently reading <a href="/book/456">1984</a>',
    updated: '2023-01-02T10:00:00Z',
    link: 'https://goodreads.com/status/456'
  }

  const mockUnknownStatus = {
    type: 'unknown',
    created: '2023-01-03T08:00:00Z',
    link: 'https://goodreads.com/status/789'
  }

  it('renders review status correctly', () => {
    const { container } = renderWithTheme(
      <UserStatus isLoading={false} status={mockReviewStatus} actorName='John Doe' />
    )

    expect(container).toHaveTextContent('John Doe rated The Great Gatsby 4 out of 5 stars: ★★★★☆.')
    expect(container).toHaveTextContent('Posted')
  })

  it('renders user status correctly and removes HTML tags', () => {
    const { container } = renderWithTheme(
      <UserStatus isLoading={false} status={mockUserStatus} actorName='Jane Smith' />
    )

    expect(container).toHaveTextContent('Jane Smith Currently reading 1984')
    expect(container).not.toHaveTextContent('<a href')
  })

  it('renders unknown status type with fallback text', () => {
    const { container } = renderWithTheme(
      <UserStatus isLoading={false} status={mockUnknownStatus} actorName='Bob Wilson' />
    )

    expect(container).toHaveTextContent('Bob Wilson Loading...')
  })

  it('renders loading state with placeholders', () => {
    const { container } = renderWithTheme(<UserStatus isLoading={true} status={{}} actorName='Loading User' />)

    expect(container).toHaveTextContent('Last Update')
  })

  it('generates correct star rating display', () => {
    const fiveStarStatus = { ...mockReviewStatus, rating: 5 }

    const { container } = renderWithTheme(
      <UserStatus isLoading={false} status={fiveStarStatus} actorName='Star Lover' />
    )

    expect(container).toHaveTextContent('★★★★★')
  })

  it('generates correct star rating for one star', () => {
    const oneStarStatus = { ...mockReviewStatus, rating: 1 }

    const { container } = renderWithTheme(<UserStatus isLoading={false} status={oneStarStatus} actorName='Critic' />)

    expect(container).toHaveTextContent('★☆☆☆☆')
  })

  it('uses created date when updated is not available', () => {
    const statusWithCreated = { ...mockReviewStatus, updated: undefined }

    const { container } = renderWithTheme(
      <UserStatus isLoading={false} status={statusWithCreated} actorName='Time Tester' />
    )

    expect(container).toHaveTextContent('Posted')
  })

  it('renders book cover with 3D tilt when update has cdnMediaURL', () => {
    const statusWithCover = {
      ...mockReviewStatus,
      cdnMediaURL: 'https://images.imgix.net/cover.jpg'
    }

    const { container, getByTestId } = renderWithTheme(
      <UserStatus isLoading={false} status={statusWithCover} actorName='John Doe' />
    )

    expect(container).toHaveTextContent('John Doe rated The Great Gatsby 4 out of 5 stars')
    const tiltContainer = getByTestId('user-status-book-tilt-container')
    expect(tiltContainer).toBeInTheDocument()
    const image = container.querySelector('[data-testid="book-preview-thumbnail"]')
    expect(image).toHaveAttribute('xlink:href', 'https://images.imgix.net/cover.jpg?auto=compress&auto=format')
  })

  it('does not render book cover when cdnMediaURL is absent', () => {
    const { queryByTestId } = renderWithTheme(
      <UserStatus isLoading={false} status={mockReviewStatus} actorName='John Doe' />
    )

    expect(queryByTestId('user-status-book-tilt-container')).not.toBeInTheDocument()
  })

  it('passes through non-imgix and invalid URLs in buildBookImageUrl', () => {
    const statusWithPlainUrl = {
      ...mockReviewStatus,
      cdnMediaURL: 'https://example.com/cover.jpg'
    }
    const { container } = renderWithTheme(
      <UserStatus isLoading={false} status={statusWithPlainUrl} actorName='John Doe' />
    )
    const image = container.querySelector('[data-testid="book-preview-thumbnail"]')
    expect(image).toHaveAttribute('xlink:href', 'https://example.com/cover.jpg')
  })

  it('uses cdnMediaURL as-is when URL constructor throws', () => {
    const statusWithInvalidUrl = {
      ...mockReviewStatus,
      cdnMediaURL: 'not-a-valid-url'
    }
    const { container } = renderWithTheme(
      <UserStatus isLoading={false} status={statusWithInvalidUrl} actorName='John Doe' />
    )
    const image = container.querySelector('[data-testid="book-preview-thumbnail"]')
    expect(image).toHaveAttribute('xlink:href', 'not-a-valid-url')
  })

  it('applies tilt on mouse move when update has cdnMediaURL', () => {
    const statusWithCover = {
      ...mockReviewStatus,
      cdnMediaURL: 'https://images.imgix.net/cover.jpg'
    }
    const { container, getByTestId } = renderWithTheme(
      <UserStatus isLoading={false} status={statusWithCover} actorName='John Doe' />
    )
    const tiltContainer = getByTestId('user-status-book-tilt-container')
    const link = container.querySelector('a[href="https://goodreads.com/review/123"]')

    // Mock getBoundingClientRect so tilt calculation runs (jsdom returns zeros)
    tiltContainer.getBoundingClientRect = () => ({
      left: 0,
      width: 200,
      top: 0,
      right: 200,
      bottom: 80,
      height: 80,
      x: 0,
      y: 0,
      toJSON: () => {}
    })

    fireEvent.mouseMove(link, { clientX: 200 })
    const tiltInner = getByTestId('user-status-book-tilt-inner')
    expect(tiltInner).toHaveStyle({ transform: 'rotateY(18deg)' })
  })

  it('resets tilt on mouse leave when update has cdnMediaURL', () => {
    const statusWithCover = {
      ...mockReviewStatus,
      cdnMediaURL: 'https://images.imgix.net/cover.jpg'
    }
    const { container, getByTestId } = renderWithTheme(
      <UserStatus isLoading={false} status={statusWithCover} actorName='John Doe' />
    )
    const tiltContainer = getByTestId('user-status-book-tilt-container')
    const link = container.querySelector('a[href="https://goodreads.com/review/123"]')
    tiltContainer.getBoundingClientRect = () => ({
      left: 0,
      width: 200,
      top: 0,
      right: 200,
      bottom: 80,
      height: 80,
      x: 0,
      y: 0,
      toJSON: () => {}
    })

    fireEvent.mouseMove(link, { clientX: 200 })
    fireEvent.mouseLeave(link)
    const tiltInner = getByTestId('user-status-book-tilt-inner')
    expect(tiltInner).toHaveStyle({ transform: 'rotateY(0deg)' })
  })

  it('handles mouse move when book container ref is not set (early return)', () => {
    const statusWithCover = {
      ...mockReviewStatus,
      cdnMediaURL: 'https://images.imgix.net/cover.jpg'
    }
    const nullRef = { current: null }
    const useRefSpy = jest
      .spyOn(React, 'useRef')
      .mockImplementation(initial => (initial === null ? nullRef : { current: initial }))

    const { container, getByTestId } = renderWithTheme(
      <UserStatus isLoading={false} status={statusWithCover} actorName='John Doe' />
    )
    const link = container.querySelector('a[href="https://goodreads.com/review/123"]')
    fireEvent.mouseMove(link, { clientX: 100 })

    const tiltInner = getByTestId('user-status-book-tilt-inner')
    expect(tiltInner).toHaveStyle({ transform: 'rotateY(0deg)' })

    useRefSpy.mockRestore()
  })

  it('does not apply tilt when container has zero width (branch coverage)', () => {
    const statusWithCover = {
      ...mockReviewStatus,
      cdnMediaURL: 'https://images.imgix.net/cover.jpg'
    }
    const { container, getByTestId } = renderWithTheme(
      <UserStatus isLoading={false} status={statusWithCover} actorName='John Doe' />
    )
    const tiltContainer = getByTestId('user-status-book-tilt-container')
    const link = container.querySelector('a[href="https://goodreads.com/review/123"]')
    tiltContainer.getBoundingClientRect = () => ({
      left: 0,
      width: 0,
      top: 0,
      right: 0,
      bottom: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON: () => {}
    })

    fireEvent.mouseMove(link, { clientX: 100 })
    const tiltInner = getByTestId('user-status-book-tilt-inner')
    expect(tiltInner).toHaveStyle({ transform: 'rotateY(0deg)' })
  })

  it('renders update link with target _blank and noopener noreferrer', () => {
    const { container } = renderWithTheme(
      <UserStatus isLoading={false} status={mockReviewStatus} actorName='John Doe' />
    )
    const link = container.querySelector('a[href="https://goodreads.com/review/123"]')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('matches snapshot', () => {
    const { asFragment } = renderWithTheme(
      <UserStatus isLoading={false} status={mockReviewStatus} actorName='Snapshot User' />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
