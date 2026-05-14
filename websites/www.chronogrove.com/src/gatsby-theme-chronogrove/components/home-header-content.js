/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Themed } from '@theme-ui/mdx'
import { useRef } from 'react'

/**
 * Home Page Header Content
 *
 * The content rendered into the home page header region. This content is rendered
 * inside of the header, on top of the themed background and below the top nav.
 */
const HomeHeaderContent = () => {
  const emojiRef = useRef(null)

  const handleMouseEnter = () => {
    if (emojiRef.current) {
      emojiRef.current.style.animation = 'wobble 1s ease-in-out'
    }
  }

  const handleAnimationEnd = () => {
    if (emojiRef.current) {
      emojiRef.current.style.animation = 'none'
    }
  }

  return (
    <div
      sx={{
        lineHeight: '2.5em',
        mb: 5
      }}
    >
      <Themed.h1
        onMouseEnter={handleMouseEnter}
        sx={{
          mb: 0,
          pb: 0,
          fontSize: 'calc(1.5rem + 2vw)',
          '.emoji': {
            display: 'inline-block'
          }
        }}
      >
        Welcome to{' '}
        <span className='emoji' ref={emojiRef} onAnimationEnd={handleAnimationEnd}>
          🎨
        </span>{' '}
        Chronogrove
      </Themed.h1>

      <Themed.p>
        A GatsbyJS theme for personal websites, blogs and digital gardens. Built with modern web technologies and
        designed for developers who want a sophisticated, feature-rich foundation for their digital presence.
      </Themed.p>

      <Themed.p>
        This demo showcases the theme's capabilities including social media widgets, blog functionality, and a
        responsive design that works beautifully on all devices.
      </Themed.p>
    </div>
  )
}

export default HomeHeaderContent
