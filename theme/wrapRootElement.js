/** @jsx jsx */
import { jsx } from 'theme-ui'
import { MDXProvider } from '@mdx-js/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Themed } from '@theme-ui/mdx'

import ColorModeImage from './src/shortcodes/color-mode-image'
import Emoji from './src/shortcodes/emoji'
import Note from './src/shortcodes/Note'
import RootWrapper from './src/components/root-wrapper'
import theme from '@chronogrove/ui/theme'
import YouTube from './src/shortcodes/youtube'
import { ChronogroveThemeProvider } from '@chronogrove/ui'
import { MdxPrePassthrough, MdxTable } from './src/mdx-provider-components'

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

const components = {
  ...Themed,
  ColorModeImage,
  Emoji,
  Note,
  pre: MdxPrePassthrough,
  YouTube,
  Table: MdxTable
}

const WrapRootElement = ({ element }) => (
  <QueryClientProvider client={queryClient}>
    <ChronogroveThemeProvider theme={theme}>
      <MDXProvider components={components}>
        <RootWrapper>{element}</RootWrapper>
      </MDXProvider>
    </ChronogroveThemeProvider>
  </QueryClientProvider>
)

export default WrapRootElement
