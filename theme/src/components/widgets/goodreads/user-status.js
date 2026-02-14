/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Themed } from '@theme-ui/mdx'
import { Box, Card, Heading } from '@theme-ui/components'
import { useRef, useState, useCallback } from 'react'
import ago from 's-ago'
import Placeholder from 'react-placeholder'
import { TextRow } from 'react-placeholder/lib/placeholders'

import Book from '../../artwork/book'
import CardFooter from '../card-footer'
import ViewExternal from '../view-external'

const MAX_TILT_DEG = 18

const buildBookImageUrl = thumbnailURL => {
  try {
    const url = new URL(thumbnailURL)
    const isImgixDomain = url.host.endsWith('.imgix.net')
    return isImgixDomain ? `${thumbnailURL}?auto=compress&auto=format` : thumbnailURL
  } catch {
    return thumbnailURL
  }
}

const removeAllHtmlTags = input => input.replace(/<a [^>]*>(.*?)<\/a>/g, '$1')

const renderStarsForRating = count => {
  const repeat = (char, n) => Array(n).fill(char).join('')
  const rating = repeat('★', count) + repeat('☆', 5 - count)
  return rating
}

const mapStatusToTemplate = {
  review: ({ book, rating }) => `rated ${book.title} ${rating} out of 5 stars: ${renderStarsForRating(rating)}.`,
  userstatus: ({ actionText }) => removeAllHtmlTags(actionText)
}

const UserStatus = ({ isLoading, status, actorName }) => {
  const bookContainerRef = useRef(null)
  const [tilt, setTilt] = useState(0)

  const handleMouseMove = useCallback(e => {
    const el = bookContainerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const centerX = rect.width / 2
    const normalized = rect.width > 0 ? (x - centerX) / centerX : 0
    const nextTilt = Math.max(-1, Math.min(1, normalized)) * MAX_TILT_DEG
    setTilt(nextTilt)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setTilt(0)
  }, [])

  // Handle undefined/null status gracefully
  if (!status && !isLoading) {
    return null
  }

  const { created, type, updated, cdnMediaURL } = status || {}
  const updateLink = status?.link
  const statusText = mapStatusToTemplate[type] ? mapStatusToTemplate[type](status) : 'Loading...'
  const bookTitle = status?.book?.title || 'Book cover'
  const bookImageUrl = cdnMediaURL ? buildBookImageUrl(cdnMediaURL) : null

  return (
    <Box>
      <Heading
        as='h3'
        sx={{
          mb: 3
        }}
      >
        Last Update
      </Heading>

      <Themed.a
        href={updateLink}
        rel='noopener noreferrer'
        target='_blank'
        onMouseMove={cdnMediaURL ? handleMouseMove : undefined}
        onMouseLeave={cdnMediaURL ? handleMouseLeave : undefined}
        sx={{
          color: 'var(--theme-ui-colors-panel-text)',
          display: 'flex',
          '&:hover, &:focus': {
            textDecoration: 'none'
          }
        }}
      >
        <Card variant='actionCard' sx={{ overflow: 'hidden' }}>
          <Placeholder
            color='#efefef'
            customPlaceholder={<TextRow style={{ marginTop: 0, width: '100%' }} />}
            ready={!isLoading}
            showLoadingAnimation
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: ['column', 'row'],
                alignItems: ['flex-start', 'center'],
                gap: 3
              }}
            >
              {bookImageUrl && (
                <div
                  ref={bookContainerRef}
                  data-testid='user-status-book-tilt-container'
                  sx={{
                    flexShrink: 0,
                    width: '80px',
                    perspective: '400px',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  <div
                    data-testid='user-status-book-tilt-inner'
                    sx={{
                      width: '100%',
                      transition: 'transform 0.15s ease-out',
                      transform: `rotateY(${tilt}deg)`,
                      transformOrigin: '50% 50%'
                    }}
                  >
                    <Book thumbnailURL={bookImageUrl} title={bookTitle} />
                  </div>
                </div>
              )}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <span>
                  {actorName} {statusText}
                </span>

                <CardFooter>
                  <Placeholder
                    color='#efefef'
                    customPlaceholder={
                      <TextRow color='#efefef' style={{ marginTop: 0, width: '150px', height: '15px' }} />
                    }
                    ready={!isLoading}
                    showLoadingAnimation
                  >
                    <span>Posted {ago(new Date(created || updated))}</span>
                    <ViewExternal platform='Goodreads' />
                  </Placeholder>
                </CardFooter>
              </Box>
            </Box>
          </Placeholder>
        </Card>
      </Themed.a>
    </Box>
  )
}

export default UserStatus
