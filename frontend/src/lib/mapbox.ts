import { SearchBoxCore } from '@mapbox/search-js-core'

const search = new SearchBoxCore({ accessToken: process.env.NEXT_PUBLIC_MAPBOX_PUBLIC_KEY! })

export default search