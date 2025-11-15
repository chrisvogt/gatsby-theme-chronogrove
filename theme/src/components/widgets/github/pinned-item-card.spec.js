import React from 'react'
import renderer from 'react-test-renderer'

import PinnedItemCard from './pinned-item-card'

describe('Widget/GitHub/PinnedItemCard', () => {
  describe('snapshots', () => {
    it('matches the placeholder snapshot', () => {
      const tree = renderer.create(<PinnedItemCard type='placeholder' />).toJSON()
      expect(tree).toMatchSnapshot()
    })

    it('matches the repository variant snapshot', () => {
      const mockRepositoryItem = {
        description: 'A fake NodeJS project.',
        nameWithOwner: 'themeuser/sample-repo',
        openGraphImageUrl: './fake-image-path.png',
        pushedAt: '2024-06-01T12:00:00Z',
        updatedAt: '1592808981'
      }
      const tree = renderer.create(<PinnedItemCard item={mockRepositoryItem} type='Repository' />).toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
})
