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
import { first, isArray, isEmpty, isNil, last, map, omit, values } from 'lodash/fp'
import { companySizes, contractTypes, remote, requiredExperience, verticals, afenOnly } from './filters'
import { Filters, Pagination } from './types'
import { trackDidSearch } from '@/services/telemetry'

const toGraphqlRequiredExperienceInput = (value: keyof typeof requiredExperience) => {
  const correspondingMap = {
    min0to2years: { min: 0, max: 2 },
    min3to5years: { min: 3, max: 5 },
    min6to9years: { min: 6, max: 9 },
    min10years: { min: 10, max: 100 },
  }
  return correspondingMap[value]
}

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

const formatToTrackDidSearchInput = (filters: Filters, isAfen: boolean, totalJobs: number, fromLoadMore: boolean, totalJobsDisplayed: number) => {
  return {
    company: {
      cdrCategory: filters.cdrCategory,
      companySize: filters.companySize,
    },
    ...omit(['cdrCategory', 'companySize', 'openSearchToCountries'], filters),
    contractTypesLength: filters.contractType?.length || 0,
    remoteLength: filters.remote?.length || 0,
    requiredExperienceLength: filters.requiredExperience?.length || 0,
    isAfenOnly: isAfen ? !(filters.openSearchToCountries) : undefined,
    totalJobs,
    fromLoadMore,
    totalJobsDisplayed,
    pageLocation: window.location.hostname + window.location.pathname,
  }
}

