/** @jsx jsx */
import { jsx, useThemeUI } from 'theme-ui'
import { TextBlock } from 'react-placeholder/lib/placeholders'
import isDarkMode from '../../../../helpers/isDarkMode'

import 'react-placeholder/lib/reactPlaceholder.css'

const GitHubPlaceholder = () => {
  const { colorMode } = useThemeUI()
  const darkModeActive = isDarkMode(colorMode)
  const placeholderColor = darkModeActive ? '#3a3a4a' : '#efefef'

  return (
    <div className='show-loading-animation'>
      <TextBlock rows={1} color={placeholderColor} style={{ marginBottom: '0.75em' }} />
      <TextBlock rows={2} color={placeholderColor} style={{ marginBottom: '0.75em' }} />
      <TextBlock rows={1} color={placeholderColor} />
    </div>
  )
}

export default GitHubPlaceholder
