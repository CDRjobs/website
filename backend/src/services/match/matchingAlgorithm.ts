import { ContractType, CountryCode, Discipline, EducationLevel, Remote, Seniority } from '@prisma/client'
import { intersection } from 'lodash/fp'

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

export const getMatchingScore = (seeker: SeekerCriterias, job: JobMatchingData) => {
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