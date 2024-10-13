'use client'

import JobCard, { Job } from '@/components/molecules/JobCard'
import Carousel from '@/components/organisms/Carousel'
import { gql, useLazyQuery } from '@apollo/client'
import { useParams, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Pym from 'pym.js'

// TODO: to factorize with ../page.tsx
const SearchJobQuery = gql`
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

const Page = () => {
  const { clientKey } = useParams() as { [key: string]: string }
  const searchParams = useSearchParams()
  const [querySearchJobs] = useLazyQuery(SearchJobQuery)
  const [totalCount, setTotalCount] = useState<number>(0)
  const [jobs, setJobs] = useState<Job[]>([])

  const speed = Number(searchParams.get('speed') || '6500')
  const verticals = searchParams.get('verticals') ? searchParams.get('verticals')!.split(',') : []

  useEffect(() => {
    const fetchJobs = async () => {
      const pagination = { limit: 20 }
      const filters = { cdrCategory: verticals }
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
  
  return <div className='w-full py-4'>
    <p className='text-black text-center font-normal leading-4 font-inter'>There are <span className='font-semibold text-[#7087F0]'>{totalCount}</span> jobs available in Direct Air Catpure today</p>
    <div className='mt-4 mb-2'>
      <Carousel slides={jobcards} slideWidth={330} slideHeight={276} speed={speed} />
    </div>
    <p className='text-sm px-4 font-inter'>Couldn&apos;t find what you are looking for? Check out all available opening on the <a className='underline text-[#7087F0]' href='https://www.cdrjobs.earth/job-board'>CDRjobs Board</a>.</p>
  </div>
}



export default Page
