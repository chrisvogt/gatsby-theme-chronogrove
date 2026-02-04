import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import ThumbnailStrip from './thumbnail-strip'

describe('ThumbnailStrip', () => {
  const sampleImages = [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg',
    'https://example.com/image3.jpg',
    'https://example.com/image4.jpg',
    'https://example.com/image5.jpg'
  ]

  it('renders thumbnails when images are provided', () => {
    const { container } = render(<ThumbnailStrip images={sampleImages} />)

    // Should render 4 thumbnails by default (maxImages default is 4)
    const wrapper = container.firstChild
    expect(wrapper).toBeTruthy()
    expect(wrapper.children).toHaveLength(4)
  })

  it('renders correct number of thumbnails based on maxImages prop', () => {
    const { container } = render(<ThumbnailStrip images={sampleImages} maxImages={3} />)

    // Should render 3 thumbnails when maxImages is 3
    const wrapper = container.firstChild
    expect(wrapper).toBeTruthy()
    expect(wrapper.children).toHaveLength(3)
  })

  it('returns null when images array is empty', () => {
    const { container } = render(<ThumbnailStrip images={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('returns null when images is null', () => {
    const { container } = render(<ThumbnailStrip images={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('returns null when images is undefined', () => {
    const { container } = render(<ThumbnailStrip />)
    expect(container.firstChild).toBeNull()
  })

  it('renders fewer thumbnails when fewer images are provided than maxImages', () => {
    const twoImages = ['https://example.com/image1.jpg', 'https://example.com/image2.jpg']
    const { container } = render(<ThumbnailStrip images={twoImages} maxImages={4} />)

    // Should only render 2 thumbnails even though maxImages is 4
    const wrapper = container.firstChild
    expect(wrapper).toBeTruthy()
    expect(wrapper.children).toHaveLength(2)
  })

  it('accepts custom size prop', () => {
    const { container } = render(<ThumbnailStrip images={sampleImages} size={50} />)

    const wrapper = container.firstChild
    expect(wrapper).toBeTruthy()
    // Component should render without errors with custom size
    expect(wrapper.children).toHaveLength(4)
  })

  it('matches snapshot with default props', () => {
    const { asFragment } = render(<ThumbnailStrip images={sampleImages} />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('matches snapshot with custom maxImages and size', () => {
    const { asFragment } = render(<ThumbnailStrip images={sampleImages} maxImages={2} size={48} />)
    expect(asFragment()).toMatchSnapshot()
  })
})
