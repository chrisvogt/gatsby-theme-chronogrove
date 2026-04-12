import React from 'react'
import { Link } from 'gatsby'

import { WidgetCallToAction } from '@chronogrove/ui/widget-call-to-action'

const CallToAction = props => <WidgetCallToAction linkComponent={Link} {...props} />

export default CallToAction
