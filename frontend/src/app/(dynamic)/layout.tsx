'use client'

import { useEffect, useState } from 'react'
import { ApolloProvider } from '@apollo/client'
import createApolloClient from '@/lib/apolloClient'

const client = createApolloClient()

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLoading(false)
    }
  }, [])

  return (
    <div>
      {!isLoading && <ApolloProvider client={client}>
        {children}
      </ApolloProvider>}
    </div>
  )
}

export default Layout
