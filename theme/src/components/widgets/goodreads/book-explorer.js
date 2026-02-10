/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Card, Heading } from '@theme-ui/components'
import { Themed } from '@theme-ui/mdx'
import { Link } from 'gatsby'
import { useLocation } from '@gatsbyjs/reach-router'

import Book from '../../artwork/book'
import ViewExternal from '../view-external'
import { parseSafeHtml } from '../../../helpers/safeHtmlParser'

const renderStarsForRating = count => {
  const repeat = (char, n) => Array(n).fill(char).join('')
  return repeat('★', count) + repeat('☆', 5 - count)
}

const BookExplorer = ({ book, onClose }) => {
  const { authors, cdnMediaURL, description, infoLink, rating, title } = book
  const location = useLocation()

  const handleBackClick = e => {
    e.preventDefault()
    onClose()
  }

  return (
    <Card variant='actionCard'>
      <div
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          position: 'relative'
        }}
      >
        <button
          data-testid='close-book-explorer'
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 2,
            right: 2,
            zIndex: 1,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            p: 2,
            '&:hover': {
              opacity: 0.8
            }
          }}
        >
          <svg
            aria-hidden='true'
            focusable='false'
            role='img'
            style={{}}
            viewBox='0 0 448 512'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M299.9 191.2c5.1 37.3-4.7 79-35.9 100.7-22.3 15.5-52.8 14.1-70.8 5.7-37.1-17.3-49.5-58.6-46.8-97.2 4.3-60.9 40.9-87.9 75.3-87.5 46.9-.2 71.8 31.8 78.2 78.3zM448 88v336c0 30.9-25.1 56-56 56H56c-30.9 0-56-25.1-56-56V88c0-30.9 25.1-56 56-56h336c30.9 0 56 25.1 56 56zM330 313.2s-.1-34-.1-217.3h-29v40.3c-.8.3-1.2-.5-1.6-1.2-9.6-20.7-35.9-46.3-76-46-51.9.4-87.2 31.2-100.6 77.8-4.3 14.9-5.8 30.1-5.5 45.6 1.7 77.9 45.1 117.8 112.4 115.2 28.9-1.1 54.5-17 69-45.2.5-1 1.1-1.9 1.7-2.9.2.1.4.1.6.2.3 3.8.2 30.7.1 34.5-.2 14.8-2 29.5-7.2 43.5-7.8 21-22.3 34.7-44.5 39.5-17.8 3.9-35.6 3.8-53.2-1.2-21.5-6.1-36.5-19-41.1-41.8-.3-1.6-1.3-1.3-2.3-1.3h-26.8c.8 10.6 3.2 20.3 8.5 29.2 24.2 40.5 82.7 48.5 128.2 37.4 49.9-12.3 67.3-54.9 67.4-106.3z'
              fill='currentColor'
              style={{}}
            />
          </svg>
        </button>
        <div
          sx={{
            display: 'flex',
            flexDirection: ['column', 'row'],
            gap: 4,
            p: 3
          }}
        >
          {/* Book Cover */}
          <div
            sx={{
              flex: '0 0 200px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <div sx={{ width: '100%', maxWidth: '128px' }}>
              <Book thumbnailURL={`${cdnMediaURL}?auto=compress&auto=format`} title={title} />
            </div>
            <Link
              to={location.pathname}
              onClick={handleBackClick}
              sx={{
                mt: 2,
                color: 'textMuted',
                fontSize: 1,
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              ← Back to grid view
            </Link>
          </div>

          {/* Book Details */}
          <div sx={{ flex: 1 }}>
            <Heading as='h3' sx={{ mb: 0, fontSize: [3, 4] }}>
              {title}
            </Heading>

            <Themed.p sx={{ mt: 0, mb: 2, color: 'textMuted' }}>by {authors.join(', ')}</Themed.p>

            <div sx={{ mt: 2, mb: 1 }}>
              <span sx={{ color: 'textMuted', mr: 2 }}>My Rating:</span>
              <span sx={{ color: 'primary' }}>{renderStarsForRating(parseInt(rating, 10))}</span>
            </div>

            <Themed.p sx={{ mt: 2, mb: 3 }}>{parseSafeHtml(description)}</Themed.p>

            <Themed.a
              href={infoLink}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                color: 'primary',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Learn more on Google Books &nbsp;
              <ViewExternal platform='Google Books' />
            </Themed.a>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default BookExplorer
