import { Discipline, Remote, Seniority, ContractType, WorkStatus, EducationLevel } from '@prisma/client'
import { z } from 'zod'
import { uniq } from 'lodash/fp'
import { validateZodSchema } from '../../errors'
import services from '../../../services'
import { locationsSchema } from './common'

const sentJobsViaEmailSchema = z
  .array(z.string())
  .refine(async (jobsIds) => {
    const uniqJobsIds = uniq(jobsIds)
    const jobs = await services.job.getJobsByIds(uniqJobsIds)
    return jobs.length === uniqJobsIds.length
  }, {
    message: "Some jobs don't exist",
  })

const createJobSeekerBodySchema = z.object({
  data: z.object({
    jobSeeker: z.object({
      wixId: z.string(),
      firstname: z.string().min(1).nullish(),
      lastname: z.string().min(1).nullish(),
      email: z.string().email(),
      locations: locationsSchema,
      educationLevel: z.nativeEnum(EducationLevel),
      seniority: z.nativeEnum(Seniority),
      workStatus: z.nativeEnum(WorkStatus),
      sectors: z.array(z.string().min(1)),
      seekingContractTypes: z.array(z.nativeEnum(ContractType)).min(1),
      seekingRemotes: z.array(z.nativeEnum(Remote)).min(1),
      seekingDisciplines: z.array(z.nativeEnum(Discipline)).min(1),
      openToTalk: z.boolean(),
      whatTypeOfInsightsYouWant: z.string().nullish(),
      unsubscribedFromEmailMatching: z.boolean(),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
      sentJobsViaEmail: sentJobsViaEmailSchema,
    })
    .strict()
    .refine(async ({ wixId, email }) => {
      const existingJobSeeker = await services.jobSeeker.getJobSeekerByWixIdOrEmail(wixId, email)
      return !existingJobSeeker
    }, {
      message: 'This job seeker already exists',
    }),
  }).strict()
}).strict()

const updateJobSeekerBodySchema = z.object({
  data: z.object({
    jobSeeker: z.object({
      firstname: z.string().min(1).nullish(),
      lastname: z.string().min(1).nullish(),
      locations: locationsSchema.optional(),
      educationLevel: z.nativeEnum(EducationLevel).optional(),
      seniority: z.nativeEnum(Seniority).optional(),
      workStatus: z.nativeEnum(WorkStatus).optional(),
      sectors: z.array(z.string().min(1)).optional(),
      seekingContractTypes: z.array(z.nativeEnum(ContractType)).min(1).optional(),
      seekingRemotes: z.array(z.nativeEnum(Remote)).min(1).optional(),
      seekingDisciplines: z.array(z.nativeEnum(Discipline)).min(1).optional(),
      openToTalk: z.boolean().optional(),
      whatTypeOfInsightsYouWant: z.string().nullish(),
      unsubscribedFromEmailMatching: z.boolean().optional(),
      sentJobsViaEmail: sentJobsViaEmailSchema.optional(),
    })
    .strict()
  }).strict()
}).strict()

export const validateCreateJobSeekerBody = validateZodSchema(createJobSeekerBodySchema, true)
export const validateUpdateJobSeekerBody = validateZodSchema(updateJobSeekerBodySchema, true)

export type CreateJobSeekerBodyType = z.infer<typeof createJobSeekerBodySchema>
export type UpdateJobSeekerBodyType = z.infer<typeof updateJobSeekerBodySchema>
