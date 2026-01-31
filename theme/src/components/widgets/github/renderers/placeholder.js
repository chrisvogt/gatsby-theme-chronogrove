/** @jsx jsx */
import { jsx, Flex, useThemeUI } from 'theme-ui'
import { TextBlock, RectShape } from 'react-placeholder/lib/placeholders'
import isDarkMode from '../../../../helpers/isDarkMode'

import 'react-placeholder/lib/reactPlaceholder.css'

const GitHubPlaceholder = () => {
  const { colorMode } = useThemeUI()
  const darkModeActive = isDarkMode(colorMode)
  const placeholderColor = darkModeActive ? '#3a3a4a' : '#efefef'

  return (
    <div className='show-loading-animation'>
      <Flex>
        <div>
          <RectShape color={placeholderColor} style={{ width: 40, height: 40, marginBottom: '2em' }} />
        </div>
        <div sx={{ width: '100%', height: '100%' }}>
          <TextBlock rows={2} color={placeholderColor} />
        </div>
      </Flex>
      <TextBlock rows={3} color={placeholderColor} />
    </div>
  )
}

export default GitHubPlaceholder
