'use client'

import { useEffect, useState } from 'react'

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
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