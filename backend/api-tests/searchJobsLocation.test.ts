import restRequest from './request'
import { API_ENDPOINT, BASE64_LOGO_A } from './utils/constants'

const GRAPHQL_ENDPOINT = `${process.env.SERVER_ENDPOINT}/graphql`

const SEARCH_JOBS_QUERY = `
  query SearchJobs($clientKey: String!, $filters: jobFiltersInput, $pagination: paginationInput) {
    searchJobs(clientKey: $clientKey, filters: $filters, pagination: $pagination) {
      pagination { total }
      data { id }
    }
  }
`

const graphqlRequest = async (query: string, variables: Record<string, unknown>) => {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  })
  return response.json()
}

const createJob = async (airTableId: string, title: string, locations: object[], remote: string, publishedAt: string) => {
  const { body } = await restRequest({
    method: 'POST',
    url: `${API_ENDPOINT}/jobs`,
    body: {
      data: {
        jobs: [{
          ...BASE_JOB,
          airTableId,
          companyAirTableId: 'sj-company',
          title,
          locations,
          remote,
          publishedAt,
          realPublishedAt: publishedAt,
        }]
      }
    }
  })
  if (!body?.data?.[0]) {
    throw new Error(`Job creation failed for ${airTableId}: ${JSON.stringify(body)}`)
  }
  return body.data[0] as string
}
const TOKYO = { lat: 35.6762, long: 139.6503 }

const jobIds: Record<string, string> = {}
let clientKey: string
let companyId: string

const BASE_JOB = {
  sourceUrl: 'https://example.com/job',
  disciplines: ['engineering'],
  status: 'open',
  description: 'Test job',
  seniority: 'midLevel',
  contractTypes: ['employeeFT'],
  foundAt: '2024-01-01T00:00:00.000Z',
  lastCheckedAt: '2024-01-01T00:00:00.000Z',
  isFeatured: false,
}

