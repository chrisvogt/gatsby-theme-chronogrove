import React from 'react'
import { render, screen } from '@testing-library/react'
import { ChronogroveThemeProvider } from './provider.js'
import chronogroveTheme from './theme.js'

import { ArticleColumnContainer, articleColumnContainerSx } from './article-column-container.js'

describe('articleColumnContainerSx', () => {
  it('defines the shared article measure', () => {
    expect(articleColumnContainerSx).toMatchObject({
      position: 'relative',
      width: ['', '', 'max(80ch, 50vw)'],
      lineHeight: 1.7
    })
  })
})

describe('ArticleColumnContainer', () => {
  it('renders children with merged sx', () => {
    render(
      <ChronogroveThemeProvider theme={chronogroveTheme}>
        <ArticleColumnContainer sx={{ flexGrow: 1 }} data-testid='ac'>
          <span>body</span>
        </ArticleColumnContainer>
      </ChronogroveThemeProvider>
    )
    expect(screen.getByTestId('ac')).toContainElement(screen.getByText('body'))
  })

  it('renders with base article sx when sx is omitted', () => {
    render(
      <ChronogroveThemeProvider theme={chronogroveTheme}>
        <ArticleColumnContainer data-testid='ac-base'>
          <span>only-base</span>
        </ArticleColumnContainer>
      </ChronogroveThemeProvider>
    )
    expect(screen.getByTestId('ac-base')).toContainElement(screen.getByText('only-base'))
  })
})
