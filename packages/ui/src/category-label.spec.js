import { render, screen } from '@testing-library/react'
import { ThemeUIProvider } from 'theme-ui'

import CategoryLabel from './category-label.js'

const theme = { colors: { primary: '#422EA3' } }

const renderWithTheme = ui => render(<ThemeUIProvider theme={theme}>{ui}</ThemeUIProvider>)

describe('CategoryLabel', () => {
  it('renders children', () => {
    renderWithTheme(<CategoryLabel>Travel</CategoryLabel>)
    expect(screen.getByText('Travel')).toBeInTheDocument()
  })

  it('merges sx', () => {
    renderWithTheme(
      <CategoryLabel sx={{ color: 'red' }} data-testid='cat'>
        X
      </CategoryLabel>
    )
    expect(screen.getByTestId('cat')).toBeInTheDocument()
  })
})
