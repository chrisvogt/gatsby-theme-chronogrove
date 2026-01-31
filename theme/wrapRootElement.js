/** @jsx jsx */
import { Global, CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import { jsx, useColorMode } from 'theme-ui'
import { MDXProvider } from '@mdx-js/react'
import { Provider as ReduxProvider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Themed } from '@theme-ui/mdx'
import { ThemeUIProvider } from 'theme-ui'

import Emoji from './src/shortcodes/emoji'
import RootWrapper from './src/components/root-wrapper'
import store from './src/store'
import theme from './src/gatsby-plugin-theme-ui'
import YouTube from './src/shortcodes/youtube'

// Create an Emotion cache
const cache = createCache({ key: 'css', prepend: true })

// Create a TanStack Query client with optimized defaults for Gatsby
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data stays fresh for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Cache data for 30 minutes
      gcTime: 30 * 60 * 1000,
      // Don't refetch on window focus (better for static sites)
      refetchOnWindowFocus: false,
      // Don't refetch on reconnect
      refetchOnReconnect: false,
      // Retry failed requests once
      retry: 1
    }
  }
})

// Table component that adapts to color mode
const Table = props => {
  const [colorMode] = useColorMode()
  const tableVariant = colorMode === 'dark' ? 'styles.tableDark' : 'styles.table'

  return <Themed.table {...props} sx={{ variant: tableVariant }} />
}

// Define MDX components
const components = {
  Emoji,
  pre: ({ children }) => <>{children}</>,
  YouTube,
  Table
}

const WrapRootElement = ({ element }) => (
  <QueryClientProvider client={queryClient}>
    <CacheProvider value={cache}>
      <ReduxProvider store={store}>
        <ThemeUIProvider theme={theme}>
          <Global styles={theme.global} />
          <MDXProvider components={components}>
            <RootWrapper>{element}</RootWrapper>
          </MDXProvider>
        </ThemeUIProvider>
      </ReduxProvider>
    </CacheProvider>
  </QueryClientProvider>
)

export default WrapRootElement
