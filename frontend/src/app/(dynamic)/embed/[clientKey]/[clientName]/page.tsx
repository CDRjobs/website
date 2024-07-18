'use client'

import { useParams } from 'next/navigation'
import Pym from 'pym.js'
import { useState, useEffect, useRef, useCallback } from 'react'
import MainButton from '@/components/atoms/MainButton'
import LocationCombobox, { LocationComboboxRef } from '@/components/molecules/LocationCombobox'
import CategoryListbox, { CategoryListboxRef } from '@/components/molecules/CategoryListbox'
import FilterListbox, { FilterListboxRef } from '@/components/molecules/FilterListbox'
import JobCard, { Job } from '@/components/molecules/JobCard'
import { gql, useLazyQuery } from '@apollo/client'
import { compact, first, intersection, isEmpty, last, map, omit, values } from 'lodash/fp'
import { companySizes, contractNatures, contractTimes, contractTypes, remote, seniority, verticals, afenOnly } from './filters'
import { Filters, Pagination } from './types'

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
        currency
        minSalary
        maxSalary
        seniority
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
  let mediaWatcher = window.matchMedia('(max-width: 640px)')
  const { clientKey, clientName } = useParams() as { [key: string]: string }

  const [isClient, setIsClient] = useState(false)
  const locationFilterRef = useRef<LocationComboboxRef>(null)
  const categoryFilterRef = useRef<CategoryListboxRef>(null)
  const verticalFilterRef = useRef<FilterListboxRef>(null)
  const companySizeFilterRef = useRef<FilterListboxRef>(null)
  const remoteFilterRef = useRef<FilterListboxRef>(null)
  const seniorityFilterRef = useRef<FilterListboxRef>(null)
  const contractTypeFilterRef = useRef<FilterListboxRef>(null)
  const afenOnlyFilterRef = useRef<FilterListboxRef>(null)
  
  const [querySearchJobs] = useLazyQuery(SearchJobQuery)
  const [filters, setFilters] = useState<Filters>({})
  const [pagination, setPagination] = useState<Pagination>({ limit: mediaWatcher.matches ? 10 : 12 })
  const [jobs, setJobs] = useState<Job[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loadingJobs, setLoadingJobs] = useState(true)
  const [loadMore, setLoadMore] = useState(true)
  const [isMobile, setIsMobile] = useState(mediaWatcher.matches)

  const isDaccoalition = clientName.toLowerCase() === 'daccoalition'
  const isAfen = clientName.toLowerCase() === 'afen'
  const customVerticals = isDaccoalition ? omit(['forest', 'biomass', 'mCdr', 'soil'], verticals) : verticals

  const setFilterFor = (filterName: string, value: unknown) => {
    if (filterName === 'afenOnly') {
      setFilters(prev => ({
        ...prev,
        openSearchToCountries: value !== 'yes',
      }))
    } else if (filterName === 'contractType') {
      const contractTime = intersection(Object.keys(contractTimes))(value as [])
      const contractNature = intersection(Object.keys(contractNatures))(value as [])

      setFilters(prev => ({
        ...prev,
        contractTime,
        contractNature,
      }))
    } else {
      setFilters(prev => ({
        ...prev,
        [filterName]: value ? value : undefined,
      }))
    }
  }
  const onLocationSelect = useCallback((value: unknown) => setFilterFor('location', value), [])
  const onDisciplineSelect = useCallback((value?: string | null) => setFilterFor('discipline', value), [])
  const onVerticalSelect = useCallback((value: string[] | string | null) => setFilterFor('cdrCategory', value), [])
  const onCompanySizeSelect = useCallback((value: string[] | string | null) => setFilterFor('companySize', value), [])
  const onRemoteSelect = useCallback((value: string[] | string | null) => setFilterFor('remote', value), [])
  const onSenioritySelect = useCallback((value: string[] | string | null) => setFilterFor('seniority', value), [])
  const onContractTypeSelect = useCallback((value: string[] | string | null) => setFilterFor('contractType', value), [])
  const onAfenOnlySelect = useCallback((value: string[] | string | null) => setFilterFor('afenOnly', value), [])

  const queryJobs = async (queryPagination: Pagination, queryFilters: Filters) => {
    const { data } = await querySearchJobs({ variables: { clientKey, filters: queryFilters, pagination: queryPagination } })
    return { total: data.searchJobs.pagination.total, jobs: data.searchJobs.data as Job[] }
  }

  const queryMoreJobs = async () => {
    setLoadingJobs(true)
    const { total, jobs: moreJobs } = await queryJobs(pagination, filters)
    const newJobs = jobs.concat(moreJobs)
    setPagination({ ...pagination, takeAfter: last(newJobs)?.publishedAt, countAfter: first(newJobs)?.publishedAt })
    setJobs(newJobs)
    setTotalCount(total)
    if (moreJobs.length < pagination.limit || newJobs.length >= total) {
      setLoadMore(false)
    }
    setLoadingJobs(false)
  }

  const queryNewJobs = async ({ reset = false } = {}) => {
    setLoadingJobs(true)
    const { total, jobs: newJobs } = await queryJobs({ limit: pagination.limit }, reset ? {} : filters)
    setPagination({ ...pagination, takeAfter: last(newJobs)?.publishedAt, countAfter: first(newJobs)?.publishedAt })
    setJobs(newJobs)
    setTotalCount(total)
    setLoadMore(newJobs.length < total)
    setLoadingJobs(false)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { queryNewJobs() }, [])
  useEffect(() => {
    new Pym.Child().sendHeight()
    setTimeout(() => new Pym.Child().sendHeight(), 500)
  })
  useEffect(() => { setIsClient(true) }, [])
  useEffect(() => {
    const updateIsMobile = () => setIsMobile(mediaWatcher.matches)
    mediaWatcher.addEventListener('change', updateIsMobile)
    return () => mediaWatcher.removeEventListener('change', updateIsMobile)
  }, [setIsMobile, mediaWatcher])

  const resetAll = () => {
    locationFilterRef.current?.reset()
    categoryFilterRef.current?.reset()
    verticalFilterRef.current?.reset()
    companySizeFilterRef.current?.reset()
    remoteFilterRef.current?.reset()
    seniorityFilterRef.current?.reset()
    contractTypeFilterRef.current?.reset()
    afenOnlyFilterRef.current?.reset()
    queryNewJobs({ reset: true })
  }

  if (!isClient) {
    return null
  }

  const areFiltersUsed = map(isEmpty, values(filters)).some(isEmpty => !isEmpty)

  const content = <div className='flex px-4 py-4 min-h-96 max-w-[89rem] flex-col items-center gap-3 rounded-[1.25rem] bg-white sm:py-6 sm:gap-2.5'>
    <div className='flex py-3 flex-col justify-center items-start gap-3 self-stretch sm:gap-6 sm:pt-0'>

      <div className='flex flex-col items-center sm:content-center gap-3 self-stretch flex-wrap sm:flex-row sm:gap-6'>
        <div className='flex py-1 flex-col content-center items-start gap-1 max-sm:self-stretch sm:flex-[1_0_0]'>
          <p className='text-lg font-medium leading-[1.375rem] sm:text-[1.6875rem] sm:leading-7'><a href="https://cdrjobs.earth" target='_blank'>Find job</a></p>
          <div className='flex items-center gap-1.5 self-stretch'>
            <p className='text-[#7087F0] text-sm font-medium leading-4 text-nowrap'><a href="https://cdrjobs.earth" target='_blank'>Powered by <span className='font-bold'>CDRjobs © 2024</span></a></p>
          </div>
        </div>
        <LocationCombobox ref={locationFilterRef} onSelect={onLocationSelect} />
        <CategoryListbox ref={categoryFilterRef} onSelect={onDisciplineSelect} />
        {!isMobile && <MainButton onClick={() => queryNewJobs()} loading={loadingJobs}>Search</MainButton>}
      </div>
      
      <div className='flex sm:h-10 py-2 items-center gap-3 self-stretch max-sm:overflow-scroll'>
        <FilterListbox ref={verticalFilterRef} text='Vertical' valueMap={customVerticals} onSelect={onVerticalSelect} multiple />
        <FilterListbox ref={companySizeFilterRef} text='Company Size' valueMap={companySizes} onSelect={onCompanySizeSelect} multiple />
        <FilterListbox ref={remoteFilterRef} text='Remote' valueMap={remote} onSelect={onRemoteSelect} multiple />
        <FilterListbox ref={seniorityFilterRef} text='Seniority' valueMap={seniority} onSelect={onSenioritySelect} multiple />
        <FilterListbox ref={contractTypeFilterRef} text='Contract Type' valueMap={contractTypes} onSelect={onContractTypeSelect} multiple />
        {isAfen && <FilterListbox ref={afenOnlyFilterRef} text='AFEN only' valueMap={afenOnly} onSelect={onAfenOnlySelect}/>}
      </div>

      {isMobile && <MainButton onClick={() => queryNewJobs()} loading={loadingJobs}>Search</MainButton>}

    </div>

    <div className='flex pb-3 sm:py-3 justify-center items-center gap-2.5 self-stretch border-b border-solid border-[#9F9F9F]'>
      <p className='flex-[1_0_0] text-xl sm:text-2xl font-medium leading-[1.375rem] sm:leading-7'>All Jobs</p>
    </div>

    <div className='flex py-2 items-center gap-1.5 self-stretch'>
      <p className='flex-[1_0_0] text-sm sm:text-base font-medium leading-[1.125rem]'>{totalCount === 0 ? 'No results' : `${totalCount} job${totalCount > 1 ? 's' : ''}`}</p>
      <button className={`${areFiltersUsed ? 'text-[#7087F0]' : 'text-[#DBE0F1]' } text-right text-sm sm:text-base font-semibold leading-[1.125rem] underline`} onClick={resetAll}>Reset filters</button>
    </div>

    <div className='flex py-3 sm:p-3 justify-center items-center content-center gap-3 self-stretch flex-wrap'>
      {jobs.map((job) => <JobCard key={job.id} job={job} />)}
    </div>

    {loadMore && <MainButton onClick={queryMoreJobs} loading={loadingJobs} fixedSize>Load More Jobs</MainButton>}
  </div>

  return isMobile
    ? content
    : <div className='flex justify-center'>
      {content}
    </div>
}

export default Page