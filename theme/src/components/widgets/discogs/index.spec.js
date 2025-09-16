import React from 'react'
import renderer from 'react-test-renderer'

import DiscogsWidget from './index'

// Mock the discogs widget
jest.mock('./discogs-widget', () => {
  return function MockDiscogsWidget() {
    return <div data-testid='discogs-widget'>Discogs Widget</div>
  }
})

describe('Discogs Index', () => {
  it('exports the discogs widget as default', () => {
    const tree = renderer.create(<DiscogsWidget />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
