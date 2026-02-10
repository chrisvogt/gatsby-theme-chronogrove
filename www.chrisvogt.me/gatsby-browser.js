// Enable Google Analytics in development mode for testing
// WARNING: This will send development traffic to your GA property
export const onClientEntry = () => {
  // Only load GA manually in development if explicitly enabled
  if (
    process.env.NODE_ENV === 'development' &&
    process.env.GATSBY_ENABLE_GA_IN_DEV === 'true' &&
    process.env.GATSBY_GA_PROPERTY_ID
  ) {
    // Load gtag.js script
    const script = document.createElement('script')
    script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.GATSBY_GA_PROPERTY_ID}`
    script.async = true
    document.head.appendChild(script)

    // Initialize gtag
    window.dataLayer = window.dataLayer || []
    function gtag() {
      window.dataLayer.push(arguments)
    }
    window.gtag = gtag
    gtag('js', new Date())
    gtag('config', process.env.GATSBY_GA_PROPERTY_ID, {
      anonymize_ip: true,
      cookie_flags: 'SameSite=None;Secure'
    })

    console.log('🔧 GA loaded in development mode for testing')
  }
}
