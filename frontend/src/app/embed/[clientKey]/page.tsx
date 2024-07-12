'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import Button from '@/components/atoms/Button'
import MapboxSearch from '@/components/molecules/MapboxSearch'

const Page = () => {
  const { clientKey } = useParams()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <div className='flex flex-col items-center'>
      <h1>CDRjobs - {clientKey}</h1>
      <p>Find Job</p>
      <p>Powered by CDR Jobs © 2024</p>
      <MapboxSearch onSelect={(sug) => { console.log('selected', sug?.name) }}/>

      <Button text='Search' onClick={() => console.log('click')}/>

    </div>
  )
}

export default Page