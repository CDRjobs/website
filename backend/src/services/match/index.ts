import { ContractType, CountryCode, Discipline, EducationLevel, Remote, Seniority } from '@prisma/client'
import prisma from '../../db/prisma'
import { intersection, map, last, mapValues, groupBy } from 'lodash/fp'

const MAX_SCORE = 5
const MAX_MATCHING_NUMBER = 25

interface SeekerCriterias {
  seekingDisciplines: Discipline[],
  locations: { country: CountryCode, city: string | null | undefined }[],
  seniority: Seniority,
  seekingContractTypes: ContractType[],
  seekingRemotes: Remote[],
  educationLevel: EducationLevel,
}

type JobMatchingData = {
  disciplines: Discipline[],
  locations: { country: CountryCode, city: string | null | undefined }[],
  minYearsOfExperience: number | null,
  contractTypes: ContractType[],
  remote: Remote,
  minEducationLevel: EducationLevel | null,
}

const castSeniorityToYearsOfExperience = (seniority: Seniority) => {
  const castMap = {
    entryLevel: 1,
    earlyStage: 5,
    midLevel: 10,
    senior: 20,
    verySenior: 40,
  }

  return castMap[seniority]
}

const orderedEducationLevel = ['highSchool', 'bachelor', 'master', 'doctorate']
const isEducationLevelEnough = (base: EducationLevel | null, educationLevel: EducationLevel) => {
  if (!base) {
    return true
  }
  const baseIndex = orderedEducationLevel.indexOf(base)
  const educationLevelIndex = orderedEducationLevel.indexOf(educationLevel)

  if (baseIndex < 0 || educationLevelIndex < 0) {
    throw new Error(`Problem with: "${base}" and "${educationLevel}"`)
  }

  return orderedEducationLevel.indexOf(educationLevel) > orderedEducationLevel.indexOf(base)

}

const getMatchingScore = (seeker: SeekerCriterias, job: JobMatchingData) => {
  let score = 0
  
  // DISCIPLINES
  const commonDisciplines = intersection(seeker.seekingDisciplines, job.disciplines)
  if (!commonDisciplines.length) {
    return 0
  }
  score += 1

  // CONTRACT TYPES
  const commonContractTypes = intersection(seeker.seekingContractTypes, job.contractTypes)
  if (!commonContractTypes.length) {
    return 0
  }
  score += 1

  // EXPERIENCE
  if (job.minYearsOfExperience !== null && job.minYearsOfExperience > castSeniorityToYearsOfExperience(seeker.seniority)) {
    return 0
  }
  
  if (job.minYearsOfExperience === null) {
    score += 0.5
  } else {
    score += 1
  }

  // EDUCATION LEVEL
  if (!isEducationLevelEnough(job.minEducationLevel, seeker.educationLevel)) {
    return 0
  }
  score += 1

  // COUNTRY (only country matching for the moment)
  const seekerCountries = seeker.locations.map(l => l.country)
  const jobCountries = job.locations.map(l => l.country)
  const commonCountries = intersection(seekerCountries, jobCountries)

  if (jobCountries.length === 0) { // worldwide
    if (seeker.seekingRemotes.includes('yes')) {
      score += 1.5
    } else if (seeker.seekingRemotes.includes('hybrid')) {
      score += 0.5
    }
  } else if (commonCountries.length) {
    score += 2
  }

  // REMOTE
  if (seeker.seekingRemotes.includes(job.remote)) {
    score += 1
  }

  return score
}

const getMatches = async () => {
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
      disciplines: true,
      locations: true,
      minYearsOfExperience: true,
      contractTypes: true,
      remote: true,
    },
    where: {
      status: 'open',
    },
    orderBy: { publishedAt: 'desc' }
  })

  let lastId: string | undefined
  const batchSize = 100
  while (true) {
    const seekers = await prisma.jobSeeker.findMany({
      where: {
        unsubscribedFromEmailMatching: false,
        ...(lastId ? { id: { gt: lastId } } : {})
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
  
      matches.push({
        jobSeeker: seeker.id,
        jobs: seekerjobsIds,
      })
    }

    lastId = last(seekers)!.id
  }

  console.log(matches.filter(m => m.jobs.length === 0))

  console.log(
    mapValues((v: unknown[]) => v.length)(groupBy(match => match.jobs.length, matches))
  )

  return matches
}

export default {
  getMatches,
}