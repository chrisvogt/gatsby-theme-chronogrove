exports.createPages = async ({ actions }) => {
  const { createRedirect } = actions

  createRedirect({
    // Originally published to the wrong category
    fromPath: '/personal/2024-my-website-costs/',
    toPath: '/meta/2024-my-website-costs/',
    isPermanent: true,
    redirectInBrowser: true
  })

  // Old photography paths → Travel (permanent redirects for old URLs)
  const travelRedirects = [
    // Former photography/travel
    { from: '/photography/travel/belize', to: '/travel/belize' },
    { from: '/photography/travel/alaska-victoria', to: '/travel/alaska-victoria' },
    { from: '/photography/travel/virgin-caribbean-cruise', to: '/travel/virgin-caribbean-cruise' },
    { from: '/photography/travel/resilient-lady-colombia-caribbean', to: '/travel/resilient-lady-colombia-caribbean' },
    // Former photography/events (now travel)
    { from: '/photography/events/world-pride-2019', to: '/travel/world-pride-2019' },
    { from: '/photography/events/christmas-2019-in-la', to: '/travel/christmas-2019-in-la' }
  ]
  travelRedirects.forEach(({ from, to }) => {
    createRedirect({ fromPath: from, toPath: to, isPermanent: true, redirectInBrowser: true })
    createRedirect({ fromPath: `${from}/`, toPath: `${to}/`, isPermanent: true, redirectInBrowser: true })
  })

  // Photography section removed; send /photography to Travel
  createRedirect({ fromPath: '/photography', toPath: '/travel', isPermanent: true, redirectInBrowser: true })
  createRedirect({ fromPath: '/photography/', toPath: '/travel/', isPermanent: true, redirectInBrowser: true })
}
