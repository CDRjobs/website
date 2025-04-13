import { createContext, useContext, useEffect, useState } from 'react'
import { Client } from '@/services/client'
import { useParams } from 'next/navigation'
import GetClientQuery from '@/app/(dynamic)/embed/[clientKey]/[clientName]/_graphql/getClient'
import { useLazyQuery } from '@apollo/client'

type ClientContext = {
  client: Client,
}

const emptyClient = {
  name: '',
  key: '',
  hasFeaturedJobs: false,
}

const ClientContext = createContext<ClientContext>({ client: emptyClient })

export const useClient = () => useContext(ClientContext)

export const ClientProvider = ({ children }: { children: React.ReactNode }) => {
  const { clientKey } = useParams() as { [key: string]: string }
  const [queryClient] = useLazyQuery(GetClientQuery)
  const [client, setClient] = useState<Client>(emptyClient)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getClient = async () => {
      const { data } = await queryClient({ variables: { clientKey }})
      setClient(data?.getClient?.data)
      setLoading(false)
    }

    getClient()
  }, [clientKey, queryClient])

  return <ClientContext.Provider value={{ client }}>{!loading && children}</ClientContext.Provider>
}