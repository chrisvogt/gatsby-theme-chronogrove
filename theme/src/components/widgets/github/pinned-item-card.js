/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Card } from '@theme-ui/components'
import { actionCardPinnedLayoutSx } from '@chronogrove/ui/action-card-layout'

import PlaceholderContent from './renderers/placeholder'
import RepositoryContent from './renderers/repository'

const PLACEHOLDER = 'placeholder'
const REPOSITORY = 'Repository'

const rendererRegistry = {
  [PLACEHOLDER]: PlaceholderContent,
  [REPOSITORY]: RepositoryContent
}

const PinnedItemCard = ({ item, type = PLACEHOLDER }) => (
  <Card variant='actionCard' sx={actionCardPinnedLayoutSx}>
    {rendererRegistry[type]?.(item)}
  </Card>
)

export default PinnedItemCard
