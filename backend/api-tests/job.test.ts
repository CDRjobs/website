import restRequest from './request'

const jobsIds: string[] = []
let company: { airTableId: string }

describe('Job', () => {
  beforeAll(async () => {
    const { body: createBody } = await restRequest({
      method: 'POST',
      url: 'http://localhost:4000/api/v1/companies', // TODO: replace with an env var,
      body: {
        data: {
          companies: [{
            name: 'CDRjobs',
            airTableId: '10',
            companyUrl: 'https://cdrjobs.earth',
            careerPageUrl: 'https://cdrjobs.earth',
            companySize: 'xxs',
            hqCountry: 'it',
            cdrCategory: 'biomass',
            logo: 'data:image/jpeg;base64,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'
          }],
        }
      }
    })

    const { body: getBody } = await restRequest({
      method: 'GET',
      url: 'http://localhost:4000/api/v1/companies', // TODO: replace with an env var,
    })

    company = getBody.data.find((company: { id: string }) => company.id === createBody.data[0])
  })

  describe('Create job', () => {
    it('Successfully create a job', async () => {
      const { status, body } = await restRequest({
        method: 'POST',
        url: 'http://localhost:4000/api/v1/jobs', // TODO: replace with an env var,
        body: {
          data: {
            jobs: [{
              airTableId: '1',
              companyAirTableId: company.airTableId,
              title: 'Accountant',
              sourceUrl: 'https://clickin.fr/career/1',
              disciplines: ['financialAndLegal'],
              status: 'open',
              description: 'I am job',
              locations: [{
                country: 'fr',
                city: 'Toulon'
              }],
              seniority: 'midLevel',
              remote: 'yes',
              minSalary: 38000,
              maxSalary: 42000,
              currency: 'usd',
              contractTypes: ['employeePT'],
              minYearsOfExperience: 2,
              guessedMinYearsOfExperience: 2,
              minEducationLevel: 'bachelor',
              foundAt: '2024-06-27T12:30:00.164Z',
              lastCheckedAt: '2024-06-27T12:30:00.164Z',
              publishedAt: '2024-07-15T23:27:00.164Z',
              realPublishedAt: '2024-07-15T23:27:00.165Z',
            }]
          }
        }
      })

      expect(status).toBe(200)
      expect(typeof body?.data?.[0]).toBe('string')
      jobsIds.push(body.data[0])
    })
  })

  describe('Update job', () => {
    it('Successfully updates a job', async () => {
      const updateData = {
        title: 'Accountant updated',
        sourceUrl: 'https://clickin.fr/career/1/updated',
        disciplines: ['engineering'],
        status: 'open',
        description: 'I am job updated',
        locations: [{
          country: 'us',
          city: 'New-York'
        }],
        seniority: 'senior',
        remote: 'no',
        minSalary: 39000,
        maxSalary: 43000,
        currency: 'eur',
        contractTypes: ['contractor'],
        minYearsOfExperience: 3,
        guessedMinYearsOfExperience: 4,
        minEducationLevel: 'master',
        foundAt: '2024-06-19T12:30:00.164Z',
        lastCheckedAt: '2024-06-29T12:30:00.164Z',
        publishedAt: '2024-07-19T23:27:00.164Z',
        realPublishedAt: '2024-07-19T23:27:00.165Z',
      }

      const { status, body } = await restRequest({
        method: 'PUT',
        url: `http://localhost:4000/api/v1/job/${jobsIds[0]}`, // TODO: replace with an env var,
        body: {
          data: {
            job: {
              ...updateData,
            },
          }
        }
      })

      expect(status).toBe(200)
      expect(body.data).toMatchObject({
        ...updateData,
        id: expect.any(String),
        airTableId: '1',
        locations: [{
          id: expect.any(String),
          city: 'New-York',
          country: 'us',
          countryCityKey: 'us;new-york'
        }],
      })
    })
  })

  describe('Get open jobs', () => {
    it('Successfully get jobs', async () => {
      const { status, body } = await restRequest({
        method: 'GET',
        url: 'http://localhost:4000/api/v1/jobs', // TODO: replace with an env var,
      })

      expect(status).toBe(200)
      const job = body.data.find((job: { id: string }) => job.id === jobsIds[0])
      expect(job).toMatchObject({
        title: 'Accountant updated',
        sourceUrl: 'https://clickin.fr/career/1/updated',
        disciplines: ['engineering'],
        status: 'open',
        description: 'I am job updated',
        locations: [{
          country: 'us',
          city: 'New-York'
        }],
        seniority: 'senior',
        remote: 'no',
        minSalary: 39000,
        maxSalary: 43000,
        currency: 'eur',
        contractTypes: ['contractor'],
        minYearsOfExperience: 3,
        guessedMinYearsOfExperience: 4,
        minEducationLevel: 'master',
        foundAt: '2024-06-19T12:30:00.164Z',
        lastCheckedAt: '2024-06-29T12:30:00.164Z',
        publishedAt: '2024-07-19T23:27:00.164Z',
        realPublishedAt: '2024-07-19T23:27:00.165Z',
      })
    })
  })
})