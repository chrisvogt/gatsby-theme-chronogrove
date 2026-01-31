import React from 'react'
import { render } from '@testing-library/react'
import {
  TestProvider,
  TestProviderWithState,
  TestProviderWithQuery,
  createTestQueryClient,
  renderWithProviders,
  store
} from './testUtils'

describe('testUtils', () => {
  it('exports the Redux store', () => {
    expect(store).toBeDefined()
    expect(typeof store.dispatch).toBe('function')
    expect(typeof store.getState).toBe('function')
  })

  describe('TestProvider', () => {
    it('provides ThemeUI context to children', () => {
      const TestComponent = () => <div data-testid='test'>Test</div>

      const { getByTestId } = render(
        <TestProvider>
          <TestComponent />
        </TestProvider>
      )

      expect(getByTestId('test')).toBeInTheDocument()
    })
  })

  describe('TestProviderWithState', () => {
    it('provides both Redux and ThemeUI context to children', () => {
      const TestComponent = () => <div data-testid='test'>Test with State</div>

      const { getByTestId } = render(
        <TestProviderWithState>
          <TestComponent />
        </TestProviderWithState>
      )

      expect(getByTestId('test')).toBeInTheDocument()
    })
  })

  describe('createTestQueryClient', () => {
    it('creates a QueryClient with test-optimized defaults', () => {
      const client = createTestQueryClient()

      expect(client).toBeDefined()
      expect(client.getDefaultOptions().queries.retry).toBe(false)
      expect(client.getDefaultOptions().queries.refetchOnWindowFocus).toBe(false)
      expect(client.getDefaultOptions().queries.gcTime).toBe(Infinity)
      expect(client.getDefaultOptions().queries.staleTime).toBe(0)
    })

    it('creates a new instance each time', () => {
      const client1 = createTestQueryClient()
      const client2 = createTestQueryClient()

      expect(client1).not.toBe(client2)
    })
  })

  describe('TestProviderWithQuery', () => {
    it('provides QueryClient, Redux, and ThemeUI context to children', () => {
      const TestComponent = () => <div data-testid='test'>Test with Query</div>

      const { getByTestId } = render(
        <TestProviderWithQuery>
          <TestComponent />
        </TestProviderWithQuery>
      )

      expect(getByTestId('test')).toBeInTheDocument()
    })

    it('uses provided queryClient when passed as prop', () => {
      const customClient = createTestQueryClient()
      const TestComponent = () => <div data-testid='test'>Custom Client</div>

      const { getByTestId } = render(
        <TestProviderWithQuery queryClient={customClient}>
          <TestComponent />
        </TestProviderWithQuery>
      )

      expect(getByTestId('test')).toBeInTheDocument()
    })
  })

  describe('renderWithProviders', () => {
    it('renders component with all providers', () => {
      const TestComponent = () => <div data-testid='test'>Rendered with providers</div>

      const { getByTestId } = renderWithProviders(<TestComponent />)

      expect(getByTestId('test')).toBeInTheDocument()
    })

    it('returns the queryClient instance', () => {
      const TestComponent = () => <div>Test</div>

      const { queryClient } = renderWithProviders(<TestComponent />)

      expect(queryClient).toBeDefined()
      expect(queryClient.getDefaultOptions().queries.retry).toBe(false)
    })

    it('uses custom queryClient when provided', () => {
      const customClient = createTestQueryClient()
      const TestComponent = () => <div>Test</div>

      const { queryClient } = renderWithProviders(<TestComponent />, { queryClient: customClient })

      expect(queryClient).toBe(customClient)
    })
  })
})
