import './globals.css'

import PropTypes from 'prop-types'
import { ChronogroveNextEmotionRegistry, ChronogroveNextRootLayoutHead } from '@chronogrove/ui/next'

import Providers from './providers'

export const metadata = {
  title: 'Chronogrove UI — Next.js reference',
  description: 'App Router proof for @chronogrove/ui (issue #563)'
}

export default function RootLayout({ children }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <ChronogroveNextRootLayoutHead />
      </head>
      <body suppressHydrationWarning>
        <ChronogroveNextEmotionRegistry>
          <Providers>{children}</Providers>
        </ChronogroveNextEmotionRegistry>
      </body>
    </html>
  )
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired
}
