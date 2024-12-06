'use client'

import JobCard from '@/components/molecules/JobCard'
import { Job } from '@/services/job'
import Carousel from '@/components/organisms/Carousel'
import { useLazyQuery } from '@apollo/client'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Pym from 'pym.js'
import SearchJobsQuery from '@/app/(dynamic)/embed/[clientKey]/[clientName]/_graphql/searchJobs'
import SearchCompaniesQuery from '@/app/(dynamic)/embed/[clientKey]/[clientName]/_graphql/searchCompanies'
import { VERTICAL_SHORT_WORDING } from '@/constants/wording'
import { Verticals } from '@/types/globals'
import { useClient } from '@/context/ClientContext'
import useAddUtmParams from '@/hooks/useAddUtmParams'

type Company = {
  id: string
  name: string
}

const Page = () => {
  const searchParams = useSearchParams()
  const [querySearchJobs] = useLazyQuery(SearchJobsQuery)
  const [querySearchCompanies] = useLazyQuery(SearchCompaniesQuery)
  const [totalCount, setTotalCount] = useState<number>(0)
  const [jobs, setJobs] = useState<Job[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { client } = useClient()
  const addUtmParams = useAddUtmParams('carousel')

  const speed = Number(searchParams.get('speed') || '6500')
  const verticals = (searchParams.get('verticals') ? searchParams.get('verticals')!.split(',') : []) as Verticals[]
  const companiesIds = (searchParams.get('companies') ? searchParams.get('companies')!.split(',') : []) as string[]

  useEffect(() => {
    const fetchJobs = async () => {
      const pagination = { limit: companiesIds ? 150 : 20 }
      const filters = { cdrCategory: verticals, companies: companiesIds }
      const { data: companiesData } = await querySearchCompanies({ variables: { clientKey: client.key, ids: companiesIds } })
      setCompanies(companiesData.searchCompanies.data)
      const { data } = await querySearchJobs({ variables: { clientKey: client.key, filters, pagination } })
      const jobs = data.searchJobs.data.map((job: Job) => ({ ...job, sourceUrl: addUtmParams(job.sourceUrl)}))
      setJobs(jobs)
      setTotalCount(data.searchJobs.pagination.total)
      setIsLoading(false)
    }

    fetchJobs()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client.key, querySearchJobs])

  useEffect(() => {
    new Pym.Child().sendHeight()
    setTimeout(() => new Pym.Child().sendHeight(), 500)
  })
  
  const jobcards = jobs.map((job) => <JobCard key={job.id} job={job} borderStyle='left' />)

  let categoriesText = <>in <strong>Carbon Dioxide Removal</strong></>
  if (verticals.length === 1) {
    categoriesText = <>in <strong>{VERTICAL_SHORT_WORDING[verticals[0]]}</strong></>
  } else if (verticals.length > 1) {
    categoriesText = <>in {verticals.slice(0, -1).map((v, i) => <span key={`cat-${i}`}>{i !== 0 && ', '}<strong>{VERTICAL_SHORT_WORDING[v]}</strong></span>)} and <strong>{VERTICAL_SHORT_WORDING[verticals[verticals.length - 1]]}</strong></>
  }

  let companiesText
  if (companies.length === 1) {
    companiesText = <>at <strong>{companies[0].name}</strong></>
  } else if (companies.length > 1) {
    companiesText = <>at {companies.slice(0, -1).map((c, i) => <span key={`comp-${i}`}>{i !== 0 && ', '}<strong>{c.name}</strong></span>)} and <strong>{companies[companies.length - 1].name}</strong></>
  }

  const jobText = companies.length ? companiesText : categoriesText
  
  return <div className='w-full py-4'>
    {!isLoading && <div>
      <p className='text-black text-center text-lg font-normal leading-4 font-inter'>There are <span className='font-semibold text-[#7087F0]'>{totalCount}</span> jobs available {jobText} today</p>
      <div className='mt-6 mb-4'>
        <Carousel slides={jobcards} slideWidth={330} slideHeight={276} speed={speed} />
      </div>
      <p className='text-base px-4 font-inter'>Couldn&apos;t find what you are looking for? Check out all available opening on the <a className='underline text-[#7087F0]' href='https://www.cdrjobs.earth/job-board'>CDRjobs Board</a>.</p>
    </div>}
  </div>
}

export default Page
