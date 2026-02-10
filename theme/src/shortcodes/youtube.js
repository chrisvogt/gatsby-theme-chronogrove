/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Themed } from '@theme-ui/mdx'
import { Embed } from '@theme-ui/components'

const YOUTUBE_IFRAME_ALLOW =
  'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'

const YouTube = ({ title, url, sx = {}, compact = false }) => (
  <Themed.div
    sx={{
      variant: 'styles.VideoWrapper',
      ...(compact && { paddingTop: 0 }), // Remove legacy padding for compact/card usage
      ...sx
    }}
  >
    <Embed
      allow={YOUTUBE_IFRAME_ALLOW}
      allowFullScreen
      referrerPolicy='strict-origin-when-cross-origin'
      src={url}
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        border: 0
      }}
      title={title || 'Video on YouTube'}
    />
  </Themed.div>
)

export default YouTube
