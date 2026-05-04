import { render } from '@testing-library/react'
import { ThemeUIProvider } from 'theme-ui'
import React from 'react'

import ThumbnailStrip from './thumbnail-strip.js'

const stubTheme = { colors: { background: '#fff' } }

const wrap = ui => render(<ThemeUIProvider theme={stubTheme}>{ui}</ThemeUIProvider>)

describe('ThumbnailStrip', () => {
  const sampleImages = [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg',
    'https://example.com/image3.jpg',
    'https://example.com/image4.jpg',
    'https://example.com/image5.jpg'
  ]

  it('renders thumbnails when images are provided', () => {
    const { container } = wrap(<ThumbnailStrip images={sampleImages} />)

    const wrapper = container.firstChild
    expect(wrapper).toBeTruthy()
    expect(wrapper.children).toHaveLength(4)
  })

  it('renders correct number of thumbnails based on maxImages prop', () => {
    const { container } = wrap(<ThumbnailStrip images={sampleImages} maxImages={3} />)

    const wrapper = container.firstChild
    expect(wrapper).toBeTruthy()
    expect(wrapper.children).toHaveLength(3)
  })

  it('returns null when images array is empty', () => {
    const { container } = wrap(<ThumbnailStrip images={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('returns null when images is null', () => {
    const { container } = wrap(<ThumbnailStrip images={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('returns null when images is undefined', () => {
    const { container } = wrap(<ThumbnailStrip />)
    expect(container.firstChild).toBeNull()
  })

  it('renders fewer thumbnails when fewer images are provided than maxImages', () => {
    const twoImages = ['https://example.com/image1.jpg', 'https://example.com/image2.jpg']
    const { container } = wrap(<ThumbnailStrip images={twoImages} maxImages={4} />)

    const wrapper = container.firstChild
    expect(wrapper).toBeTruthy()
    expect(wrapper.children).toHaveLength(2)
  })

  it('accepts custom size prop', () => {
    const { container } = wrap(<ThumbnailStrip images={sampleImages} size={50} />)

    const wrapper = container.firstChild
    expect(wrapper).toBeTruthy()
    expect(wrapper.children).toHaveLength(4)
  })

  it('omits background when an entry is not a non-empty string', () => {
    const mixed = ['https://example.com/a.jpg', '', null]
    const { container } = wrap(<ThumbnailStrip images={mixed} maxImages={4} />)
    expect(container.firstChild?.children?.length).toBe(3)
  })

  it('matches snapshot with default props', () => {
    const { asFragment } = wrap(<ThumbnailStrip images={sampleImages} />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('matches snapshot with custom maxImages and size', () => {
    const { asFragment } = wrap(<ThumbnailStrip images={sampleImages} maxImages={2} size={48} />)
    expect(asFragment()).toMatchSnapshot()
  })
})
