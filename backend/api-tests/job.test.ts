import restRequest from './request'
import { API_ENDPOINT, BASE64_LOGO_A } from './utils/constants'

const jobsIds: string[] = []
let company: { airTableId: string }

describe('Job', () => {
  beforeAll(async () => {
    const { body: createBody } = await restRequest({
      method: 'POST',
      url: `${API_ENDPOINT}/companies`,
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
            logo: BASE64_LOGO_A,
          }],
        }
      }
    })

    const { body: getBody } = await restRequest({
      method: 'GET',
      url: `${API_ENDPOINT}/companies`,
    })

    company = getBody.data.find((company: { id: string }) => company.id === createBody.data[0])
  })

  describe('Create job', () => {
    const baseJob = () => ({
      companyAirTableId: company.airTableId,
      title: 'Accountant',
      sourceUrl: 'https://clickin.fr/career/1',
      disciplines: ['financialAndLegal'],
      status: 'open',
      description: 'I am job',
      seniority: 'midLevel',
      minSalary: 38000,
      maxSalary: 42000,
      currency: 'usd',
      contractTypes: ['employeePT'],
      minYearsOfExperience: 2,
      guessedMinYearsOfExperience: 2,
      minEducationLevel: 'bachelor',
      foundAt: '2024-06-27T12:30:00.164Z',
      lastCheckedAt: '2024-06-27T12:30:00.164Z',
      isFeatured: false,
    })

    it('Fails to create a hybrid job without a city', async () => {
      const { status, body } = await restRequest({
        method: 'POST',
        url: `${API_ENDPOINT}/jobs`,
        body: {
          data: {
            jobs: [{
              ...baseJob(),
              airTableId: 'city-validation-hybrid',
              locations: [{ country: 'fr', city: null }],
              remote: 'hybrid',
              publishedAt: '2024-07-10T00:00:00.000Z',
            }]
          }
        }
      })

      expect(status).toBe(400)
      expect(body.error.details).toContainEqual(expect.objectContaining({ message: 'A city location is required when remote is hybrid or no' }))
    })

    it('Fails to create an on-site job without a city', async () => {
      const { status, body } = await restRequest({
        method: 'POST',
        url: `${API_ENDPOINT}/jobs`,
        body: {
          data: {
            jobs: [{
              ...baseJob(),
              airTableId: 'city-validation-no',
              locations: [{ country: 'fr', city: null }],
              remote: 'no',
              publishedAt: '2024-07-11T00:00:00.000Z',
            }]
          }
        }
      })

      expect(status).toBe(400)
      expect(body.error.details).toContainEqual(expect.objectContaining({ message: 'A city location is required when remote is hybrid or no' }))
    })

    it('Fails to create a hybrid job when only some locations have a city', async () => {
      const { status, body } = await restRequest({
        method: 'POST',
        url: `${API_ENDPOINT}/jobs`,
        body: {
          data: {
            jobs: [{
              ...baseJob(),
              airTableId: 'city-validation-hybrid-partial',
              locations: [
                { country: 'fr', city: 'Paris' },
                { country: 'de', city: null },
              ],
              remote: 'hybrid',
              publishedAt: '2024-07-12T00:00:00.000Z',
            }]
          }
        }
      })

      expect(status).toBe(400)
      expect(body.error.details).toContainEqual(expect.objectContaining({ message: 'A city location is required when remote is hybrid or no' }))
    })

    it('Successfully create a job', async () => {
      const { status, body } = await restRequest({
        method: 'POST',
        url: `${API_ENDPOINT}/jobs`,
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
              isFeatured: false,
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
        isFeatured: true,
      }

      const { status, body } = await restRequest({
        method: 'PUT',
        url: `${API_ENDPOINT}/job/${jobsIds[0]}`,
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
        url: `${API_ENDPOINT}/jobs`,
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
        isFeatured: true,
      })
    })
  })
})