import { useEffect } from 'react'
import { navigate } from 'gatsby'

// Redirect /now to the latest recap
const NowPage = () => {
  useEffect(() => {
    navigate('/personal/october-2025', { replace: true })
  }, [])

  return null
}

export default NowPage
