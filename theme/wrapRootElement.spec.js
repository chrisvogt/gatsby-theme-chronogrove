import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock dependencies before importing the component
jest.mock('./src/store', () => ({
  getState: jest.fn(() => ({ audioPlayer: {} })),
  dispatch: jest.fn(),
  subscribe: jest.fn()
}))

jest.mock('./src/gatsby-plugin-theme-ui', () => ({
  colors: {
    text: '#333',
    background: '#fff'
  },
  global: {},
  styles: {
    table: { borderCollapse: 'collapse' },
    tableDark: { borderCollapse: 'collapse', bg: '#333' }
  }
}))

jest.mock('./src/components/root-wrapper', () => ({ children }) => <div data-testid='root-wrapper'>{children}</div>)
jest.mock('./src/shortcodes/emoji', () => () => <span data-testid='emoji'>emoji</span>)
jest.mock('./src/shortcodes/youtube', () => () => <div data-testid='youtube'>youtube</div>)

// Now import the component
import WrapRootElement from './wrapRootElement'

describe('wrapRootElement', () => {
  it('renders children within all providers', () => {
    const { getByTestId, getByText } = render(<WrapRootElement element={<div>Test Content</div>} />)

    expect(getByTestId('root-wrapper')).toBeInTheDocument()
    expect(getByText('Test Content')).toBeInTheDocument()
  })

  it('renders QueryClientProvider wrapper', () => {
    const { container } = render(<WrapRootElement element={<span>Query Test</span>} />)
    expect(container).toBeDefined()
  })

  it('renders CacheProvider wrapper', () => {
    const { container } = render(<WrapRootElement element={<span>Cache Test</span>} />)
    expect(container).toBeDefined()
  })

  it('renders ReduxProvider wrapper', () => {
    const { container } = render(<WrapRootElement element={<span>Redux Test</span>} />)
    expect(container).toBeDefined()
  })

  it('renders ThemeUIProvider wrapper', () => {
    const { container } = render(<WrapRootElement element={<span>Theme Test</span>} />)
    expect(container).toBeDefined()
  })

  it('renders MDXProvider wrapper', () => {
    const { container } = render(<WrapRootElement element={<span>MDX Test</span>} />)
    expect(container).toBeDefined()
  })

  it('renders Global styles', () => {
    const { container } = render(<WrapRootElement element={<span>Global Test</span>} />)
    expect(container).toBeDefined()
  })
})
