import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'

import DiscogsWidget from './index'

// Mock the discogs widget
jest.mock('./discogs-widget', () => {
  return function MockDiscogsWidget() {
    return <div data-testid='discogs-widget'>Discogs Widget</div>
  }
})

describe('Discogs Index', () => {
  it('exports the discogs widget as default', () => {
    const { asFragment } = render(<DiscogsWidget />)
    expect(asFragment()).toMatchSnapshot()
  })
})
