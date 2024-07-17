'use client'

import { useEffect, useState } from 'react'
import Loading from '@/components/Loading'

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const [isLoading, setIsLoading] = useState(true)


  useEffect(() => {
    if (typeof window !== 'undefined') {
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