import { ContractType, CountryCode, Discipline, Remote } from '@prisma/client'
import { format } from 'date-fns'
import { compact, groupBy, map } from 'lodash/fp'

type Seeker = {
  id: string,
  email: string,
  seekingDisciplines: Discipline[],
  seekingContractTypes: ContractType[],
  sentFirstEmailMatching: boolean,
}

type SeekerJob = {
  title: string,
  company: {
    name: string
  },
  locations: {
    city: string | null,
    country: CountryCode
  }[]
  minSalary: number | null,
  maxSalary: number | null,
  currency: string | null,
  contractTypes: ContractType[],
  disciplines: Discipline[],
  remote: Remote,
  publishedAt: Date,
  sourceUrl: string,
}

const countryNames = new Intl.DisplayNames(['en'], { type: 'region', style: 'long' })

export const matchToCSVRow = ({ jobSeeker, jobs }: { jobSeeker: Seeker, jobs : SeekerJob[] }) => {
  return {
    id: jobSeeker.id,
    email: jobSeeker.email,
    seekingDisciplines: jobSeeker.seekingDisciplines.join(', '),
    contractTypes: jobSeeker.seekingContractTypes.join(', '),
    sentFirstEmailMatching: jobSeeker.sentFirstEmailMatching,
    ...(jobs.reduce((jobs, job, index) => {
      let jobLocationLine = ''
      if (!job.locations.length) {
        jobLocationLine = 'worlwide'
      } else {
        const citiesByCountryCode = groupBy('country', job.locations)
        const locationTexts = []
        for (const countryCode of Object.keys(citiesByCountryCode)) {
          const cities = compact(map('city', citiesByCountryCode[countryCode]))
          if (cities.length) {
            locationTexts.push(`${cities.join(', ')} - ${countryNames.of(countryCode.toUpperCase())}`)
          } else {
            locationTexts.push(countryNames.of(countryCode.toUpperCase()))
          }
        }
        jobLocationLine = locationTexts.join('; ')
      }


      const jobLine = `TITLE: ${job.title} / COMPANY: ${job.company.name} / SALARY: ${job.minSalary}-${job.maxSalary} (${job.currency}) / LOCATION: ${jobLocationLine} / CONTRACT TYPE: ${job.contractTypes.join(', ')} / REMOTE: ${job.remote} / DATE POSTED: ${format(job.publishedAt, 'yyyy-MM-dd')} / LINK: ${job.sourceUrl}`
      return Object.assign(jobs, { [`job${index + 1}`]: jobLine })
    }, {}))
  }
}