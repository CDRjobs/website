import Image from 'next/image'
import { formatDistance } from 'date-fns'
import { map, uniq } from 'lodash/fp'

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
  yes: 'Remote',
  hybrid: 'Hybrid',
  no: 'On-site',
}

const seniority = {
  entryLevel: 'Entry level',
  earlyStage: 'Early stage',
  midLevel: 'Mid-level',
  senior: 'Senior',
  verySenior: 'Very senior',
}

type Props = {
  job: {
    id: string
    title: string
    sourceUrl: string
    locations: { city?: string, country: string }[]
    remote: keyof typeof remote
    currency: string
    minSalary?: number
    maxSalary?: number
    seniority?: keyof typeof seniority
    publishedAt: string
    company: {
      id: string
      name: string
      companySize: keyof typeof companySizes
      logoUrl: string
      cdrCategory: keyof typeof verticals
    }
  }
}

const OpenInNewTabIcon = () => <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M14.5011 8.92436V13.079C14.5011 13.3238 14.4038 13.5587 14.2307 13.7318C14.0575 13.905 13.8227 14.0022 13.5778 14.0022H3.42211C3.17725 14.0022 2.94242 13.905 2.76928 13.7318C2.59614 13.5587 2.49887 13.3238 2.49887 13.079V2.92325C2.49887 2.67839 2.59614 2.44356 2.76928 2.27041C2.94242 2.09727 3.17725 2 3.42211 2H7.57673M11.2697 2H14.5011M14.5011 2V5.23137M14.5011 2L8.49998 8.00112" stroke="white" stroke-width="0.923249" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

const countryNames = new Intl.DisplayNames(['en'], { type: 'region', style: 'long' })
const currencyNames = new Intl.DisplayNames(['en'], { type: 'currency', style: 'short' })

const JobCard = ({ job }: Props) => {

  let locationText = 'Worldwide'
  if (job.locations.length === 1) {
    const loc = job.locations[0]
    const countryName = countryNames.of(loc.country) || ''
    locationText = loc.city ? `${loc.city}, ${countryName}` : countryName
  } else {
    const countries = uniq(map('country', job.locations))
    if (countries.length === 1) {
      locationText = countryNames.of(countries[0]) || ''
    }
  }

  let salaryText = ''
  if (job.minSalary || job.maxSalary) {
    if (job.minSalary && job.maxSalary && job.minSalary !== job.maxSalary) {
      salaryText = `${Math.floor(job.minSalary/1000)}K - ${Math.ceil(job.minSalary/1000)}K`
    } else {
      salaryText = `${Math.round((job.minSalary! || job.maxSalary!) / 1000)}K`
    }
    salaryText +=  ` (${currencyNames.of(job.currency)})`
  }

  const onClickOnViewJob = () => {
    window.open(job.sourceUrl, '_blank')?.focus()
  }
  
  return <div>
    <Image src={job.company.logoUrl} alt={`Logo of the company ${job.company.name}`} />
    <div className='flex justify-between w-full'>
      <p>{companySizes[job.company.companySize]} employees</p>
    </div>
    <div className='flex justify-between w-full'>
      <p>{job.company.name}</p>
      <p>{formatDistance(new Date(job.publishedAt), new Date())}</p>
    </div>
    <div className='flex justify-between w-full'>
      <p>{locationText}</p>
      <p>{remote[job.remote]}</p>
    </div>
    <div className='flex justify-between w-full'>
      <p>{salaryText}</p>
      <p>{job.seniority && seniority[job.seniority]}</p>
    </div>
    <div className='flex justify-between w-full'>
      <p>{verticals[job.company.cdrCategory]}</p>
      <button onClick={onClickOnViewJob}>View Job <OpenInNewTabIcon /></button>
    </div>

  </div>
}

export default JobCard