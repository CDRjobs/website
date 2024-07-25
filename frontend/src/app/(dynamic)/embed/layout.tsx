'use client'

import { useEffect, useState } from 'react'
import matomoTagManager from '@/lib/matomo'

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const [isLoading, setIsLoading] = useState(true)


  useEffect(() => {
    if (typeof window !== 'undefined') {
      matomoTagManager.injectMatomoScript()
      setIsLoading(false)
    }
  }, [])

  return (
    <div>
      {!isLoading && children}
    </div>
  )
}

export default Layout