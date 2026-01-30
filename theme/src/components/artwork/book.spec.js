import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import Book from './book'

describe('Book', () => {
  const thumbnailURL = 'https://cdn.example.com/images/fake-book-cover.jpg'
  const title = 'Fake Book'

  it('matches the snapshot', () => {
    const { asFragment } = render(<Book thumbnailURL={thumbnailURL} title={title} />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders an image using the image prop', () => {
    const { container } = render(<Book thumbnailURL={thumbnailURL} title={title} />)
    const image = container.querySelector('image')
    expect(image).toHaveAttribute('xlink:href', thumbnailURL)
  })
})
