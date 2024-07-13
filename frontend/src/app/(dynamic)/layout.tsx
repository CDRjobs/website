'use client'

import { useEffect, useState } from 'react'
import { ApolloProvider } from '@apollo/client'
import createApolloClient from '@/lib/apolloClient'
import Loading from '@/components/Loading'

const client = createApolloClient()

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLoading(false)
    }
  }, [])

  const content = isLoading
    ? <Loading />
    : <ApolloProvider client={client}>
      {children}
    </ApolloProvider>

  return (
    <div>
      {content}
    </div>
  )
}

export default Layout