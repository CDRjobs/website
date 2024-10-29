'use client'

import JobCard, { Job } from '@/components/molecules/JobCard'
import Carousel from '@/components/organisms/Carousel'
import { gql, useLazyQuery } from '@apollo/client'
import { useParams, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Pym from 'pym.js'

const verticalWording = {
  directAirCapture: 'Direct Air Capture',
  biomass: 'Biomass',
  mineralization: 'Mineralization',
  mCdr: 'Ocean',
  soil: 'Farming',
  forest: 'Forest',
  utilization: 'Utilization',
  enhancedWeathering: 'Enhanced Weathering',
  ecosystemServices: 'Ecosystem Services',
}

type Verticals = Array<keyof typeof verticalWording>

type Company = {
  id: string
  name: string
}

// TODO: to factorize with ../page.tsx
const SearchJobsQuery = gql`
  query searchJobs ($clientKey: String!, $filters: jobFiltersInput!, $pagination: paginationInput!) {
    searchJobs (clientKey: $clientKey, filters: $filters, pagination: $pagination) {
      pagination {
        total
      }
      data {
        id
        title
        sourceUrl
        locations {
          country
          city
        }
        remote
        disciplines
        contractTypes
        currency
        minSalary
        maxSalary
        minYearsOfExperience
        guessedMinYearsOfExperience
        publishedAt
        company {
          id
          name
          companySize
          logoUrl
          cdrCategory
        }
      }
    }
  }
`

const SearchCompaniesQuery = gql`
  query searchCompanies ($clientKey: String!, $ids: [String!]!) {
    searchCompanies (clientKey: $clientKey, ids: $ids) {
      data {
        id
        name
      }
    }
  }
`

const Page = () => {
  const { clientKey } = useParams() as { [key: string]: string }
  const searchParams = useSearchParams()
  const [querySearchJobs] = useLazyQuery(SearchJobsQuery)
  const [querySearchCompanies] = useLazyQuery(SearchCompaniesQuery)
  const [totalCount, setTotalCount] = useState<number>(0)
  const [jobs, setJobs] = useState<Job[]>([])
  const [companies, setCompanies] = useState<Company[]>([])

  const speed = Number(searchParams.get('speed') || '6500')
  const verticals = (searchParams.get('verticals') ? searchParams.get('verticals')!.split(',') : []) as Verticals
  const companiesIds = (searchParams.get('companies') ? searchParams.get('companies')!.split(',') : []) as string[]

  useEffect(() => {
    const fetchJobs = async () => {
      const pagination = { limit: companiesIds ? 150 : 20 }
      const filters = { cdrCategory: verticals, companies: companiesIds }
      const { data: companiesData } = await querySearchCompanies({ variables: { clientKey, ids: companiesIds } })
      setCompanies(companiesData.searchCompanies.data)
      const { data } = await querySearchJobs({ variables: { clientKey, filters, pagination } })
      setJobs(data.searchJobs.data)
      setTotalCount(data.searchJobs.pagination.total)
    }

    fetchJobs()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientKey, querySearchJobs])

  useEffect(() => {
    new Pym.Child().sendHeight()
    setTimeout(() => new Pym.Child().sendHeight(), 500)
  })
  
  const jobcards = jobs.map((job) => <JobCard key={job.id} job={job} borderStyle='left' />)

  let categoriesText = 'in Carbon Dioxide Removal'
  if (verticals.length === 1) {
    categoriesText = `in ${verticalWording[verticals[0]]}`
  } else if (verticals.length > 1) {
    categoriesText = `in ${verticals.slice(0, -1).map(v => verticalWording[v]).join(', ')} and ${verticalWording[verticals[verticals.length - 1]]}`
  }

  let companiesText = ''
  if (companies.length === 1) {
    companiesText = `at ${companies[0].name}`
  } else if (companies.length > 1) {
    companiesText = `at ${companies.slice(0, -1).map(c => c.name).join(', ')} and ${companies[companies.length - 1].name}`
  }

  const jobText = companies.length ? companiesText : categoriesText
  
  return <div className='w-full py-4'>
    <p className='text-black text-center text-lg font-normal leading-4 font-inter'>There are <span className='font-semibold text-[#7087F0]'>{totalCount}</span> jobs available {jobText} today</p>
    <div className='mt-6 mb-4'>
      <Carousel slides={jobcards} slideWidth={330} slideHeight={276} speed={speed} />
    </div>
    <p className='text-base px-4 font-inter'>Couldn&apos;t find what you are looking for? Check out all available opening on the <a className='underline text-[#7087F0]' href='https://www.cdrjobs.earth/job-board'>CDRjobs Board</a>.</p>
  </div>
}



export default Page
