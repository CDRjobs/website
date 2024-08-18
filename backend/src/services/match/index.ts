import { map, last } from 'lodash/fp'
import prisma from '../../db/prisma'
import { matchToCSVRow } from './csvFormatting'
import { getMatchingScore } from './matchingAlgorithm'

const MAX_SCORE = 5
const MAX_MATCHING_NUMBER = 25

const getMatches = async ({ asCSVString = false } = {}) => {
  const matches = []

  const openJobs = await prisma.job.findMany({
    select: {
      id: true,
      title: true,
      sourceUrl: true,
      minEducationLevel: true,
      company: { select: { name: true }},
      minSalary: true,
      maxSalary: true,
      currency: true,
      disciplines: true,
      locations: true,
      minYearsOfExperience: true,
      contractTypes: true,
      remote: true,
      publishedAt: true
    },
    where: {
      status: 'open',
    },
    orderBy: { publishedAt: 'desc' }
  })

  const openJobsMap: { [k: string]: typeof openJobs[0] } = openJobs.reduce((map, job) => Object.assign(map, { [job.id]: job }), {})

  let lastId: string | undefined
  const batchSize = 100
  while (true) {
    const seekers = await prisma.jobSeeker.findMany({
      where: {
        unsubscribedFromEmailMatching: false,
        ...(lastId ? { id: { gt: lastId } } : {}),
      },
      include: {
        locations: true,
        sentJobsViaEmail: {
          where: { job: { status: 'open' } },
        },
      },
      orderBy: { id: 'asc' },
      take: batchSize,
    })

    if (seekers.length === 0) {
      break
    }

    for (const seeker of seekers) {
      const jobIdsAlreadySent = map('jobId', seeker.sentJobsViaEmail)
      const jobMatchMap: { [k: string]: string[] } = {}
      for (const job of openJobs) {
        if (jobIdsAlreadySent.includes(job.id)) {
          continue
        }
  
        const jobScore = getMatchingScore(seeker, job)
        if (jobScore > 0) {
          jobMatchMap[jobScore] = jobMatchMap[jobScore] || []
          jobMatchMap[jobScore].push(job.id)
        }
  
        if (jobMatchMap[MAX_SCORE] && jobMatchMap[MAX_SCORE].length === MAX_MATCHING_NUMBER) {
          break
        }
      }
  
      const scores = Object.keys(jobMatchMap).map(Number).sort().reverse()
      const seekerjobsIds = scores
        .reduce((jobs, score) => [...jobs, ...jobMatchMap[score]], [] as string[])
        .slice(0, MAX_MATCHING_NUMBER)
  
      if (asCSVString) {
        matches.push(matchToCSVRow({ jobSeeker: seeker, jobs: seekerjobsIds.map(id => openJobsMap[id]) }))
      } else {
        matches.push({
          jobSeekerId: seeker.id,
          jobsIds: seekerjobsIds,
        })
      }
    }

    lastId = last(seekers)!.id
  }

  return matches
}

export default {
  getMatches,
}