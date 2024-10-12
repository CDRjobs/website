'use client'

import JobCard, { Job } from '@/components/molecules/JobCard'
import Carousel from '@/components/organisms/Carousel'
import { gql, useLazyQuery } from '@apollo/client'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'


// TODO: to factorize with ../page.tsx
const SearchJobQuery = gql`
  query searchJobs ($clientKey: String!, $pagination: paginationInput!) {
    searchJobs (clientKey: $clientKey, pagination: $pagination) {
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
  const [querySearchJobs] = useLazyQuery(SearchJobQuery)
  const [totalCount, setTotalCount] = useState<number>(0)
  const [jobs, setJobs] = useState<Job[]>([])

  useEffect(() => {
    const fetchJobs = async () => {
      const pagination = { limit: 20 }
      const { data } = await querySearchJobs({ variables: { clientKey, pagination } })
      setJobs(data.searchJobs.data)
      setTotalCount(data.searchJobs.pagination.total)
    }

    fetchJobs()
  }, [clientKey, querySearchJobs])
  
  const jobcards = jobs.map((job) => <JobCard key={job.id} job={job} />)
  
  return <div className='w-full py-4'>
    <div className='flex px-4 py-1 flex-col content-center items-start gap-1 max-sm:self-stretch sm:flex-[1_0_0] mb-4 sm:mb-0'>
      <p className='text-lg font-medium leading-[1.375rem] sm:text-[1.6875rem] sm:leading-7'><a href="https://cdrjobs.earth" target='_blank'>CDR Jobs</a></p>
      <div className='flex items-center gap-1.5 self-stretch'>
        <p className='text-[#7087F0] text-sm font-medium leading-4 text-nowrap'><a href="https://cdrjobs.earth" target='_blank'>Powered by <span className='font-bold'>CDRjobs © 2024</span></a></p>
      </div>
    </div>
    <p className='text-black text-center font-normal leading-4 font-inter'>There are <span className='font-semibold text-[#7087F0]'>{totalCount}</span> jobs available in CDR today</p>
    <div className='mt-4 mb-2'>
      <Carousel slides={jobcards} slideWidth={330} slideHeight={276} />
    </div>
    <p className='text-sm px-4 font-inter'>Couldn&apos;t find what you are looking for? Check out all available opening on the <a className='underline text-[#7087F0]' href='https://www.cdrjobs.earth/job-board'>CDRjobs Board</a>.</p>
  </div>
}



export default Page
