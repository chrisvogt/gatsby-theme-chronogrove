import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import YouTube from './youtube'

describe('YouTube Shortcode', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <YouTube
        title='Here, There And Everywhere (Piano Cover) by Theme User'
        url='https://www.youtube-nocookie.com/embed/XJashBvI17A'
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders a default title if one is not provided', () => {
    const { container } = render(<YouTube url='https://www.youtube-nocookie.com/embed/XJashBvI17A' />)
    const iframe = container.querySelector('iframe')
    expect(iframe).toHaveAttribute('title', 'Video on YouTube')
  })

  it('renders with compact mode when compact prop is true', () => {
    const { container, asFragment } = render(
      <YouTube compact title='Compact Video' url='https://www.youtube-nocookie.com/embed/XJashBvI17A' />
    )
    const wrapper = container.querySelector('div')

    // Wrapper should exist
    expect(wrapper).toBeInTheDocument()

    // Should match snapshot with compact styles
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders with default mode when compact prop is false or omitted', () => {
    const { asFragment: fragment1 } = render(
      <YouTube title='Normal Video' url='https://www.youtube-nocookie.com/embed/XJashBvI17A' />
    )
    const { asFragment: fragment2 } = render(
      <YouTube compact={false} title='Normal Video' url='https://www.youtube-nocookie.com/embed/XJashBvI17A' />
    )

    // Both should render the same (with default VideoWrapper padding)
    expect(fragment1()).toMatchSnapshot()
    expect(fragment2()).toMatchSnapshot()
  })

  it('accepts custom sx styles', () => {
    const customSx = {
      borderRadius: '16px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
    }
    const { asFragment } = render(
      <YouTube sx={customSx} title='Styled Video' url='https://www.youtube-nocookie.com/embed/XJashBvI17A' />
    )

    expect(asFragment()).toMatchSnapshot()
  })
})
