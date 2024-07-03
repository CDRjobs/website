import { SearchBoxCore } from '@mapbox/search-js-core'
import config from '../config'

const search = new SearchBoxCore({ accessToken: config.mapbox.token })

export default search