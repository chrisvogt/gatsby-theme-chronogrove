import React from 'react'

import CategoryLabel from '@chronogrove/ui/category-label'
import { getCategoryDisplayName } from '../helpers/category-helpers'

const Category = ({ sx = {}, type, ...props }) => {
  const category = getCategoryDisplayName(type)

  return (
    <CategoryLabel sx={sx} {...props}>
      {category}
    </CategoryLabel>
  )
}

export default Category
