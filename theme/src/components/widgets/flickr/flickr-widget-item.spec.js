import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import FlickrWidgetItem from './flickr-widget-item'

describe('FlickrWidgetItem', () => {
  const mockHandleClick = jest.fn()

  const defaultProps = {
    handleClick: mockHandleClick,
    index: 0,
    photo: {
      id: '0123456789',
      title: 'Test Photo Title',
      thumbnailUrl: 'https://cdn.example.com/images/fake-flickr-image.jpg'
    }
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('matches the snapshot', () => {
    const { asFragment } = render(<FlickrWidgetItem {...defaultProps} />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders the image with correct alt text and source', () => {
    render(<FlickrWidgetItem {...defaultProps} />)

    const img = screen.getByAltText('Flickr photo: Test Photo Title')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', defaultProps.photo.thumbnailUrl)
  })

  it('calls handleClick with the correct index when the button is clicked', () => {
    render(<FlickrWidgetItem {...defaultProps} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(mockHandleClick).toHaveBeenCalledTimes(1)
    expect(mockHandleClick).toHaveBeenCalledWith(defaultProps.index)
  })

  it('handles missing photo data gracefully', () => {
    // React 19 warns about empty src, but the component should still render
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    const propsWithMissingData = {
      handleClick: mockHandleClick,
      index: 0,
      photo: {}
    }

    render(<FlickrWidgetItem {...propsWithMissingData} />)

    const img = screen.getByRole('img')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('alt', 'Flickr photo: ')
    consoleSpy.mockRestore()
  })

  it('applies correct styling classes and theme variants', () => {
    const { container } = render(<FlickrWidgetItem {...defaultProps} />)
    const button = container.querySelector('.flickr-item-button')
    expect(button).toBeInTheDocument()
    const image = container.querySelector('.flickr-item-image')
    expect(image).toBeInTheDocument()
  })

  it('handles missing photo prop gracefully', () => {
    // React 19 warns about empty src, but the component should still render
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    render(<FlickrWidgetItem handleClick={mockHandleClick} index={0} />)

    const img = screen.getByRole('img')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('alt', 'Flickr photo: ')
    consoleSpy.mockRestore()
  })

  it('handles null photo prop gracefully', () => {
    // React 19 warns about empty src, but the component should still render
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    render(<FlickrWidgetItem photo={null} handleClick={mockHandleClick} index={0} />)

    const img = screen.getByRole('img')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('alt', 'Flickr photo: ')
    consoleSpy.mockRestore()
  })

  it('handles missing handleClick prop gracefully', () => {
    render(<FlickrWidgetItem photo={defaultProps.photo} index={0} />)

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    fireEvent.click(button)
    // Should not throw error when clicked
  })

  it('handles missing index prop gracefully', () => {
    render(<FlickrWidgetItem photo={defaultProps.photo} handleClick={mockHandleClick} />)

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    fireEvent.click(button)
    expect(mockHandleClick).toHaveBeenCalledWith(undefined)
  })
})
