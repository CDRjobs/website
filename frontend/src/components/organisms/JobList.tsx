import { getLocationText, Job } from '@/services/job'
import React from 'react'

type JobListProps = {
  title: string
  jobs: Job[]
}

const JobList = (props: JobListProps) => {
  return (
    <div className='p-4 bg-white'>
      <div className='flex mb-8 flex-col content-center items-center gap-1'>
        <p className=' font-medium leading-[1.375rem] text-2xl'>
          <a href="https://cdrjobs.earth" target='_blank'>{props.title}</a>
        </p>
        <p className='text-[#7087F0] text-xs font-medium leading-4 text-nowrap'><a href="https://cdrjobs.earth" target='_blank'>Powered by <span className='font-bold'>CDRjobs © 2024</span></a></p>
      </div>

      {props.jobs.length > 0 && <div className='flex flex-col gap-0.5 max-h-32 overflow-scroll'>
        {...props.jobs.map((job, i) => (
          <div key={`job-list-items-${i}`} className='w-full'>
            <a href={job.sourceUrl} target='_blank' className='flex flew-row justify-between items-center gap-3 px-2 py-0.5 hover:bg-[rgba(112,135,240,0.10)] hover:rounded-sm'>
              <p className='text-sm truncate font-medium leading-5 font-inter'>{job.title}</p>
              <div className='shrink-0 text-xs'>{getLocationText(job, true)}</div>
            </a>
          </div>
        ))}
      </div>}

      {props.jobs.length === 0 && <div className='flex justify-center mt-4'>
        <p className='font-inter text-sm'>There are no available jobs for the moment</p>
      </div>}

      {props.jobs.length > 0 && <div className='mt-2 flex justify-end'>
        <p className='text-sm font-inter'><span className='font-semibold text-[#7087F0]'>{props.jobs.length}</span> available job{props.jobs.length === 1 ? '' : 's'}</p>
      </div>}

      <p className='text-xs mb-2 mt-8 font-inter'>Couldn&apos;t find what you are looking for? Check out all available opening on the <a className='underline text-[#7087F0]' href='https://www.cdrjobs.earth/job-board'>CDRjobs Board</a>.</p>
    </div>
  )
}

export default JobList

