import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'

import { WidgetCallToAction } from '@chronogrove/ui/widget-call-to-action'

const CallToAction = props => <WidgetCallToAction linkComponent={Link} {...props} />

CallToAction.propTypes = {
  children: PropTypes.node,
  isLoading: PropTypes.bool,
  loadingSlot: PropTypes.node,
  title: PropTypes.string,
  to: PropTypes.string,
  url: PropTypes.string,
  href: PropTypes.string,
  sx: PropTypes.object
}

export default CallToAction
