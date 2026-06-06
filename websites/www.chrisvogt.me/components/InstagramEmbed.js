import { useEffect } from 'react'
import PropTypes from 'prop-types'

export function InstagramEmbed({ permalink }) {
  useEffect(() => {
    if (globalThis.instgrm) {
      globalThis.instgrm.Embeds.process()
    } else {
      const script = document.createElement('script')
      script.src = '//www.instagram.com/embed.js'
      script.async = true
      document.body.appendChild(script)
    }
  }, [])

  return (
    <div style={{ maxWidth: '540px', margin: '1.5rem auto' }}>
      <blockquote
        className='instagram-media'
        data-instgrm-captioned
        data-instgrm-permalink={permalink}
        data-instgrm-version='14'
        style={{
          background: '#FFF',
          border: 0,
          borderRadius: '3px',
          boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
          margin: '1px',
          maxWidth: '540px',
          minWidth: '326px',
          padding: 0,
          width: 'calc(100% - 2px)'
        }}
      />
    </div>
  )
}

InstagramEmbed.propTypes = {
  permalink: PropTypes.string.isRequired
}
