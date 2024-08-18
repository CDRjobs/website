import { Context } from 'koa'
import papaparse from 'papaparse'
import services from '../../services'
import config from '../../config'
import { toDisciplineText } from '../../domain/discipline'
import { toContractTypeText } from '../../domain/contractType'
import { locationsToText } from '../../domain/location'
import { salaryToText } from '../../domain/salary'
import { pick } from 'lodash/fp'
import { format } from 'date-fns'
import { remoteToText } from '../../domain/remote'
import { ApplicationError } from '../errors'

export const getMatches = async (ctx: Context) => {
  const matches = await services.match.getMatches({ asCSVString: true })

  const csvString = papaparse.unparse(matches)

  ctx.type = 'text/csv'
  ctx.body = csvString
}

export const sendViaEmail = async (ctx: Context) => {
  if (!config.email.allowSendingMatchingEmail) {
    throw new ApplicationError('Sending matching emails is not allowed at the moment')
  }

  const matches = await services.match.getMatches() as { jobSeekerId: string; jobsIds: string[] }[]
  const suppressedEmails = await services.email.getSuppressedEmailsFromPostmark()

  for (const match of matches) {
    const jobSeeker = await services.jobSeeker.getJobSeekerById(match.jobSeekerId)
    const jobs = await services.job.getJobsByIds(match.jobsIds, { locations: true, company: { select: { name: true } } })

    if (!jobSeeker || jobs.length !== match.jobsIds.length) {
      throw new Error('Error while sending emails: either no jobSeeker or missing jobs')
    }

    if (suppressedEmails.includes(jobSeeker.email)) {
      continue
    }

    let templateId
    if (jobs.length) {
      templateId = jobSeeker.sentFirstEmailMatching ? Number(config.email.secondEmailTemplateId) : Number(config.email.firstEmailTemplateId)
    } else {
      templateId = jobSeeker.sentFirstEmailMatching ? Number(config.email.secondEmailNoMatchTemplateId) : Number(config.email.firstEmailNoMatchTemplateId)
    }

    if (process.env.NODE_ENV === 'production') {
      await services.email.sendMatchingEmail({
        from: config.email.fromAddress,
        to: jobSeeker.email,
        templateId,
        templateModel: {
          disciplines: jobSeeker.seekingDisciplines.map(toDisciplineText),
          contractTypes: jobSeeker.seekingContractTypes.map(toContractTypeText),
          jobs: jobs.map(job => {
            const salaryText = salaryToText(pick(['minSalary', 'maxSalary', 'currency'], job))
            return {
              title: job.title,
              companyName: job.company.name,
              location: locationsToText(job.locations),
              contractTypes: job.contractTypes.map(toContractTypeText).join(', '),
              ...(salaryText ? { salary: salaryText } : {}),
              remote: remoteToText(job.remote),
              datePosted: format(job.publishedAt, 'yyyy-MM-dd'),
            }
          })
        },
      })
      await services.jobSeeker.updateJobSeeker(jobSeeker.id, {
        sentFirstEmailMatching: true,
        sentJobsViaEmail: { connect: jobs.map(job => ({ id: job.id, sentAt: new Date().toISOString() })) }
      })
    } else {
      console.log(`Sending to ${jobSeeker.email}`)
    }
  }

  ctx.body = {
    data: matches
  }
}