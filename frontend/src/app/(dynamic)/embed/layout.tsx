'use client'

import { useEffect, useState } from 'react'
import Loading from '@/components/Loading'
import matomoTagManager from '@/lib/matomo'

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const [isLoading, setIsLoading] = useState(true)


  useEffect(() => {
    if (typeof window !== 'undefined') {
      matomoTagManager.injectMatomoScript()
      setIsLoading(false)
    }
  }, [])

  const content = isLoading
  ? <Loading />
  : children

  return (
    <div>
      {content}
    </div>
  )
}

export default Layout