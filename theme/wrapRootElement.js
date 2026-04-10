/** @jsx jsx */
import { jsx, useColorMode } from 'theme-ui'
import { MDXProvider } from '@mdx-js/react'
import { Provider as ReduxProvider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Themed } from '@theme-ui/mdx'

import Emoji from './src/shortcodes/emoji'
import Note from './src/shortcodes/Note'
import RootWrapper from './src/components/root-wrapper'
import store from './src/store'
import theme from '@chronogrove/ui/theme'
import YouTube from './src/shortcodes/youtube'
import { ChronogroveThemeProvider } from '@chronogrove/ui'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 1
    }
  }
})

const Table = props => {
  const [colorMode] = useColorMode()
  const tableVariant = colorMode === 'dark' ? 'styles.tableDark' : 'styles.table'

  return <Themed.table {...props} sx={{ variant: tableVariant }} />
}

const Pre = ({ children }) => <>{children}</>

const components = {
  ...Themed,
  Emoji,
  Note,
  pre: Pre,
  YouTube,
  Table
}

const WrapRootElement = ({ element }) => (
  <QueryClientProvider client={queryClient}>
    <ReduxProvider store={store}>
      <ChronogroveThemeProvider theme={theme}>
        <MDXProvider components={components}>
          <RootWrapper>{element}</RootWrapper>
        </MDXProvider>
      </ChronogroveThemeProvider>
    </ReduxProvider>
  </QueryClientProvider>
)

export default WrapRootElement
