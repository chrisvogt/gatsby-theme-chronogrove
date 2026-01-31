/** @jsx jsx */
import { jsx, useThemeUI } from 'theme-ui'
import { Heading } from '@theme-ui/components'
import { RectShape } from 'react-placeholder/lib/placeholders'
import { Themed } from '@theme-ui/mdx'
import { useLocation, navigate } from '@gatsbyjs/reach-router'
import { useEffect } from 'react'
import isDarkMode from '../../../helpers/isDarkMode'

import BookExplorer from './book-explorer'
import BookLink from './book-link'

export const HEADLINE = 'Books'
export const BODY_TEXT = 'The last 12 books I read and finished.'

const RecentlyReadBooks = ({ books = [], isLoading }) => {
  const { colorMode } = useThemeUI()
  const darkModeActive = isDarkMode(colorMode)
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const bookId = params.get('bookId')
  const selectedBook = bookId ? books.find(book => book.id === bookId) : null

  // Handle scroll position restoration and prevention
  useEffect(() => {
    // Store the current scroll position when the component mounts
    const scrollPosition = window.scrollY

    // If we have a bookId in the URL on initial render, scroll to the goodreads element
    if (bookId && !location.state?.scrollPosition && !location.state?.noScroll) {
      // Use a small delay to ensure the element is ready, especially in Chrome
      setTimeout(() => {
        const goodreadsElement = document.getElementById('goodreads')
        if (goodreadsElement) {
          // Force a reflow to ensure the element is properly positioned
          goodreadsElement.offsetHeight
          // Use the browser's native hash navigation
          window.location.hash = 'goodreads'
        }
      }, 100)
    }
    // If we have a scroll position in state, restore it
    else if (location.state?.scrollPosition) {
      // Use requestAnimationFrame to ensure smooth restoration
      requestAnimationFrame(() => {
        window.scrollTo({
          top: location.state.scrollPosition,
          behavior: 'instant' // Use instant to prevent animation
        })
      })
    } else if (location.state?.noScroll) {
      // If noScroll is true, maintain the current position
      requestAnimationFrame(() => {
        window.scrollTo({
          top: scrollPosition,
          behavior: 'instant'
        })
      })
    }

    // Cleanup function to handle component unmount
    return () => {
      // Store the current scroll position when unmounting
      if (window.scrollY !== scrollPosition) {
        window.scrollTo({
          top: scrollPosition,
          behavior: 'instant'
        })
      }
    }
  }, [location.state, location.search, bookId]) // Add bookId to dependencies

  const handleClose = e => {
    if (e) {
      e.preventDefault()
    }
    const currentScroll = window.scrollY
    // Use replace to avoid adding to history stack
    navigate(location.pathname, {
      replace: true,
      state: {
        scrollPosition: currentScroll,
        noScroll: true
      }
    })
  }

  return (
    <div className='gallery'>
      <div sx={{ mb: 4 }}>
        <Heading
          as='h3'
          sx={{
            mb: 3,
            fontSize: [3, 4]
          }}
        >
          {HEADLINE}
        </Heading>

        <Themed.p>{BODY_TEXT}</Themed.p>

        {selectedBook ? (
          <BookExplorer book={selectedBook} onClose={handleClose} />
        ) : (
          <div
            sx={{
              display: 'grid',
              gridGap: [3, 1, 2],
              gridTemplateColumns: ['repeat(3, 1fr)', 'repeat(4, 1fr)', 'repeat(4, 1fr)', 'repeat(6, 1fr)']
            }}
          >
            {isLoading &&
              Array(12)
                .fill()
                .map((item, idx) => (
                  <RectShape
                    color={darkModeActive ? '#3a3a4a' : '#efefef'}
                    key={idx}
                    sx={{
                      boxShadow: 'md',
                      minHeight: '140px',
                      width: '100%'
                    }}
                  />
                ))}
            {!isLoading &&
              books.map(book => (
                <BookLink
                  id={book.id}
                  key={book.id}
                  thumbnailURL={book.cdnMediaURL || book.thumbnail}
                  title={book.title}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default RecentlyReadBooks
