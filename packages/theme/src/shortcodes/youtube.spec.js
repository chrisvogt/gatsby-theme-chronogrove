import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import YouTube from './youtube'

jest.mock('../components/lazy-load', () => ({ children }) => <>{children}</>)

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

  it('renders a facade with a play button instead of an iframe until activated', () => {
    const { container } = render(
      <YouTube title='Facade Video' url='https://www.youtube-nocookie.com/embed/XJashBvI17A' />
    )

    expect(container.querySelector('iframe')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Play video: Facade Video' })).toBeInTheDocument()
  })

  it('uses the video thumbnail as the facade image', () => {
    const { container } = render(
      <YouTube title='Facade Video' url='https://www.youtube-nocookie.com/embed/XJashBvI17A' />
    )

    const thumbnail = container.querySelector('img')
    expect(thumbnail).toHaveAttribute('src', 'https://i.ytimg.com/vi/XJashBvI17A/hqdefault.jpg')
  })

  it('renders a default label if no title is provided', () => {
    render(<YouTube url='https://www.youtube-nocookie.com/embed/XJashBvI17A' />)
    expect(screen.getByRole('button', { name: 'Play video: YouTube video' })).toBeInTheDocument()
  })

  it('replaces the facade with an autoplaying iframe on click', () => {
    const { container } = render(
      <YouTube title='Facade Video' url='https://www.youtube-nocookie.com/embed/XJashBvI17A' />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Play video: Facade Video' }))

    expect(screen.queryByRole('button', { name: 'Play video: Facade Video' })).not.toBeInTheDocument()

    const iframe = container.querySelector('iframe')
    expect(iframe).toBeInTheDocument()
    expect(iframe).toHaveAttribute('title', 'Facade Video')
    expect(iframe.getAttribute('src')).toBe('https://www.youtube-nocookie.com/embed/XJashBvI17A?autoplay=1')
  })

  it('appends autoplay with & when the url already has query parameters', () => {
    const { container } = render(
      <YouTube title='Facade Video' url='https://www.youtube-nocookie.com/embed/XJashBvI17A?si=abc' />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Play video: Facade Video' }))

    const iframe = container.querySelector('iframe')
    expect(iframe.getAttribute('src')).toBe('https://www.youtube-nocookie.com/embed/XJashBvI17A?si=abc&autoplay=1')
  })

  it('falls back to a default iframe title when none is provided and the facade is activated', () => {
    const { container } = render(<YouTube url='https://www.youtube-nocookie.com/embed/XJashBvI17A' />)

    fireEvent.click(screen.getByRole('button', { name: 'Play video: YouTube video' }))

    expect(container.querySelector('iframe')).toHaveAttribute('title', 'Video on YouTube')
  })

  it('falls back to rendering an iframe directly when the video ID cannot be parsed', () => {
    const { container } = render(<YouTube title='Broken Video' url='https://www.youtube.com/watch?v=abc123' />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    const iframe = container.querySelector('iframe')
    expect(iframe).toBeInTheDocument()
    expect(iframe).toHaveAttribute('src', 'https://www.youtube.com/watch?v=abc123')
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
