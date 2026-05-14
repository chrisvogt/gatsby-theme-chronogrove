/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Themed } from '@theme-ui/mdx'
import { Box, Heading } from '@theme-ui/components'

import PinnedItemCard from './pinned-item-card'

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

      <Box
        sx={{
          display: 'grid',
          gridAutoRows: '1fr',
          gridGap: [3, 3, 3, 4],
          gridTemplateColumns: ['', '', '', 'repeat(2, 1fr)']
        }}
      >
        {itemsToRender.map((item, index) => (
          <Themed.a
            href={item.url}
            key={item.id || index}
            sx={{
              color: 'text',
              display: 'flex',
              '&:hover, &:focus': {
                textDecoration: 'none'
              }
            }}
          >
            <PinnedItemCard item={item} type={item.__typename} />
          </Themed.a>
        ))}
      </Box>
    </Box>
  )
}

export default PinnedItems
