import { getLocationText, Job } from '@/services/job'
import React from 'react'

type JobListProps = {
  title: string
  jobs: Job[]
}

const JobList = (props: JobListProps) => {
  return (
    <div className='py-4 px-2'>
      <div className='flex pb-4 flex-col content-center items-center gap-1'>
        <p className=' font-medium leading-[1.375rem] text-2xl'>
          <a href="https://cdrjobs.earth" target='_blank'>{props.title}</a>
        </p>
        <p className='text-[#7087F0] text-xs font-medium leading-4 text-nowrap'><a href="https://cdrjobs.earth" target='_blank'>Powered by <span className='font-bold'>CDRjobs © 2024</span></a></p>
      </div>

      <div className='flex flex-col gap-1 max-h-[7.5rem] overflow-scroll'>
        {...props.jobs.map((job, i) => (
          <div key={`job-list-items-${i}`} className='w-full'>
            <a href={job.sourceUrl} target='_blank' className='flex flew-row justify-between gap-3 px-2 hover:bg-[rgba(112,135,240,0.10)]'>
              <p className='text-sm truncate font-medium leading-5 font-inter'>{job.title}</p>
              <div className='shrink-0 text-xs'>{getLocationText(job, true)}</div>
            </a>
          </div>
        ))}
      </div>

      <div className='mt-2 flex justify-end'>
        <p className='text-sm font-inter'><span className='font-semibold text-[#7087F0]'>{props.jobs.length}</span> available jobs</p>
      </div>
    </div>
  )
}

export default JobList

