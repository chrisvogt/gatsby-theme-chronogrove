import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import TrackPreview from './track-preview'

describe('TrackPreview', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <TrackPreview
        link='https://www.fake-book-website.com/book-example'
        name='Fake Song'
        thumbnailURL='https://placehold.it/400/400'
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
