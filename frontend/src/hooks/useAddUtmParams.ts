import { useClient } from '@/context/ClientContext'
import fp from 'lodash/fp'
const { snakeCase, toLower } = fp

const useAddUtmParams = (prefix: string) => {
  const { client } = useClient()
  const clientNameSlug = snakeCase(toLower(client.name))

  const addUtmParams = (urlString: string) => {
    const url = new URL(urlString)
    
    url.searchParams.set('utm_source', 'CDRjobs')
    url.searchParams.set('utm_medium', 'referral')
    url.searchParams.set('utm_campaign', `${prefix}_${clientNameSlug}`)
  
    return url.href
  }

  return addUtmParams
}

export default useAddUtmParams