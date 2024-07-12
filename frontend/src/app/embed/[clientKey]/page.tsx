'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import Button from '@/components/atoms/Button'
import LocationCombobox from '@/components/molecules/LocationCombobox'
import CategoryListbox from '@/components/molecules/CategoryListbox'
import FilterListbox, { FilterListboxRef } from '@/components/molecules/FilterListbox'

const verticals = {
  forest: 'Afforestation/Reforestation',
  biomass: 'Biomass Carbon Removal and Storage (BiCRS)',
  directAirCapture: 'Direct Air Carbon Capture and Storage (DACCS)',
  ecosystemServices: 'Ecosystem Services',
  mCdr: 'Marine Carbon Dioxide Removal (mCDR)',
  mineralization: 'Mineralization',
  soil: 'Soil Carbon',
  utilization: 'Utilisation',
}

const companySizes = {
  xxs: '1-10',
  xs: '11-50',
  s: '51-200',
  m: '201-500',
  l: '501-1000',
  xl: '1001-5000',
  xxl: '5001+',
}

const remote = {
  yes: 'Yes',
  hybrid: 'Hybrid',
  no: 'No',
}

const seniority = {
  entryLevel: 'Entry level (<2 years)',
  earlyStage: 'Early stage (2-5 years)',
  midLevel: 'Mid-level (5-10 years)',
  senior: 'Senior (10-20 years)',
  verySenior: 'Very senior (20+ years)',
}

const contractTypes = {
  fullTime: 'Full-time',
  partTime: 'Part-time',
  employee: 'Employee',
  volunteer: 'Volunteer',
  contractor: 'Contractor',
  internship: 'Intern',
  paidFellowship: 'Paid Fellowship',
}

const Page = () => {
  const { clientKey } = useParams()
  const [isClient, setIsClient] = useState(false)
  const verticalFilterRef = useRef<FilterListboxRef>(null)
  const companySizeFilterRef = useRef<FilterListboxRef>(null)
  const remoteFilterRef = useRef<FilterListboxRef>(null)
  const seniorityFilterRef = useRef<FilterListboxRef>(null)
  const contractTypeFilterRef = useRef<FilterListboxRef>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  const resetAll = () => {
    verticalFilterRef.current?.reset()
    companySizeFilterRef.current?.reset()
    remoteFilterRef.current?.reset()
    seniorityFilterRef.current?.reset()
    contractTypeFilterRef.current?.reset()
  }

  return (
    <div className='flex flex-col items-center'>
      <h1>CDRjobs - {clientKey}</h1>
      <p>Find Job</p>
      <p>Powered by CDR Jobs © 2024</p>
      <LocationCombobox onSelect={(sug) => { console.log('loc selected', sug?.name) }} />
      <CategoryListbox onSelect={(cat) => { console.log('cat selected', cat) }} />
      <div>
        <FilterListbox ref={verticalFilterRef} text='Vertical' valueMap={verticals} onSelect={(verts) => { console.log('verts selected', verts) }}/>
        <FilterListbox ref={companySizeFilterRef} text='Company Size' valueMap={companySizes} onSelect={(sizes) => { console.log('sizes selected', sizes) }}/>
        <FilterListbox ref={remoteFilterRef} text='Remote' valueMap={remote} onSelect={(remotes) => { console.log('remotes selected', remotes) }}/>
        <FilterListbox ref={seniorityFilterRef} text='seniority' valueMap={seniority} onSelect={(seniorities) => { console.log('seniorities selected', seniorities) }}/>
        <FilterListbox ref={contractTypeFilterRef} text='Contract Type' valueMap={contractTypes} onSelect={(contractTypes) => { console.log('contractTypes selected', contractTypes) }}/>
      </div>
      <Button text='Search' onClick={() => console.log('click')} />
      <Button text='Reset' onClick={resetAll} />
    </div>
  )
}

export default Page