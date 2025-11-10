/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Themed } from '@theme-ui/mdx'
import { getCategoryDisplayName } from '../helpers/categoryHelpers'

const Category = ({ sx = {}, type }) => {
  const category = getCategoryDisplayName(type)

  return (
    <Themed.div
      sx={{
        display: 'inline-block',
        fontSize: [0],
        fontFamily: 'heading',
        color: 'primary',
        letterSpacing: '0.05em',
        ...sx
      }}
    >
      {category}
    </Themed.div>
  )
}

export default Category
