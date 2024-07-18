'use client'

import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const manropeFont = localFont({ src: '../fonts/Manrope-VariableFont_wght.ttf', variable: '--font-manrope' })

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html lang='en'>
      <body className={`${manropeFont.variable} ${inter.variable} font-sans`}>
        {children}
      </body>
    </html>
  )
}

export default Layout