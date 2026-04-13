import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeUIProvider } from 'theme-ui'
import theme from './gatsby-plugin-theme-ui'

export { resetAudioPlayerStore } from './stores/audio-player-store'

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

export const TestProvider = ({ children }) => <ThemeUIProvider theme={theme}>{children}</ThemeUIProvider>

/**
 * Theme + optional legacy name for tests that previously wrapped Redux.
 * Audio player state uses Zustand (`useAudioPlayerStore`); call `resetAudioPlayerStore()` in beforeEach when needed.
 */
export const TestProviderWithState = ({ children }) => <ThemeUIProvider theme={theme}>{children}</ThemeUIProvider>

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
      <ThemeUIProvider theme={theme}>{children}</ThemeUIProvider>
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
      <ThemeUIProvider theme={theme}>{children}</ThemeUIProvider>
    </QueryClientProvider>
  )

  // Import render from @testing-library/react at runtime to avoid issues
  const { render } = require('@testing-library/react')
  return {
    ...render(ui, { wrapper: Wrapper, ...options }),
    queryClient: client
  }
}
