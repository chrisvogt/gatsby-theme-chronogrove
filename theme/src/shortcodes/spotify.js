/** @jsx jsx */
import { jsx } from 'theme-ui'
import { useState, useEffect } from 'react'

const Spotify = ({ spotifyURL }) => {
  const [embedHtml, setEmbedHtml] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!spotifyURL) {
      setIsLoading(false)
      return
    }

    const fetchEmbed = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const encodedURL = encodeURIComponent(spotifyURL)
        const response = await fetch(`https://open.spotify.com/oembed?url=${encodedURL}`)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        // Remove deprecated allowfullscreen attribute that conflicts with allow attribute
        const sanitizedHtml = data.html?.replace(/\s*allowfullscreen/gi, '')
        setEmbedHtml(sanitizedHtml)
      } catch (error) {
        console.error('Failed to fetch Spotify embed:', error)
        setError('Failed to load Spotify embed')
      } finally {
        setIsLoading(false)
      }
    }

    fetchEmbed()
  }, [spotifyURL])

  if (isLoading) {
    return (
      <div
        sx={{
          width: '100%',
          height: '100px',
          background: 'muted',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'text'
        }}
      >
        Loading...
      </div>
    )
  }

  if (error) {
    return (
      <div
        sx={{
          width: '100%',
          height: '100px',
          background: 'muted',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'text'
        }}
      >
        {error}
      </div>
    )
  }

  if (!embedHtml) {
    return null
  }

  return (
    <div
      dangerouslySetInnerHTML={{ __html: embedHtml }}
      sx={{
        '& iframe': {
          width: '100% !important',
          height: '100px !important',
          maxHeight: '100px !important',
          borderRadius: '12px'
        }
      }}
    />
  )
}

export default Spotify
