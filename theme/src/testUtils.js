import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeUIProvider } from 'theme-ui'
import theme from './gatsby-plugin-theme-ui'

import store from './store'

export { store }

/**
 * Creates a new QueryClient configured for testing
 * Each test should get a fresh QueryClient to avoid shared state
 */
export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // Disable retries in tests for faster failures
        retry: false,
        // Don't refetch on window focus in tests
        refetchOnWindowFocus: false,
        // Disable garbage collection timing for tests
        gcTime: Infinity,
        // Data is always stale in tests (triggers refetch logic)
        staleTime: 0
      }
    }
  })

// React module that provides necessary context to components being tested.
export const TestProvider = ({ children }) => <ThemeUIProvider theme={theme}>{children}</ThemeUIProvider>

/**
 * Test provider with Redux state (legacy)
 * Use TestProviderWithQuery for new tests
 */
export const TestProviderWithState = ({ children }) => (
  <ReduxProvider store={store}>
    <ThemeUIProvider theme={theme}>{children}</ThemeUIProvider>
  </ReduxProvider>
)

/**
 * Test provider with TanStack Query support
 * Creates a fresh QueryClient for each test to avoid shared state
 *
 * @example
 * render(
 *   <TestProviderWithQuery>
 *     <MyComponent />
 *   </TestProviderWithQuery>
 * )
 */
export const TestProviderWithQuery = ({ children, queryClient }) => {
  const client = queryClient || createTestQueryClient()

  return (
    <QueryClientProvider client={client}>
      <ReduxProvider store={store}>
        <ThemeUIProvider theme={theme}>{children}</ThemeUIProvider>
      </ReduxProvider>
    </QueryClientProvider>
  )
}

/**
 * Custom render function that wraps components with all necessary providers
 * This is the recommended way to render components in tests
 */
export const renderWithProviders = (ui, { queryClient, ...options } = {}) => {
  const client = queryClient || createTestQueryClient()

  const Wrapper = ({ children }) => (
    <QueryClientProvider client={client}>
      <ReduxProvider store={store}>
        <ThemeUIProvider theme={theme}>{children}</ThemeUIProvider>
      </ReduxProvider>
    </QueryClientProvider>
  )

  // Import render from @testing-library/react at runtime to avoid issues
  // eslint-disable-next-line no-undef
  const { render } = require('@testing-library/react')
  return {
    ...render(ui, { wrapper: Wrapper, ...options }),
    queryClient: client
  }
}
