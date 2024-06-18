'use client'

import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html lang='en'>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}

export default Layout