const Page = () => {
  let mediaWatcher = window.matchMedia('(max-width: 640px)')

  const { clientKey, clientName } = useParams() as { [key: string]: string }
  const isAfen = clientName.toLowerCase() === 'afen'
  const isDaccoalition = clientName.toLowerCase() === 'daccoalition'
  const isUSBC = clientName.toLowerCase() === 'usbiocharcoalition'
  const isNEP = clientName.toLowerCase() === 'negativeemissionsplatform'
  const isIBI = clientName.toLowerCase() === 'internationalbiocharinitiative'
  const isAirMiners = clientName.toLowerCase() === 'airminers'
  const isCRIA = clientName.toLowerCase() === 'carbonremovalindiaalliance'
  const isDVNE = clientName.toLowerCase() === 'deutscherverbandfurnegativeemissionen'

  const limit = isAfen ? 24 : 12
  const defaultFilters = isAfen ? { openSearchToCountries: false } : {}
  let clientVerticals: Partial<typeof verticals> = verticals
  if (isDaccoalition) {
    clientVerticals = omit(['forest', 'biomass', 'mCdr', 'enhancedWeathering', 'soil'], verticals)
  } else if (isUSBC) {
    clientVerticals = omit(['forest', 'directAirCapture', 'mCdr', 'mineralization', 'soil'], verticals)
  }
  
  const [isClient, setIsClient] = useState(false)
  const locationFilterRef = useRef<LocationComboboxRef>(null)
  const categoryFilterRef = useRef<CategoryListboxRef>(null)
  const verticalFilterRef = useRef<FilterListboxRef>(null)
  const companySizeFilterRef = useRef<FilterListboxRef>(null)
  const remoteFilterRef = useRef<FilterListboxRef>(null)
  const requiredExperienceFilterRef = useRef<FilterListboxRef>(null)
  const contractTypeFilterRef = useRef<FilterListboxRef>(null)
  const afenOnlyFilterRef = useRef<FilterListboxRef>(null)
  
  const [querySearchJobs] = useLazyQuery(SearchJobQuery)
  const [filters, setFilters] = useState<Filters>(defaultFilters)
  const [pagination, setPagination] = useState<Pagination>({ limit })
  const [jobs, setJobs] = useState<Job[]>([])
  const [totalCount, setTotalCount] = useState<number | null>(null)
  const [loadingJobs, setLoadingJobs] = useState(true)
  const [loadMore, setLoadMore] = useState(false)
  const [isMobile, setIsMobile] = useState(mediaWatcher.matches)


  const setFilterFor = (filterName: string, value: unknown) => {
    if (filterName === 'afenOnly') {
      setFilters(prev => ({
        ...prev,
        openSearchToCountries: value ? value === 'no' : undefined,
      }))
    } else if (filterName === 'requiredExperience') {
      setFilters(prev => ({
        ...prev,
        requiredExperience: isArray(value) ? value.map(exp => toGraphqlRequiredExperienceInput(exp)) : undefined,
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
  const onRequiredExperienceSelect = useCallback((value: string[] | string | null) => setFilterFor('requiredExperience', value), [])
  const onContractTypeSelect = useCallback((value: string[] | string | null) => setFilterFor('contractType', value), [])
  const onAfenOnlySelect = useCallback((value: string[] | string | null) => setFilterFor('afenOnly', value), [])

  const queryNewJobs = useCallback(async ({ pagination, filters, append = false, jobs }: { pagination: Pagination, filters: Filters, append?: boolean, jobs?: Job[] }) => {
    setLoadingJobs(true)

    const { data } = await querySearchJobs({ variables: { clientKey, filters, pagination } })
    const total = data.searchJobs.pagination.total
    const moreJobs = data.searchJobs.data as Job[]
    const totalJobsDisplayed = (jobs?.length || 0) + moreJobs.length
    
    setPagination({ ...pagination, takeAfter: last(moreJobs)?.publishedAt, countAfter: first(jobs)?.publishedAt })
    setJobs((jobs) => append ? jobs.concat(moreJobs) : moreJobs)
    setTotalCount(total)
    setLoadMore(totalJobsDisplayed < total)
    setLoadingJobs(false)
    trackDidSearch(formatToTrackDidSearchInput(filters, isAfen, total, append, totalJobsDisplayed))
  }, [clientKey, querySearchJobs, isAfen])

  const onClickSearch = () => {
    queryNewJobs({ pagination: { limit }, filters })
  }

  const onClickLoadMore = () => {
    queryNewJobs({ pagination, filters, append: true, jobs })
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { queryNewJobs({ pagination, filters: defaultFilters, jobs }) }, [])
  useEffect(() => { setIsClient(true) }, [])
  useEffect(() => { queryNewJobs({ pagination: { limit }, filters }) }, [queryNewJobs, filters, limit])
  useEffect(() => {
    new Pym.Child().sendHeight()
    setTimeout(() => new Pym.Child().sendHeight(), 500)
  })
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
    requiredExperienceFilterRef.current?.reset()
    contractTypeFilterRef.current?.reset()
    afenOnlyFilterRef.current?.reset()
  }

  if (!isClient) {
    return null
  }

  let jobResultText = ''
  if (totalCount !== null) {
    jobResultText = totalCount === 0
      ? 'No results'
      : `${totalCount} job${totalCount > 1 ? 's' : ''}`
  }

  const isFilterUsed = (value: unknown) => isArray(value) ? !isEmpty(value) : !isNil(value)
  const areFiltersUsed = map(isFilterUsed, values(filters)).some(isEmpty => isEmpty)

  let titleText = 'Find job'
  if (isUSBC) {
    titleText = 'USBC Job Board'
  } else if (isNEP) {
    titleText = 'NEP'
  } else if (isIBI) {
    titleText = 'IBI Job Board'
  } else if (isAirMiners) {
    titleText = '[DEMO] AirMiners'
  } else if (isCRIA) {
    titleText = '[DEMO] CRIA Job Board'
  } else if (isDVNE) {
    titleText = '[DEMO] DVNE Job Board'
  }

  const content = <div className='flex px-4 py-4 min-h-96 max-w-[90rem] flex-col items-center gap-3 rounded-[1.25rem] bg-white sm:py-6 sm:px-6 sm:gap-2.5'>
    <div className='flex py-3 flex-col justify-center items-start gap-3 self-stretch sm:gap-6 sm:pt-0'>

      <div className='flex flex-col items-center sm:content-center gap-3 self-stretch flex-wrap sm:flex-row sm:gap-6'>
        <div className='flex py-1 flex-col content-center items-start gap-1 max-sm:self-stretch sm:flex-[1_0_0]'>
          <p className='text-lg font-medium leading-[1.375rem] sm:text-[1.6875rem] sm:leading-7'><a href="https://cdrjobs.earth" target='_blank'>{titleText}</a></p>
          <div className='flex items-center gap-1.5 self-stretch'>
            <p className='text-[#7087F0] text-sm font-medium leading-4 text-nowrap'><a href="https://cdrjobs.earth" target='_blank'>Powered by <span className='font-bold'>CDRjobs © 2024</span></a></p>
          </div>
        </div>
        <LocationCombobox ref={locationFilterRef} onSelect={onLocationSelect} />
        <CategoryListbox ref={categoryFilterRef} onSelect={onDisciplineSelect} />
        {!isMobile && <MainButton onClick={onClickSearch} loading={loadingJobs}>Search</MainButton>}
      </div>
      
      <div className='flex sm:h-10 py-2 items-center gap-3 self-stretch max-sm:overflow-scroll'>
        {isAfen && <FilterListbox ref={afenOnlyFilterRef} text='AFEN only' valueMap={afenOnly} onSelect={onAfenOnlySelect} initialValue='yes' />}
        <FilterListbox ref={verticalFilterRef} text='Vertical' valueMap={clientVerticals} onSelect={onVerticalSelect} multiple />
        <FilterListbox ref={companySizeFilterRef} text='Company Size' valueMap={companySizes} onSelect={onCompanySizeSelect} multiple />
        <FilterListbox ref={remoteFilterRef} text='Remote' valueMap={remote} onSelect={onRemoteSelect} multiple />
        <FilterListbox ref={requiredExperienceFilterRef} text='Experience Required' valueMap={requiredExperience} onSelect={onRequiredExperienceSelect} multiple />
        <FilterListbox ref={contractTypeFilterRef} text='Contract Type' valueMap={contractTypes} onSelect={onContractTypeSelect} multiple />
      </div>

      {isMobile && <MainButton onClick={onClickSearch} loading={loadingJobs}>Search</MainButton>}

    </div>

    <div className='flex pb-3 sm:py-3 justify-center items-center gap-2.5 self-stretch border-b border-solid border-[#9F9F9F]'>
      <p className='flex-[1_0_0] text-xl sm:text-2xl font-medium leading-[1.375rem] sm:leading-7'>All Jobs</p>
    </div>

    <div className='flex py-2 items-center gap-1.5 self-stretch'>
      <p className='flex-[1_0_0] text-sm sm:text-base font-medium leading-[1.125rem]'>{jobResultText}</p>
      <button className={`${areFiltersUsed ? 'text-[#7087F0]' : 'text-[#DBE0F1]' } text-right text-sm sm:text-base font-semibold leading-[1.125rem] underline`} onClick={resetAll}>Reset filters</button>
    </div>

    <div className='flex py-3 sm:p-3 justify-center items-center content-center gap-3 self-stretch flex-wrap'>
      {jobs.map((job) => <JobCard key={job.id} job={job} />)}
    </div>

    {loadMore && <MainButton onClick={onClickLoadMore} loading={loadingJobs} fixedSize>Load More Jobs</MainButton>}
  </div>

  return isMobile
    ? content
    : <div className='flex justify-center'>
      {content}
    </div>
}

export default Page