import { ContractType, CountryCode, Discipline, Remote } from '@prisma/client'
import { format } from 'date-fns'
import { locationsToText } from '../../domain/location'

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

export const matchToCSVRow = ({ jobSeeker, jobs }: { jobSeeker: Seeker, jobs : SeekerJob[] }) => {
  return {
    id: jobSeeker.id,
    email: jobSeeker.email,
    seekingDisciplines: jobSeeker.seekingDisciplines.join(', '),
    contractTypes: jobSeeker.seekingContractTypes.join(', '),
    sentFirstEmailMatching: jobSeeker.sentFirstEmailMatching,
    ...(jobs.reduce((jobs, job, index) => {
      const jobLine = `TITLE: ${job.title} / COMPANY: ${job.company.name} / SALARY: ${job.minSalary}-${job.maxSalary} (${job.currency}) / LOCATION: ${locationsToText(job.locations)} / CONTRACT TYPE: ${job.contractTypes.join(', ')} / REMOTE: ${job.remote} / DATE POSTED: ${format(job.publishedAt, 'yyyy-MM-dd')} / LINK: ${job.sourceUrl}`
      
      return Object.assign(jobs, { [`job${index + 1}`]: jobLine })
    }, {}))
  }
}