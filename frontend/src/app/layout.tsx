'use client'

import localFont from 'next/font/local'
import './globals.css'

const ManropeFont = localFont({ src: '../fonts/Manrope-VariableFont_wght.ttf', variable: '--font-manrope' })

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html lang='en'>
      <body className={`${ManropeFont.variable} font-sans`}>
        {children}
      </body>
    </html>
  )
}

export default Layout