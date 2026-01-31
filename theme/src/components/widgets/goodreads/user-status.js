/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Themed } from '@theme-ui/mdx'
import { Box, Card, Heading } from '@theme-ui/components'
import ago from 's-ago'
import Placeholder from 'react-placeholder'
import { TextRow } from 'react-placeholder/lib/placeholders'

import CardFooter from '../card-footer'
import ViewExternal from '../view-external'

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
  // Handle undefined/null status gracefully
  if (!status && !isLoading) {
    return null
  }

  const { created, link, type, updated } = status || {}
  const statusText = mapStatusToTemplate[type] ? mapStatusToTemplate[type](status) : 'Loading...'

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
        href={link}
        sx={{
          color: 'var(--theme-ui-colors-panel-text)',
          display: 'flex',
          '&:hover, &:focus': {
            textDecoration: 'none'
          }
        }}
      >
        <Card variant='actionCard'>
          <Placeholder
            color='#efefef'
            customPlaceholder={<TextRow style={{ marginTop: 0, width: '100%' }} />}
            ready={!isLoading}
            showLoadingAnimation
          >
            <span>
              {actorName} {statusText}
            </span>
          </Placeholder>

          <CardFooter>
            <Placeholder
              color='#efefef'
              customPlaceholder={<TextRow color='#efefef' style={{ marginTop: 0, width: '150px', height: '15px' }} />}
              ready={!isLoading}
              showLoadingAnimation
            >
              <span>Posted {ago(new Date(created || updated))}</span>
              <ViewExternal platform='Goodreads' />
            </Placeholder>
          </CardFooter>
        </Card>
      </Themed.a>
    </Box>
  )
}

export default UserStatus
