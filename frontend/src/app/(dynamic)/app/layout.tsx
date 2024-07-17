'use client'

import { AuthProvider } from '@/context/AuthContext'

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {

  return (
    <div className='flex flex-col items-center'>
      <AuthProvider>
        {children}
      </AuthProvider>
    </div>
  )
}

export default Layout