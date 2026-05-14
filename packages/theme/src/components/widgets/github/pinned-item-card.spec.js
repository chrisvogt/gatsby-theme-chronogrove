import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'

import PinnedItemCard from './pinned-item-card'

describe('Widget/GitHub/PinnedItemCard', () => {
  describe('snapshots', () => {
    it('matches the placeholder snapshot', () => {
      const { asFragment } = render(<PinnedItemCard type='placeholder' />)
      expect(asFragment()).toMatchSnapshot()
    })

    it('matches the repository variant snapshot', () => {
      const mockRepositoryItem = {
        description: 'A fake NodeJS project.',
        nameWithOwner: 'themeuser/sample-repo',
        openGraphImageUrl: './fake-image-path.png',
        pushedAt: '2024-06-01T12:00:00Z',
        updatedAt: '1592808981'
      }
      const { asFragment } = render(<PinnedItemCard item={mockRepositoryItem} type='Repository' />)
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
