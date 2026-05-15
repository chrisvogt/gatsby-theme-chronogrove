import React from 'react'
import PropTypes from 'prop-types'

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

Category.propTypes = {
  sx: PropTypes.object,
  type: PropTypes.string
}

export default Category
