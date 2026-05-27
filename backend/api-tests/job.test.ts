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

    // --- Location / remote validation ---

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

    it('Allows a fully remote job without a city', async () => {
      const { status, body } = await restRequest({
        method: 'POST',
        url: `${API_ENDPOINT}/jobs`,
        body: {
          data: {
            jobs: [{
              ...baseJob(),
              airTableId: 'remote-no-city',
              locations: [{ country: 'fr', city: null }],
              remote: 'yes',
              publishedAt: '2024-07-09T00:00:00.000Z',
            }]
          }
        }
      })

      expect(status).toBe(200)
      expect(typeof body?.data?.[0]).toBe('string')
    })

    // --- Salary validation ---

    it('Fails when minSalary > maxSalary', async () => {
      const { status, body } = await restRequest({
        method: 'POST',
        url: `${API_ENDPOINT}/jobs`,
        body: {
          data: {
            jobs: [{
              ...baseJob(),
              airTableId: 'salary-min-gt-max',
              locations: [{ country: 'fr', city: 'Paris' }],
              remote: 'no',
              minSalary: 50000,
              maxSalary: 30000,
              publishedAt: '2024-07-13T00:00:00.000Z',
            }]
          }
        }
      })

      expect(status).toBe(400)
      expect(body.error.details).toContainEqual(expect.objectContaining({ message: 'maxSalary has to be greater than minSalary' }))
    })

    it('Allows minSalary equal to maxSalary', async () => {
      const { status, body } = await restRequest({
        method: 'POST',
        url: `${API_ENDPOINT}/jobs`,
        body: {
          data: {
            jobs: [{
              ...baseJob(),
              airTableId: 'salary-equal',
              locations: [{ country: 'fr', city: 'Paris' }],
              remote: 'no',
              minSalary: 40000,
              maxSalary: 40000,
              publishedAt: '2024-07-13T01:00:00.000Z',
            }]
          }
        }
      })

      expect(status).toBe(200)
    })

    it('Fails when minSalary is set without currency', async () => {
      const { status, body } = await restRequest({
        method: 'POST',
        url: `${API_ENDPOINT}/jobs`,
        body: {
          data: {
            jobs: [{
              ...baseJob(),
              airTableId: 'salary-no-currency',
              locations: [{ country: 'fr', city: 'Paris' }],
              remote: 'no',
              minSalary: 30000,
              maxSalary: null,
              currency: null,
              publishedAt: '2024-07-13T02:00:00.000Z',
            }]
          }
        }
      })

      expect(status).toBe(400)
      expect(body.error.details).toContainEqual(expect.objectContaining({ message: 'if min or max salary is defined, then currency also has to be defined' }))
    })

    it('Fails when maxSalary is set without currency', async () => {
      const { status, body } = await restRequest({
        method: 'POST',
        url: `${API_ENDPOINT}/jobs`,
        body: {
          data: {
            jobs: [{
              ...baseJob(),
              airTableId: 'salary-max-no-currency',
              locations: [{ country: 'fr', city: 'Paris' }],
              remote: 'no',
              minSalary: null,
              maxSalary: 50000,
              currency: null,
              publishedAt: '2024-07-13T03:00:00.000Z',
            }]
          }
        }
      })

      expect(status).toBe(400)
      expect(body.error.details).toContainEqual(expect.objectContaining({ message: 'if min or max salary is defined, then currency also has to be defined' }))
    })

    // --- City character validation ---

    it('Fails when city contains a semicolon', async () => {
      const { status, body } = await restRequest({
        method: 'POST',
        url: `${API_ENDPOINT}/jobs`,
        body: {
          data: {
            jobs: [{
              ...baseJob(),
              airTableId: 'city-semicolon',
              locations: [{ country: 'fr', city: 'Pa;ris' }],
              remote: 'no',
              publishedAt: '2024-07-13T04:00:00.000Z',
            }]
          }
        }
      })

      expect(status).toBe(400)
      expect(body.error.details).toContainEqual(expect.objectContaining({ message: "The city name cannot contains ';' character" }))
    })

    // --- Empty arrays validation ---

    it('Fails when disciplines is empty', async () => {
      const { status, body } = await restRequest({
        method: 'POST',
        url: `${API_ENDPOINT}/jobs`,
        body: {
          data: {
            jobs: [{
              ...baseJob(),
              airTableId: 'empty-disciplines',
              locations: [{ country: 'fr', city: 'Paris' }],
              remote: 'no',
              disciplines: [],
              publishedAt: '2024-07-13T05:00:00.000Z',
            }]
          }
        }
      })

      expect(status).toBe(400)
    })

    it('Fails when contractTypes is empty', async () => {
      const { status, body } = await restRequest({
        method: 'POST',
        url: `${API_ENDPOINT}/jobs`,
        body: {
          data: {
            jobs: [{
              ...baseJob(),
              airTableId: 'empty-contract-types',
              locations: [{ country: 'fr', city: 'Paris' }],
              remote: 'no',
              contractTypes: [],
              publishedAt: '2024-07-13T06:00:00.000Z',
            }]
          }
        }
      })

      expect(status).toBe(400)
    })

    // --- Reference validation ---

    it('Fails when companyAirTableId does not exist', async () => {
      const { status, body } = await restRequest({
        method: 'POST',
        url: `${API_ENDPOINT}/jobs`,
        body: {
          data: {
            jobs: [{
              ...baseJob(),
              airTableId: 'bad-company-ref',
              companyAirTableId: 'non-existent-company',
              locations: [{ country: 'fr', city: 'Paris' }],
              remote: 'no',
              publishedAt: '2024-07-13T07:00:00.000Z',
            }]
          }
        }
      })

      expect(status).toBe(400)
      expect(body.error.details).toContainEqual(expect.objectContaining({
        message: expect.stringContaining("don't exist"),
      }))
    })

    it('Fails when airTableId already exists', async () => {
      // First, create a valid job
      await restRequest({
        method: 'POST',
        url: `${API_ENDPOINT}/jobs`,
        body: {
          data: {
            jobs: [{
              ...baseJob(),
              airTableId: 'dup-airtable-id',
              locations: [{ country: 'fr', city: 'Paris' }],
              remote: 'yes',
              publishedAt: '2024-07-13T08:00:00.000Z',
            }]
          }
        }
      })

      // Try to create another with same airTableId
      const { status, body } = await restRequest({
        method: 'POST',
        url: `${API_ENDPOINT}/jobs`,
        body: {
          data: {
            jobs: [{
              ...baseJob(),
              airTableId: 'dup-airtable-id',
              locations: [{ country: 'fr', city: 'Paris' }],
              remote: 'yes',
              publishedAt: '2024-07-13T08:01:00.000Z',
            }]
          }
        }
      })

      expect(status).toBe(400)
      expect(body.error.details).toContainEqual(expect.objectContaining({
        message: expect.stringContaining('already exist'),
      }))
    })

    it('Fails when publishedAt already exists in database', async () => {
      await restRequest({
        method: 'POST',
        url: `${API_ENDPOINT}/jobs`,
        body: {
          data: {
            jobs: [{
              ...baseJob(),
              airTableId: 'dup-published-at-1',
              locations: [{ country: 'fr', city: 'Paris' }],
              remote: 'yes',
              publishedAt: '2024-07-13T09:00:00.000Z',
            }]
          }
        }
      })

      const { status, body } = await restRequest({
        method: 'POST',
        url: `${API_ENDPOINT}/jobs`,
        body: {
          data: {
            jobs: [{
              ...baseJob(),
              airTableId: 'dup-published-at-2',
              locations: [{ country: 'fr', city: 'Paris' }],
              remote: 'yes',
              publishedAt: '2024-07-13T09:00:00.000Z',
            }]
          }
        }
      })

      expect(status).toBe(400)
      expect(body.error.details).toContainEqual(expect.objectContaining({
        message: expect.stringContaining('publishedAt'),
      }))
    })

    // --- Datetime validation ---

    it('Fails when publishedAt is not a valid datetime', async () => {
      const { status } = await restRequest({
        method: 'POST',
        url: `${API_ENDPOINT}/jobs`,
        body: {
          data: {
            jobs: [{
              ...baseJob(),
              airTableId: 'bad-datetime',
              locations: [{ country: 'fr', city: 'Paris' }],
              remote: 'no',
              publishedAt: 12345,
            }]
          }
        }
      })

      expect(status).toBe(400)
    })

    // --- Strict mode / unknown fields ---

    it('Fails when unknown fields are provided', async () => {
      const { status, body } = await restRequest({
        method: 'POST',
        url: `${API_ENDPOINT}/jobs`,
        body: {
          data: {
            jobs: [{
              ...baseJob(),
              airTableId: 'unknown-field',
              locations: [{ country: 'fr', city: 'Paris' }],
              remote: 'no',
              publishedAt: '2024-07-13T10:00:00.000Z',
              unknownField: 'should fail',
            }]
          }
        }
      })

      expect(status).toBe(400)
      expect(body.error.details).toContainEqual(expect.objectContaining({
        code: 'unrecognized_keys',
      }))
    })

    // --- Successful creation ---

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

    it('Fails to update a non-existent job', async () => {
      const { status, body } = await restRequest({
        method: 'PUT',
        url: `${API_ENDPOINT}/job/non-existent-id`,
        body: {
          data: {
            job: { title: 'Updated' },
          }
        }
      })

      expect(status).toBe(400)
      expect(body.error.message).toContain("doesn't exist")
    })

    it('Fails when updating minSalary above existing maxSalary', async () => {
      const { status, body } = await restRequest({
        method: 'PUT',
        url: `${API_ENDPOINT}/job/${jobsIds[0]}`,
        body: {
          data: {
            job: {
              minSalary: 99999,
            },
          }
        }
      })

      expect(status).toBe(400)
      expect(body.error.details).toContainEqual(expect.objectContaining({ message: 'maxSalary has to be greater than minSalary' }))
    })

    it('Fails when changing remote from yes to no without providing city', async () => {
      // First create a remote job with no city
      const { body: createBody } = await restRequest({
        method: 'POST',
        url: `${API_ENDPOINT}/jobs`,
        body: {
          data: {
            jobs: [{
              ...({
                companyAirTableId: company.airTableId,
                title: 'Remote Job',
                sourceUrl: 'https://example.com/remote',
                disciplines: ['engineering'],
                status: 'open',
                description: 'Remote job',
                seniority: 'midLevel',
                minSalary: null,
                maxSalary: null,
                currency: null,
                contractTypes: ['employeeFT'],
                minYearsOfExperience: null,
                guessedMinYearsOfExperience: null,
                minEducationLevel: null,
                foundAt: '2024-06-27T12:30:00.164Z',
                lastCheckedAt: '2024-06-27T12:30:00.164Z',
                isFeatured: false,
              }),
              airTableId: 'remote-to-no',
              locations: [{ country: 'fr', city: null }],
              remote: 'yes',
              publishedAt: '2024-07-20T00:00:00.000Z',
            }]
          }
        }
      })

      const remoteJobId = createBody.data[0]

      // Now try to change remote to 'no' without updating locations
      const { status, body } = await restRequest({
        method: 'PUT',
        url: `${API_ENDPOINT}/job/${remoteJobId}`,
        body: {
          data: {
            job: { remote: 'no' },
          }
        }
      })

      expect(status).toBe(400)
      expect(body.error.details).toContainEqual(expect.objectContaining({ message: 'A city location is required when remote is hybrid or no' }))
    })

    it('Fails when updating with unknown fields', async () => {
      const { status, body } = await restRequest({
        method: 'PUT',
        url: `${API_ENDPOINT}/job/${jobsIds[0]}`,
        body: {
          data: {
            job: { unknownField: 'nope' },
          }
        }
      })

      expect(status).toBe(400)
      expect(body.error.details).toContainEqual(expect.objectContaining({
        code: 'unrecognized_keys',
      }))
    })

    it('Successfully updates only a single field', async () => {
      const { status, body } = await restRequest({
        method: 'PUT',
        url: `${API_ENDPOINT}/job/${jobsIds[0]}`,
        body: {
          data: {
            job: { title: 'Only title changed' },
          }
        }
      })

      expect(status).toBe(200)
      expect(body.data.title).toBe('Only title changed')
      // Other fields remain unchanged
      expect(body.data.remote).toBe('no')
      expect(body.data.minSalary).toBe(39000)
    })

    it('Fails when updating companyAirTableId to non-existent company', async () => {
      const { status, body } = await restRequest({
        method: 'PUT',
        url: `${API_ENDPOINT}/job/${jobsIds[0]}`,
        body: {
          data: {
            job: { companyAirTableId: 'does-not-exist' },
          }
        }
      })

      expect(status).toBe(400)
      expect(body.error.details).toContainEqual(expect.objectContaining({
        message: expect.stringContaining("doesn't exist"),
      }))
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
        title: 'Only title changed',
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
        isFeatured: true,
      })
    })

    it('Supports pagination with limit', async () => {
      const { status, body } = await restRequest({
        method: 'GET',
        url: `${API_ENDPOINT}/jobs?limit=1`,
      })

      expect(status).toBe(200)
      expect(body.data.length).toBeLessThanOrEqual(1)
    })
  })
})