describe('searchJobs - location filter', () => {
  beforeAll(async () => {
    // Create company
    const { body: companyBody } = await restRequest({
      method: 'POST',
      url: `${API_ENDPOINT}/companies`,
      body: {
        data: {
          companies: [{
            name: 'Search Test Company',
            airTableId: 'sj-company',
            companyUrl: 'https://searchtest.example.com',
            careerPageUrl: 'https://searchtest.example.com/careers',
            companySize: 'xxs',
            hqCountry: 'jp',
            cdrCategory: 'biomass',
            logo: BASE64_LOGO_A,
          }],
        }
      }
    })
    companyId = companyBody.data[0]

    // Create client scoped to test company only
    const { body: clientBody } = await restRequest({
      method: 'POST',
      url: `${API_ENDPOINT}/client`,
      body: {
        data: {
          client: {
            name: 'Search Test Client',
            companies: [companyId],
          }
        }
      }
    })
    clientKey = clientBody.data.iFrameKey

    // Job 1: no location (worldwide), remote
    jobIds['worldwide'] = await createJob('sj-job-worldwide', 'Worldwide Remote Job', [], 'yes', '2024-07-01T00:00:00.000Z')

    // Job 2: Kyoto, Japan, fully remote — key test case
    jobIds['kyotoRemote'] = await createJob('sj-job-kyoto-remote', 'Kyoto Remote Job', [{ country: 'jp', city: 'Kyoto' }], 'yes', '2024-07-02T00:00:00.000Z')

    // Job 3: Kyoto, Japan, on-site
    jobIds['kyotoOnsite'] = await createJob('sj-job-kyoto-onsite', 'Kyoto On-site Job', [{ country: 'jp', city: 'Kyoto' }], 'no', '2024-07-03T00:00:00.000Z')

    // Job 4: Paris, France, fully remote
    jobIds['parisRemote'] = await createJob('sj-job-paris-remote', 'Paris Remote Job', [{ country: 'fr', city: 'Paris' }], 'yes', '2024-07-04T00:00:00.000Z')
  }, 60000)

  describe('no location filter', () => {
    it('returns all jobs', async () => {
      const { data } = await graphqlRequest(SEARCH_JOBS_QUERY, {
        clientKey,
        filters: {},
        pagination: { limit: 100 },
      })

      const ids = data.searchJobs.data.map((j: { id: string }) => j.id)
      expect(ids).toContain(jobIds['worldwide'])
      expect(ids).toContain(jobIds['kyotoRemote'])
      expect(ids).toContain(jobIds['kyotoOnsite'])
      expect(ids).toContain(jobIds['parisRemote'])
    })
  })

  describe('location: coordinates only (no country)', () => {
    it('shows worldwide jobs and jobs near the coordinates, but NOT remote jobs far away', async () => {
      const { data } = await graphqlRequest(SEARCH_JOBS_QUERY, {
        clientKey,
        filters: { location: { coordinates: TOKYO } },
        pagination: { limit: 100 },
      })

      const ids = data.searchJobs.data.map((j: { id: string }) => j.id)
      expect(ids).toContain(jobIds['worldwide'])      // no location → always shown
      expect(ids).not.toContain(jobIds['kyotoRemote']) // Kyoto is ~450km from Tokyo, no country condition
      expect(ids).not.toContain(jobIds['kyotoOnsite'])
      expect(ids).not.toContain(jobIds['parisRemote'])
    })
  })

  describe('location: coordinates + country (city search)', () => {
    it('shows worldwide jobs, nearby jobs, AND remote=yes jobs in the same country', async () => {
      const { data } = await graphqlRequest(SEARCH_JOBS_QUERY, {
        clientKey,
        filters: { location: { coordinates: TOKYO, country: 'jp' } },
        pagination: { limit: 100 },
      })

      const ids = data.searchJobs.data.map((j: { id: string }) => j.id)
      expect(ids).toContain(jobIds['worldwide'])      // no location → always shown
      expect(ids).toContain(jobIds['kyotoRemote'])    // remote=yes in JP → shown
      expect(ids).not.toContain(jobIds['kyotoOnsite']) // remote=no in JP → too far, not shown
      expect(ids).not.toContain(jobIds['parisRemote']) // remote=yes but in FR, not JP
    })

    it('does NOT show remote=yes jobs from a different country', async () => {
      const { data } = await graphqlRequest(SEARCH_JOBS_QUERY, {
        clientKey,
        filters: { location: { coordinates: TOKYO, country: 'jp' } },
        pagination: { limit: 100 },
      })

      const ids = data.searchJobs.data.map((j: { id: string }) => j.id)
      expect(ids).not.toContain(jobIds['parisRemote'])
    })
  })

  describe('location: country only', () => {
    it('shows all jobs in that country and worldwide jobs', async () => {
      const { data } = await graphqlRequest(SEARCH_JOBS_QUERY, {
        clientKey,
        filters: { location: { country: 'jp' } },
        pagination: { limit: 100 },
      })

      const ids = data.searchJobs.data.map((j: { id: string }) => j.id)
      expect(ids).toContain(jobIds['worldwide'])
      expect(ids).toContain(jobIds['kyotoRemote'])
      expect(ids).toContain(jobIds['kyotoOnsite'])
      expect(ids).not.toContain(jobIds['parisRemote'])
    })
  })

  describe('validation', () => {
    it('accepts country and coordinates together without error', async () => {
      const { data, errors } = await graphqlRequest(SEARCH_JOBS_QUERY, {
        clientKey,
        filters: { location: { coordinates: TOKYO, country: 'jp' } },
        pagination: { limit: 1 },
      })

      expect(errors).toBeUndefined()
      expect(data.searchJobs).toBeDefined()
    })

    it('accepts coordinates without country', async () => {
      const { data, errors } = await graphqlRequest(SEARCH_JOBS_QUERY, {
        clientKey,
        filters: { location: { coordinates: TOKYO } },
        pagination: { limit: 1 },
      })

      expect(errors).toBeUndefined()
      expect(data.searchJobs).toBeDefined()
    })

    it('accepts country without coordinates', async () => {
      const { data, errors } = await graphqlRequest(SEARCH_JOBS_QUERY, {
        clientKey,
        filters: { location: { country: 'jp' } },
        pagination: { limit: 1 },
      })

      expect(errors).toBeUndefined()
      expect(data.searchJobs).toBeDefined()
    })
  })
})
