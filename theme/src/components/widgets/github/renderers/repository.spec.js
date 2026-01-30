import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import Repository from './repository'

describe('GitHub Repository Renderer', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <Repository
        description='GatsbyJS blog theme with built-in social widgets for creatives and developers.'
        nameWithOwner='themeuser/gatsby-theme-chronogrove'
        openGraphImageUrl='https://avatars0.githubusercontent.com/u/1934719?s=400&v=4'
        pushedAt='2024-06-01T12:00:00Z'
        updatedAt='2020-03-26T12:11:58Z'
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('falls back to updatedAt when pushedAt is not available', () => {
    const { asFragment } = render(
      <Repository
        description='Legacy repository without pushedAt field.'
        nameWithOwner='themeuser/legacy-repo'
        openGraphImageUrl='https://avatars0.githubusercontent.com/u/1934719?s=400&v=4'
        updatedAt='2020-03-26T12:11:58Z'
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
