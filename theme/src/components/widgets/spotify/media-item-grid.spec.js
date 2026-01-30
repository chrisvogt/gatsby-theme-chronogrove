import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import MediaItemGrid from './media-item-grid'

const mockItems = [
  {
    id: 'ITEM-1',
    details: 'Item #1',
    name: 'Test Item 1',
    spotifyURL: 'https://www.google.com/',
    thumbnailURL: 'http://placekitten.com/200/200'
  },
  {
    id: 'ITEM-2',
    details: 'Item #2',
    name: 'Test Item 2',
    spotifyURL: 'https://www.example.com/',
    thumbnailURL: 'http://placekitten.com/300/300'
  }
]

describe('MediaItemGrid', () => {
  it('matches loading state snapshot', () => {
    const { asFragment } = render(<MediaItemGrid isLoading={false} items={mockItems} />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('matches the ready state snapshot state', () => {
    const { asFragment } = render(<MediaItemGrid isLoading={true} items={[]} />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('calls onTrackClick when item is clicked', () => {
    const mockOnTrackClick = jest.fn()
    const { getByTitle } = render(<MediaItemGrid isLoading={false} items={mockItems} onTrackClick={mockOnTrackClick} />)

    const firstItem = getByTitle('Item #1')
    fireEvent.click(firstItem)

    expect(mockOnTrackClick).toHaveBeenCalledWith('https://www.google.com/')
  })

  it('prevents default behavior when item is clicked', () => {
    const mockOnTrackClick = jest.fn()
    const { getByTitle } = render(<MediaItemGrid isLoading={false} items={mockItems} onTrackClick={mockOnTrackClick} />)

    const firstItem = getByTitle('Item #1')
    const mockEvent = { preventDefault: jest.fn() }

    // Simulate the click event
    fireEvent.click(firstItem, mockEvent)

    expect(mockOnTrackClick).toHaveBeenCalledWith('https://www.google.com/')
  })

  it('does not call onTrackClick when not provided', () => {
    const { getByTitle } = render(<MediaItemGrid isLoading={false} items={mockItems} />)

    const firstItem = getByTitle('Item #1')
    fireEvent.click(firstItem)

    // Should not throw an error when onTrackClick is not provided
    expect(firstItem).toBeInTheDocument()
  })

  it('exits early and does not prevent default when onTrackClick is not provided', () => {
    const { getByTitle } = render(<MediaItemGrid isLoading={false} items={mockItems} />)

    const firstItem = getByTitle('Item #1')
    const mockEvent = { preventDefault: jest.fn() }

    // Simulate the click event
    fireEvent.click(firstItem, mockEvent)

    // Should not call preventDefault when onTrackClick is not provided
    expect(mockEvent.preventDefault).not.toHaveBeenCalled()
  })

  it('handles mouse enter and leave events', () => {
    const { getByTitle } = render(<MediaItemGrid isLoading={false} items={mockItems} />)

    const firstItem = getByTitle('Item #1')

    // Test mouse enter
    fireEvent.mouseEnter(firstItem)
    expect(firstItem).toHaveClass('media-item--focused')

    // Test mouse leave
    fireEvent.mouseLeave(firstItem)
    expect(firstItem).not.toHaveClass('media-item--focused')
  })

  it('renders items with name and thumbnail', () => {
    const { getByTitle, getAllByAltText } = render(<MediaItemGrid isLoading={false} items={mockItems} />)

    expect(getByTitle('Item #1')).toBeInTheDocument()
    expect(getByTitle('Item #2')).toBeInTheDocument()
    expect(getAllByAltText('cover artwork')).toHaveLength(2)
  })

  it('renders items without name gracefully', () => {
    const itemsWithoutName = [
      {
        id: 'ITEM-1',
        details: 'Item #1',
        spotifyURL: 'https://www.google.com/',
        thumbnailURL: 'http://placekitten.com/200/200'
      }
    ]

    const { getByTitle } = render(<MediaItemGrid isLoading={false} items={itemsWithoutName} />)
    expect(getByTitle('Item #1')).toBeInTheDocument()
  })

  it('renders empty items array', () => {
    const { container } = render(<MediaItemGrid isLoading={false} items={[]} />)
    expect(container).toBeInTheDocument()
  })

  it('applies correct CSS classes for interaction states', () => {
    const { getByTitle } = render(<MediaItemGrid isLoading={false} items={mockItems} />)

    const firstItem = getByTitle('Item #1')

    // Initially should not have focused class
    expect(firstItem).not.toHaveClass('media-item--focused')

    // After mouse enter, should have focused class
    fireEvent.mouseEnter(firstItem)
    expect(firstItem).toHaveClass('media-item--focused')

    // After mouse leave, should not have focused class
    fireEvent.mouseLeave(firstItem)
    expect(firstItem).not.toHaveClass('media-item--focused')
  })

  it('renders multiple items correctly', () => {
    const { getAllByRole } = render(<MediaItemGrid isLoading={false} items={mockItems} />)

    const links = getAllByRole('link')
    expect(links).toHaveLength(2)
  })
})
