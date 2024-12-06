'use client'

import { Job } from '@/services/job'
import JobList from '@/components/organisms/JobList'
import { useLazyQuery } from '@apollo/client'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Pym from 'pym.js'
import SearchJobsQuery from '@/app/(dynamic)/embed/[clientKey]/[clientName]/_graphql/searchJobs'
import SearchCompaniesQuery from '@/app/(dynamic)/embed/[clientKey]/[clientName]/_graphql/searchCompanies'
import { useClient } from '@/context/ClientContext'

type Company = {
  id: string
  name: string
}

const Page = () => {
  const searchParams = useSearchParams()
  const [querySearchJobs] = useLazyQuery(SearchJobsQuery)
  const [querySearchCompanies] = useLazyQuery(SearchCompaniesQuery)
  const [jobs, setJobs] = useState<Job[]>([])
  const [company, setCompany] = useState<Company>()
  const [isLoading, setIsLoading] = useState(true)
  const { client } = useClient()

  const companyId = searchParams.get('company')
  if (!companyId) {
    throw new Error('Missing company query param')
  }

  useEffect(() => {
    const fetchJobs = async () => {
      const { data: companiesData } = await querySearchCompanies({ variables: { clientKey: client.key, ids: [companyId] } })
      setCompany(companiesData.searchCompanies.data[0])

      const { data } = await querySearchJobs({ variables: { clientKey: client.key, filters: { companies: [companyId] }, pagination: {} } })
      setJobs(data.searchJobs.data)

      setIsLoading(false)
    }

    fetchJobs()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client.key, querySearchJobs])

  useEffect(() => {
    new Pym.Child().sendHeight()
    setTimeout(() => new Pym.Child().sendHeight(), 500)
  })
  
  return <div className='w-full'>
    {!isLoading && <JobList jobs={jobs} title={`${company?.name}'s jobs`} />}
  </div>
}

export default Page
