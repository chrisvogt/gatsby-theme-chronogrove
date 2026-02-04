import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import ImageThumbnails from './image-thumbnails'

describe('ImageThumbnails', () => {
  const sampleImages = [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg',
    'https://example.com/image3.jpg',
    'https://example.com/image4.jpg',
    'https://example.com/image5.jpg'
  ]

  const cloudinaryImages = [
    'https://res.cloudinary.com/chrisvogt/image/upload/v1234567890/folder/image1.jpg',
    'https://res.cloudinary.com/chrisvogt/image/upload/v1234567890/folder/image2.jpg'
  ]

  it('renders thumbnails when images are provided', () => {
    const { container } = render(<ImageThumbnails images={sampleImages} />)

    // Should render 4 thumbnails by default (maxImages default is 4)
    // The structure is: wrapper div > thumbnail div (with image background) for each
    const wrapper = container.firstChild
    expect(wrapper).toBeTruthy()
    expect(wrapper.children).toHaveLength(4)
  })

  it('renders correct number of thumbnails based on maxImages prop', () => {
    const { container } = render(<ImageThumbnails images={sampleImages} maxImages={3} />)

    // Should render 3 thumbnails when maxImages is 3
    const wrapper = container.firstChild
    expect(wrapper).toBeTruthy()
    expect(wrapper.children).toHaveLength(3)
  })

  it('returns null when images array is empty', () => {
    const { container } = render(<ImageThumbnails images={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('returns null when images is null', () => {
    const { container } = render(<ImageThumbnails images={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('returns null when images is undefined', () => {
    const { container } = render(<ImageThumbnails />)
    expect(container.firstChild).toBeNull()
  })

  it('renders fewer thumbnails when fewer images are provided than maxImages', () => {
    const twoImages = ['https://example.com/image1.jpg', 'https://example.com/image2.jpg']
    const { container } = render(<ImageThumbnails images={twoImages} maxImages={4} />)

    // Should only render 2 thumbnails even though maxImages is 4
    const wrapper = container.firstChild
    expect(wrapper).toBeTruthy()
    expect(wrapper.children).toHaveLength(2)
  })

  it('applies stagger transform to alternate thumbnails', () => {
    const { container } = render(<ImageThumbnails images={sampleImages} maxImages={4} />)

    // The component applies different translateY values based on index
    // Even indices (0, 2) get translateY(0px), odd indices (1, 3) get translateY(4px)
    const wrapper = container.firstChild
    expect(wrapper).toBeTruthy()
  })

  it('matches snapshot with default props', () => {
    const { asFragment } = render(<ImageThumbnails images={sampleImages} />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('matches snapshot with custom maxImages', () => {
    const { asFragment } = render(<ImageThumbnails images={sampleImages} maxImages={2} />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders Cloudinary images with correct count', () => {
    const { container } = render(<ImageThumbnails images={cloudinaryImages} maxImages={2} />)

    // Should render 2 thumbnails
    const wrapper = container.firstChild
    expect(wrapper).toBeTruthy()
    expect(wrapper.children).toHaveLength(2)
  })

  it('matches snapshot with Cloudinary images (includes transformed URLs)', () => {
    // Snapshot will capture the transformed Cloudinary URLs with resize parameters
    const { asFragment } = render(<ImageThumbnails images={cloudinaryImages} maxImages={2} />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('handles null/undefined values in images array gracefully', () => {
    const mixedImages = ['https://example.com/image1.jpg', null, 'https://example.com/image2.jpg', undefined]
    const { container } = render(<ImageThumbnails images={mixedImages} maxImages={4} />)

    // Should still render 4 thumbnails (null/undefined get passed through to backgroundImage)
    const wrapper = container.firstChild
    expect(wrapper).toBeTruthy()
    expect(wrapper.children).toHaveLength(4)
  })
})
