import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import LastPullRequest from './last-pull-request'

describe('Widget/GitHub/LastPullRequest', () => {
  describe('snapshots', () => {
    it('matches the loading state snapshot', () => {
      const { asFragment } = render(<LastPullRequest pullRequest={{}} isLoading />)
      expect(asFragment()).toMatchSnapshot()
    })

    it('matches the repository variant snapshot', () => {
      const mockPullRequest = {
        number: 42,
        repository: {
          name: 'Fake Project'
        },
        title: "Add fake information to the fake project's repository",
        url: 'https://www.github.com/themeuser/sample-repo/pulls/42'
      }
      const { asFragment } = render(<LastPullRequest pullRequest={mockPullRequest} />)
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
