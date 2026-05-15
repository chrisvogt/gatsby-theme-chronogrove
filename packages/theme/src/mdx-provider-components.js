/** @jsx jsx */
import React from 'react'
import PropTypes from 'prop-types'
import { jsx, useColorMode } from 'theme-ui'
import { Themed } from '@theme-ui/mdx'

export function MdxTable(props) {
  const [colorMode] = useColorMode()
  const tableVariant = colorMode === 'dark' ? 'styles.tableDark' : 'styles.table'

  return <Themed.table {...props} sx={{ variant: tableVariant }} />
}

MdxTable.propTypes = {
  children: PropTypes.node
}

export function MdxPrePassthrough({ children }) {
  return <>{children}</>
}

MdxPrePassthrough.propTypes = {
  children: PropTypes.node
}
