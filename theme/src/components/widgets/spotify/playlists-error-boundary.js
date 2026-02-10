import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'

// This component is a temporary solution for an issue I've been observing the last month or two
// where the Spotify Widget response data is missing images for the playlists. This causes a fatal
// error in the component which takes down the entire Home page.
const PlaylistsErrorBoundaryFallback = () => {
  // Don't render anything if there's an error. Most visitors, if not all, won't realize
  // this is missing.
  return null
}

const PlaylistsErrorBoundary = ({ children }) => {
  const handleError = (error, errorInfo) => {
    console.error('Error in Playlists component:', error, errorInfo)
  }

  return (
    <ErrorBoundary onError={handleError} FallbackComponent={PlaylistsErrorBoundaryFallback}>
      {children}
    </ErrorBoundary>
  )
}

export default PlaylistsErrorBoundary
