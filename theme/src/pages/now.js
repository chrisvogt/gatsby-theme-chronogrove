import { useEffect } from 'react'
import { navigate } from 'gatsby'

// Redirect /now to the latest recap
const NowPage = () => {
  useEffect(() => {
    navigate('/personal/january-2026', { replace: true })
  }, [])

  return null
}

export default NowPage
