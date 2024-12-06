'use client'

import { ClientProvider } from '@/context/ClientContext'

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <ClientProvider>
      {children}
    </ClientProvider>
  )
}

export default Layout