import { useEffect } from 'react'
import { navigate } from 'gatsby'

// Redirect /now to the latest recap
const NowPage = () => {
  useEffect(() => {
    navigate('/personal/may-2026', { replace: true })
  }, [])

  return null
}

export default NowPage
