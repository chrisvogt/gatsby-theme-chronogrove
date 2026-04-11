import React from 'react'
import { Heading } from '@theme-ui/components'

const PageHeader = ({ children }) => (
  <Heading as='h1' className='p-name' sx={{ mb: 2, lineHeight: 1.5, fontSize: [6, 'calc(1.25em + 2vw)'] }}>
    {children}
  </Heading>
)

export default PageHeader
