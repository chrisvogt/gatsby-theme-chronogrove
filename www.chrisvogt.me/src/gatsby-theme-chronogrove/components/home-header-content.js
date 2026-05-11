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
        Chris Vogt{' '}
        <span className='emoji' ref={emojiRef} onAnimationEnd={handleAnimationEnd} aria-hidden='true'>
          👋
        </span>
      </Themed.h1>

      <Themed.p>
        San Francisco · Principal Software Engineer at GoDaddy. This site is where I publish build notes, trip
        galleries, and piano recordings—the side projects and obsessions that do not live on a work roadmap.
      </Themed.p>

      <Themed.p>
        GitHub, reading lists, music plays, and photo tiles along the page sync once a day from a small API I run on
        Firebase—same pipeline that backs the public metrics service.
      </Themed.p>
    </div>
  )
}

export default HomeHeaderContent
