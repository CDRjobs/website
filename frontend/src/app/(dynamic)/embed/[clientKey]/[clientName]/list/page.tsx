'use client'

import { Job } from '@/services/job'
import JobList from '@/components/organisms/JobList'
import { gql, useLazyQuery } from '@apollo/client'
import { useParams, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Pym from 'pym.js'

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
  const [jobs, setJobs] = useState<Job[]>([])
  const [company, setCompany] = useState<Company>()

  const companyId = searchParams.get('company')
  if (!companyId) {
    throw new Error('Missing company query param')
  }

  useEffect(() => {
    const fetchJobs = async () => {
      const { data: companiesData } = await querySearchCompanies({ variables: { clientKey, ids: [companyId] } })
      setCompany(companiesData.searchCompanies.data[0])

      const { data } = await querySearchJobs({ variables: { clientKey, filters: { companies: [companyId] }, pagination: {} } })
      setJobs(data.searchJobs.data)
    }

    fetchJobs()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientKey, querySearchJobs])

  useEffect(() => {
    new Pym.Child().sendHeight()
    setTimeout(() => new Pym.Child().sendHeight(), 500)
  })
  
  return <div className='w-full'>
    <JobList jobs={jobs} title={`${company?.name}'s jobs`} />
  </div>
}

export default Page
