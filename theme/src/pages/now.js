import { useEffect } from 'react'
import { navigate } from 'gatsby'

// Redirect /now to the latest recap
const NowPage = () => {
  useEffect(() => {
    navigate('/personal/april-2026', { replace: true })
  }, [])

  return null
}

export default NowPage
