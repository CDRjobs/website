import urlJoin from 'url-join'
import { map, uniq } from 'lodash/fp'
import formatDistanceFromNow from '@/utils/formatDistanceFromNow'

const verticals = {
  forest: 'Afforestation/Reforestation',
  biomass: 'BiCRS',
  directAirCapture: 'DACCS',
  ecosystemServices: 'Ecosystem Services',
  mCdr: 'mCDR',
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

export type Job = {
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

type Props = { 
  job: Job
}

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

  let salaryText = 'Not Available'
  if (job.minSalary || job.maxSalary) {
    if (job.minSalary && job.maxSalary && job.minSalary !== job.maxSalary) {
      salaryText = `${Math.floor(job.minSalary/1000)}K - ${Math.ceil(job.maxSalary/1000)}K`
    } else {
      salaryText = `${Math.round((job.minSalary! || job.maxSalary!) / 1000)}K`
    }
    salaryText +=  ` (${currencyNames.of(job.currency)})`
  }

  const onClickOnViewJob = () => {
    window.open(job.sourceUrl, '_blank')?.focus()
  }
  
  return <div className='flex w-full sm:w-80 p-3 flex-col justify-center items-center gap-2 rounded-lg shadow-[0px_2px_4px_0px_rgba(0,0,0,0.12)]'>
    
    <div className='flex py-1 flex-col justify-center items-start gap-1.5 self-stretch'>
    {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={urlJoin(process.env.NEXT_PUBLIC_PUBLIC_SERVER_URL!, job.company.logoUrl)} alt={`Logo of the company ${job.company.name}`} className='w-14 shrink-0 rounded-[0.3125rem]' />
      <div className='flex w-full text-[#777]'>
        <p className='text-sm font-medium leading-4 flex-[1_0_0]'>{job.company.name}</p>
        <p className='text-xs font-semibold leading-[0.875rem]'>{formatDistanceFromNow(new Date(job.publishedAt))} ago</p>
      </div>
    </div>

    <div className='flex flex-col justify-center items-center gap-3 self-stretch'>
      <p className='flex-[1_0_0] text-base font-medium leading-5 w-full'>{job.title}</p>

      <div className='flex flex-col justify-center items-start gap-3 self-stretch'>
        <div className='flex items-center gap-0.5 self-stretch'>
          <div className='flex items-center gap-1 flex-[1_0_0]'>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 10H10.6667V11.3333H12M12 7.33333H10.6667V8.66667H12M13.3334 12.6667H8.00004V11.3333H9.33337V10H8.00004V8.66667H9.33337V7.33333H8.00004V6H13.3334M6.66671 4.66667H5.33337V3.33333H6.66671M6.66671 7.33333H5.33337V6H6.66671M6.66671 10H5.33337V8.66667H6.66671M6.66671 12.6667H5.33337V11.3333H6.66671M4.00004 4.66667H2.66671V3.33333H4.00004M4.00004 7.33333H2.66671V6H4.00004M4.00004 10H2.66671V8.66667H4.00004M4.00004 12.6667H2.66671V11.3333H4.00004M8.00004 4.66667V2H1.33337V14H14.6667V4.66667H8.00004Z" fill="#777777"/>
            </svg>
            <p className='text-xs font-medium leading-[0.875rem]'>{companySizes[job.company.companySize]} employees</p>
          </div>
        </div>

        <div className='flex items-center gap-0.5 self-stretch'>
          <div className='flex items-center gap-1 flex-[1_0_0]'>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M7.539 14.841L7.542 14.844L7.544 14.846C7.67522 14.9454 7.83535 14.9993 8 14.9993C8.16465 14.9993 8.32478 14.9454 8.456 14.846L8.458 14.844L8.461 14.841L8.473 14.832C8.53736 14.7823 8.60071 14.7313 8.663 14.679C9.40857 14.0505 10.0936 13.3534 10.709 12.597C11.81 11.235 13 9.255 13 7C13 5.67392 12.4732 4.40215 11.5355 3.46447C10.5979 2.52678 9.32608 2 8 2C6.67392 2 5.40215 2.52678 4.46447 3.46447C3.52678 4.40215 3 5.67392 3 7C3 9.255 4.19 11.235 5.292 12.597C5.90743 13.3534 6.59243 14.0505 7.338 14.679L7.527 14.832L7.539 14.841ZM8 8.5C8.19698 8.5 8.39204 8.4612 8.57403 8.38582C8.75601 8.31044 8.92137 8.19995 9.06066 8.06066C9.19995 7.92137 9.31044 7.75601 9.38582 7.57403C9.4612 7.39204 9.5 7.19698 9.5 7C9.5 6.80302 9.4612 6.60796 9.38582 6.42597C9.31044 6.24399 9.19995 6.07863 9.06066 5.93934C8.92137 5.80005 8.75601 5.68956 8.57403 5.61418C8.39204 5.5388 8.19698 5.5 8 5.5C7.60218 5.5 7.22064 5.65804 6.93934 5.93934C6.65804 6.22064 6.5 6.60218 6.5 7C6.5 7.39782 6.65804 7.77936 6.93934 8.06066C7.22064 8.34196 7.60218 8.5 8 8.5Z" fill="#777777"/>
            </svg>
            <p className='text-xs font-medium leading-[0.875rem]'>{locationText}</p>
          </div>
            <p className='text-xs font-medium leading-[0.875rem] text-[#777]'>{remote[job.remote]}</p>
        </div>

        <div className='flex items-center gap-0.5 self-stretch'>
          <div className='flex items-center gap-1 flex-[1_0_0]'>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M8.01295 2C6.50729 2 5.13562 2.49733 4.32395 2.90367C4.25062 2.94033 4.18218 2.97611 4.11862 3.011C3.99262 3.07967 3.88529 3.14367 3.79995 3.2L4.72329 4.55933L5.15795 4.73233C6.85662 5.58933 9.13462 5.58933 10.8336 4.73233L11.327 4.47633L12.2 3.2C12.0189 3.08237 11.8309 2.97584 11.637 2.881C10.8293 2.479 9.49029 2 8.01329 2M5.86595 3.53867C5.53907 3.47715 5.21615 3.39612 4.89895 3.296C5.65929 2.95833 6.79229 2.6 8.01329 2.6C8.85895 2.6 9.65862 2.772 10.32 2.99C9.54495 3.099 8.71795 3.284 7.92995 3.51167C7.30995 3.691 6.58529 3.67167 5.86595 3.53867ZM11.186 5.22667L11.104 5.268C9.23529 6.21067 6.75662 6.21067 4.88795 5.268L4.81029 5.22867C2.00262 8.309 -0.140713 13.999 8.01295 13.999C16.1666 13.999 13.9713 8.20333 11.186 5.22667ZM7.66662 8C7.48981 8 7.32024 8.07024 7.19522 8.19526C7.07019 8.32029 6.99995 8.48986 6.99995 8.66667C6.99995 8.84348 7.07019 9.01305 7.19522 9.13807C7.32024 9.2631 7.48981 9.33333 7.66662 9.33333V8ZM8.33329 7.33333V7H7.66662V7.33333C7.313 7.33333 6.97386 7.47381 6.72381 7.72386C6.47376 7.97391 6.33329 8.31305 6.33329 8.66667C6.33329 9.02029 6.47376 9.35943 6.72381 9.60948C6.97386 9.85952 7.313 10 7.66662 10V11.3333C7.37662 11.3333 7.12962 11.1483 7.03762 10.889C7.02397 10.8466 7.00195 10.8073 6.97286 10.7735C6.94378 10.7398 6.90821 10.7122 6.86827 10.6924C6.82834 10.6726 6.78484 10.661 6.74035 10.6584C6.69586 10.6557 6.65128 10.6619 6.60926 10.6768C6.56723 10.6916 6.52861 10.7148 6.49568 10.7448C6.46275 10.7748 6.43618 10.8112 6.41754 10.8516C6.39889 10.8921 6.38856 10.9359 6.38714 10.9805C6.38572 11.025 6.39325 11.0694 6.40929 11.111C6.50119 11.371 6.67146 11.5961 6.89664 11.7554C7.12183 11.9146 7.39084 12 7.66662 12V12.3333H8.33329V12C8.68691 12 9.02605 11.8595 9.2761 11.6095C9.52614 11.3594 9.66662 11.0203 9.66662 10.6667C9.66662 10.313 9.52614 9.97391 9.2761 9.72386C9.02605 9.47381 8.68691 9.33333 8.33329 9.33333V8C8.62329 8 8.87029 8.185 8.96229 8.44433C8.97594 8.48676 8.99796 8.52602 9.02704 8.55979C9.05613 8.59356 9.09169 8.62115 9.13163 8.64094C9.17157 8.66073 9.21507 8.6723 9.25956 8.67498C9.30405 8.67766 9.34862 8.67139 9.39065 8.65654C9.43267 8.6417 9.47129 8.61857 9.50422 8.58854C9.53715 8.5585 9.56373 8.52217 9.58237 8.48169C9.60102 8.4412 9.61135 8.39739 9.61277 8.35285C9.61419 8.3083 9.60665 8.26392 9.59062 8.22233C9.49871 7.96231 9.32844 7.73719 9.10326 7.57798C8.87808 7.41876 8.60907 7.33329 8.33329 7.33333ZM8.33329 10V11.3333C8.5101 11.3333 8.67967 11.2631 8.80469 11.1381C8.92972 11.013 8.99995 10.8435 8.99995 10.6667C8.99995 10.4899 8.92972 10.3203 8.80469 10.1953C8.67967 10.0702 8.5101 10 8.33329 10Z" fill="#777777"/>
            </svg>
            <p className='text-xs font-medium leading-[0.875rem]'>{salaryText}</p>
          </div>
            <p className='text-xs font-medium leading-[0.875rem] text-[#777]'>{job.seniority && seniority[job.seniority]}</p>
        </div>
      </div>
      
      <div className='flex items-center gap-9 self-stretch'>
        <div className='flex flex-col py-1.5 px-2 justify-center items-start gap-2.5 flex-[1_0_0] rounded-sm bg-[#DBE0F1]'>
          <div className='flex items-center gap-2.5'>
            <p className='text-xs font-medium leading-[0.875rem] truncate'>{verticals[job.company.cdrCategory]}</p>
          </div>
        </div>
        <div className='flex flex-col items-start gap-2'>
          <button className='flex p-1.5 justify-center items-center gap-0.5 self-stretch rounded-sm bg-[#132D59]' onClick={onClickOnViewJob}>
            <p className='text-white text-sm font-medium leading-4'>ViewJob</p>
            <svg className='inline' width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.5011 8.92436V13.079C14.5011 13.3238 14.4038 13.5587 14.2307 13.7318C14.0575 13.905 13.8227 14.0022 13.5778 14.0022H3.42211C3.17725 14.0022 2.94242 13.905 2.76928 13.7318C2.59614 13.5587 2.49887 13.3238 2.49887 13.079V2.92325C2.49887 2.67839 2.59614 2.44356 2.76928 2.27041C2.94242 2.09727 3.17725 2 3.42211 2H7.57673M11.2697 2H14.5011M14.5011 2V5.23137M14.5011 2L8.49998 8.00112" stroke="white" strokeWidth="0.923249" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    

  </div>
}

export default JobCard