import { render } from '@testing-library/react'
import { ThemeUIProvider } from 'theme-ui'
import React from 'react'

import ImageThumbnails from './image-thumbnails.js'

const stubTheme = { colors: { background: '#fff' } }

const wrap = ui => render(<ThemeUIProvider theme={stubTheme}>{ui}</ThemeUIProvider>)

describe('ImageThumbnails', () => {
  const sampleImages = [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg',
    'https://example.com/image3.jpg',
    'https://example.com/image4.jpg',
    'https://example.com/image5.jpg'
  ]

  it('renders thumbnails when images are provided', () => {
    const { container } = wrap(<ImageThumbnails images={sampleImages} />)

    const wrapper = container.firstChild
    expect(wrapper).toBeTruthy()
    expect(wrapper.children).toHaveLength(4)
  })

  it('renders correct number of thumbnails based on maxImages prop', () => {
    const { container } = wrap(<ImageThumbnails images={sampleImages} maxImages={3} />)

    const wrapper = container.firstChild
    expect(wrapper).toBeTruthy()
    expect(wrapper.children).toHaveLength(3)
  })

  it('returns null when images array is empty', () => {
    const { container } = wrap(<ImageThumbnails images={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('returns null when images is null', () => {
    const { container } = wrap(<ImageThumbnails images={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('returns null when images is undefined', () => {
    const { container } = wrap(<ImageThumbnails />)
    expect(container.firstChild).toBeNull()
  })

  it('renders fewer thumbnails when fewer images are provided than maxImages', () => {
    const twoImages = ['https://example.com/image1.jpg', 'https://example.com/image2.jpg']
    const { container } = wrap(<ImageThumbnails images={twoImages} maxImages={4} />)

    const wrapper = container.firstChild
    expect(wrapper).toBeTruthy()
    expect(wrapper.children).toHaveLength(2)
  })

  it('uses optimizeSrc when provided', () => {
    const optimizer = jest.fn(s => `${s}?x=1`)
    const { container } = wrap(<ImageThumbnails images={['https://example.com/a.jpg']} optimizeSrc={optimizer} />)
    expect(optimizer).toHaveBeenCalledWith('https://example.com/a.jpg')
    expect(container.firstChild).toBeTruthy()
  })

  it('omits inner background when optimizeSrc returns null', () => {
    const { container } = wrap(<ImageThumbnails images={['https://example.com/z.jpg']} optimizeSrc={() => null} />)
    expect(container.firstChild?.firstChild?.firstChild).toBeTruthy()
  })

  it('omits inner background when optimizeSrc returns undefined', () => {
    const { container } = wrap(<ImageThumbnails images={['https://example.com/z.jpg']} optimizeSrc={() => undefined} />)
    expect(container.firstChild?.firstChild?.firstChild).toBeTruthy()
  })

  it('handles null and non-string slots as empty thumbnails (same slot count)', () => {
    const mixedImages = ['https://example.com/image1.jpg', null, 'https://example.com/image2.jpg', undefined]
    const { container } = wrap(<ImageThumbnails images={mixedImages} maxImages={4} />)

    const wrapper = container.firstChild
    expect(wrapper).toBeTruthy()
    expect(wrapper.children).toHaveLength(4)
  })

  it('matches snapshot with default props', () => {
    const { asFragment } = wrap(<ImageThumbnails images={sampleImages} />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('matches snapshot with custom maxImages', () => {
    const { asFragment } = wrap(<ImageThumbnails images={sampleImages} maxImages={2} />)
    expect(asFragment()).toMatchSnapshot()
  })
})
