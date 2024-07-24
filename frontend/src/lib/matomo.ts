const matomoTagManager = {
  injectMatomoScript: () => {
    // @ts-ignore
    var _paq = window._paq = window._paq || []

    _paq.push(['trackPageView'])
    _paq.push(['enableLinkTracking'])
    _paq.push(['setTrackerUrl', 'https://cdrjobsearth.matomo.cloud/matomo.php'])
    _paq.push(['setSiteId', '1'])

    var g = document.createElement('script')
    var s = document.getElementsByTagName('script')[0]

    g.async = true
    g.src = 'https://cdn.matomo.cloud/cdrjobsearth.matomo.cloud/matomo.js'

    if (s.parentNode) {
      s.parentNode.insertBefore(g, s)
    }
  },
}

export default matomoTagManager