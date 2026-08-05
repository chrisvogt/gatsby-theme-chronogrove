/** @jsx jsx */
import { jsx } from 'theme-ui'
import PropTypes from 'prop-types'
import { Themed } from '@theme-ui/mdx'
import { Box, Card, Heading } from '@theme-ui/components'
import { dividedRowListSx } from '@chronogrove/ui/divided-row-list'

import PlaceholderContent from './renderers/placeholder'
import RepositoryContent from './renderers/repository'

const PLACEHOLDER = 'placeholder'
const REPOSITORY = 'Repository'

const rendererRegistry = {
  [PLACEHOLDER]: PlaceholderContent,
  [REPOSITORY]: RepositoryContent
}

const PinnedItems = ({ isLoading, items = [], placeholderCount = 4 }) => {
  const placeholderItems = Array(placeholderCount).fill({
    __typename: 'placeholder'
  })
  const itemsToRender = isLoading || items.length === 0 ? placeholderItems : items

  return (
    <Box sx={{ marginBottom: 4 }}>
      <Heading
        as='h3'
        sx={{
          mb: 3,
          fontSize: [3, 4]
        }}
      >
        Pinned Items
      </Heading>

      <Themed.p>Pinned items on my GitHub profile.</Themed.p>

      <Card variant='presentationalCard' sx={dividedRowListSx}>
        {itemsToRender.map((item, index) => (
          <Themed.a
            href={item.url}
            key={item.id || index}
            sx={{
              color: 'text',
              display: 'block',
              py: 3,
              '&:first-of-type': {
                pt: 0
              },
              '&:last-of-type': {
                pb: 0
              },
              '&:hover, &:focus': {
                textDecoration: 'none',
                bg: 'panel-highlight'
              }
            }}
          >
            {(rendererRegistry[item.__typename] || rendererRegistry[PLACEHOLDER])(item)}
          </Themed.a>
        ))}
      </Card>
    </Box>
  )
}

PinnedItems.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  items: PropTypes.arrayOf(PropTypes.object),
  placeholderCount: PropTypes.number
}

export default PinnedItems
