import React from 'react'

import CategoryLabel from '@chronogrove/ui/category-label'
import { getCategoryDisplayName } from '../helpers/categoryHelpers'

const Category = ({ sx = {}, type, ...props }) => {
  const category = getCategoryDisplayName(type)

  return (
    <CategoryLabel sx={sx} {...props}>
      {category}
    </CategoryLabel>
  )
}

export default Category
