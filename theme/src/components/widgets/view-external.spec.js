import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import ViewExternal from './view-external'

describe('ViewExternal', () => {
  it('matches the snapshot', () => {
    const platform = 'GitHub'
    const { asFragment } = render(<ViewExternal platform={platform}>{platform}</ViewExternal>)
    expect(asFragment()).toMatchSnapshot()
  })
})
