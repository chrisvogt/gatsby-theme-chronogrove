/** @jsx jsx */
import React from 'react'
import { jsx, useColorMode } from 'theme-ui'
import { Themed } from '@theme-ui/mdx'

export function MdxTable(props) {
  const [colorMode] = useColorMode()
  const tableVariant = colorMode === 'dark' ? 'styles.tableDark' : 'styles.table'

  return <Themed.table {...props} sx={{ variant: tableVariant }} />
}

export function MdxPrePassthrough({ children }) {
  return <>{children}</>
}
