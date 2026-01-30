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
})
