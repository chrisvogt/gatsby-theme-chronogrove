'use client'

import PropTypes from 'prop-types'
import { ChronogroveNextAppShell } from '@chronogrove/ui/next'

export default function Providers({ children }) {
  return <ChronogroveNextAppShell>{children}</ChronogroveNextAppShell>
}

Providers.propTypes = {
  children: PropTypes.node.isRequired
}
