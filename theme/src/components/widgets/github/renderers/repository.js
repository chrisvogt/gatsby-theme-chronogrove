/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Flex, Heading } from '@theme-ui/components'
import ago from 's-ago'

import CardFooter from '../../card-footer'
import ViewExternal from '../../view-external'

const Repository = ({ description, nameWithOwner, pushedAt, updatedAt }) => {
  // Prefer pushedAt (last push to default branch) over updatedAt (metadata changes)
  // Falls back to updatedAt for backwards compatibility
  const lastActivityDate = pushedAt || updatedAt

  return (
    <Flex
      sx={{
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <Heading as='h4' sx={{ p: 0, mb: 2 }}>
        {nameWithOwner}
      </Heading>

      <span sx={{ flexGrow: 1, mb: 2 }}>{description}</span>

      <CardFooter>
        <span>Last updated {ago(new Date(lastActivityDate))}</span>
        <ViewExternal platform='GitHub' />
      </CardFooter>
    </Flex>
  )
}

export default Repository
