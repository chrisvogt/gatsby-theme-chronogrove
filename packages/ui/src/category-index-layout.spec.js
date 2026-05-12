import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import {
  CategoryIndexHeroChrome,
  categoryIndexEmptyStateBoxSx,
  categoryIndexMainColumnFlexSx,
  categoryIndexPostListSectionSx
} from './category-index-layout.js'

jest.mock('./animated-page-background/index.js', () => ({
  __esModule: true,
  default: ({ overlayHeight }) => <div data-testid='animated-page-background' data-overlay={overlayHeight} />
}))

describe('categoryIndexPostListSectionSx', () => {
  it('matches shared index grid layout', () => {
    expect(categoryIndexPostListSectionSx).toMatchObject({
      display: 'grid',
      gridGap: [2, 2, 3, 3],
      gridTemplateColumns: '1fr',
      mt: 4
    })
  })
})

describe('categoryIndexEmptyStateBoxSx', () => {
  it('matches shared empty state spacing', () => {
    expect(categoryIndexEmptyStateBoxSx).toMatchObject({
      textAlign: 'center',
      py: 6,
      mt: 4
    })
  })
})

describe('categoryIndexMainColumnFlexSx', () => {
  it('matches main column flex rhythm', () => {
    expect(categoryIndexMainColumnFlexSx).toMatchObject({
      flexDirection: 'column',
      flexGrow: 1,
      position: 'relative',
      py: 3
    })
  })
})

describe('CategoryIndexHeroChrome', () => {
  it('defaults overlay height when omitted', () => {
    render(
      <CategoryIndexHeroChrome>
        <div data-testid='inner'>Hello</div>
      </CategoryIndexHeroChrome>
    )

    expect(screen.getByTestId('animated-page-background')).toHaveAttribute('data-overlay', 'min(75vh, 1000px)')
    expect(screen.getByTestId('inner')).toHaveTextContent('Hello')
  })

  it('renders animated background and stacks children above it', () => {
    render(
      <CategoryIndexHeroChrome overlayHeight='42vh'>
        <div data-testid='inner'>Hello</div>
      </CategoryIndexHeroChrome>
    )

    expect(screen.getByTestId('animated-page-background')).toHaveAttribute('data-overlay', '42vh')
    expect(screen.getByTestId('inner')).toHaveTextContent('Hello')
  })
})
