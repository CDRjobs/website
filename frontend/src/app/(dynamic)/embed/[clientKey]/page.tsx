'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect, useRef, useCallback } from 'react'
import Button from '@/components/atoms/Button'
import LocationCombobox from '@/components/molecules/LocationCombobox'
import CategoryListbox from '@/components/molecules/CategoryListbox'
import FilterListbox, { FilterListboxRef } from '@/components/molecules/FilterListbox'
import { gql, useLazyQuery, useQuery } from '@apollo/client'
import { intersection, uniqBy } from 'lodash/fp'
import { companySizes, contractNatures, contractTimes, contractTypes, remote, seniority, verticals } from './filters'
import { Filters, Pagination, SearchJob } from './types'

const SearchJobQuery = gql`
  query searchJobs ($filters: jobFiltersInput!, $pagination: paginationInput!) {
    searchJobs (filters: $filters, pagination: $pagination) {
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
  const { clientKey } = useParams()
  const [isClient, setIsClient] = useState(false)
  const verticalFilterRef = useRef<FilterListboxRef>(null)
  const companySizeFilterRef = useRef<FilterListboxRef>(null)
  const remoteFilterRef = useRef<FilterListboxRef>(null)
  const seniorityFilterRef = useRef<FilterListboxRef>(null)
  const contractTypeFilterRef = useRef<FilterListboxRef>(null)
  
  const [querySearchJobs] = useLazyQuery(SearchJobQuery)
  const [filters, setFilters] = useState<Filters>({})
  const [pagination, setPagination] = useState<Pagination>({ limit: 1, start: 0 })
  const [jobs, setJobs] = useState<SearchJob[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loadingJobs, setLoadingJobs] = useState(true)
  const [loadMore, setLoadMore] = useState(true)

  const setFilterFor = (filterName: string, value: unknown) => {
    if (filterName === 'location') {
      console.log('selected location', value)
    } else if (filterName === 'contractType') {
      const contractTime = intersection(Object.keys(contractTimes))(value as [])
      const contractNature = intersection(Object.keys(contractNatures))(value as [])

      setFilters(prev => ({
        ...prev,
        ...(contractTime.length ? { contractTime } : {}),
        ...(contractNature.length ? { contractTime } : {}),
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
  const onVerticalSelect = useCallback((value: string[]) => setFilterFor('cdrCategory', value), [])
  const onCompanySizeSelect = useCallback((value: string[]) => setFilterFor('companySize', value), [])
  const onRemoteSelect = useCallback((value: string[]) => setFilterFor('remote', value), [])
  const onSenioritySelect = useCallback((value: string[]) => setFilterFor('seniority', value), [])
  const onContractTypeSelect = useCallback((value: string[]) => setFilterFor('contractType', value), [])

  const queryJobs = async (queryPagination: Pagination, queryFilters: Filters) => {
    const { data } = await querySearchJobs({ variables: { filters: queryFilters, pagination: queryPagination } })
    return { total: data.searchJobs.pagination.total, jobs: data.searchJobs.data }
  }

  const queryMoreJobs = async () => {
    setLoadingJobs(true)
    const newPagination = { ...pagination, start: jobs.length }
    const { total, jobs: newJobs } = await queryJobs(newPagination, filters)
    setPagination(newPagination)
    setJobs((prevJobs) => uniqBy('id', prevJobs.concat(newJobs)))
    setTotalCount(total)
    if (newJobs.length < total) {
      setLoadMore(false)
    }
    console.log('loadmorejobs', newJobs)
    setLoadingJobs(false)
  }

  const queryNewJobs = async () => {
    setLoadingJobs(true)
    const newPagination = { ...pagination, start: 0 }
    const { total, jobs: newJobs } = await queryJobs(newPagination, filters)
    setPagination(newPagination)
    setJobs(newJobs)
    setTotalCount(total)
    setLoadMore(newJobs.length < total)
    console.log('newJobs', newJobs)
    console.log('total', total)
    setLoadingJobs(false)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { queryNewJobs() }, [])
  useEffect(() => { setIsClient(true) }, [])

  const resetAll = () => {
    verticalFilterRef.current?.reset()
    companySizeFilterRef.current?.reset()
    remoteFilterRef.current?.reset()
    seniorityFilterRef.current?.reset()
    contractTypeFilterRef.current?.reset()
  }

  if (!isClient) {
    return null
  }

  return (
    <div className='flex flex-col items-center'>
      <h1>CDRjobs - {clientKey}</h1>
      <p>Find Job</p>
      <p>Powered by CDR Jobs © 2024</p>
      <LocationCombobox onSelect={onLocationSelect} />
      <CategoryListbox onSelect={onDisciplineSelect} />
      <div>
        <FilterListbox ref={verticalFilterRef} text='Vertical' valueMap={verticals} onSelect={onVerticalSelect}/>
        <FilterListbox ref={companySizeFilterRef} text='Company Size' valueMap={companySizes} onSelect={onCompanySizeSelect}/>
        <FilterListbox ref={remoteFilterRef} text='Remote' valueMap={remote} onSelect={onRemoteSelect}/>
        <FilterListbox ref={seniorityFilterRef} text='seniority' valueMap={seniority} onSelect={onSenioritySelect}/>
        <FilterListbox ref={contractTypeFilterRef} text='Contract Type' valueMap={contractTypes} onSelect={onContractTypeSelect}/>
      </div>
      <Button text='Search' onClick={queryNewJobs} disabled={loadingJobs} />
        <p>All Jobs</p>
        <div className='flex justify-between w-full'>
          <p>{totalCount === 0 ? 'No results' : `${totalCount} job${totalCount > 1 ? 's' : ''}`}</p>
          <button className='underline' onClick={resetAll}>Reset filters</button>
        </div>
        {loadMore && <Button text='Load more' onClick={queryMoreJobs} />}
    </div>
  )
}

export default Page