import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'

import PinnedItems from './pinned-items'

const mockPinnedItems = [
  {
    __typename: 'Repository',
    id: 'null-js',
    url: 'https://www.github.com/themeuser/sample-repo/'
  }
]

describe('Widget/GitHub/PinnedItems', () => {
  describe('snapshots', () => {
    it('matches the placeholder snapshot', () => {
      const { asFragment } = render(<PinnedItems isLoading />)
      expect(asFragment()).toMatchSnapshot()
    })

    it('matches the successful state', () => {
      const { asFragment } = render(<PinnedItems pinnedItems={mockPinnedItems} isLoading={false} />)
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
