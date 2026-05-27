import restRequest from './request'
import { API_ENDPOINT, BASE64_LOGO_A } from './utils/constants'

let companyId: string
let clientId: string

describe('Client', () => {
  beforeAll(async () => {
    const { body: createBody } = await restRequest({
      method: 'POST',
      url: `${API_ENDPOINT}/companies`,
      body: {
        data: {
          companies: [{
            name: 'Client Test Company',
            airTableId: 'client-test-company',
            companyUrl: 'https://example.com',
            careerPageUrl: 'https://example.com/careers',
            companySize: 'xxs',
            hqCountry: 'fr',
            cdrCategory: 'biomass',
            logo: BASE64_LOGO_A,
          }],
        }
      }
    })

    companyId = createBody.data[0]
  })

  describe('Create client', () => {
    it('Successfully creates a client', async () => {
      const { status, body } = await restRequest({
        method: 'POST',
        url: `${API_ENDPOINT}/client`,
        body: {
          data: {
            client: {
              name: 'Test Client',
              companies: [companyId],
              countries: ['fr', 'de'],
              showAllJobs: false,
              jobBoardTitle: 'My Job Board',
            },
          }
        }
      })

      expect(status).toBe(200)
      expect(body.data).toMatchObject({
        id: expect.any(String),
        name: 'Test Client',
        showAllJobs: false,
        jobBoardTitle: 'My Job Board',
      })
      clientId = body.data.id
    })

    it('Fails when name already exists', async () => {
      const { status, body } = await restRequest({
        method: 'POST',
        url: `${API_ENDPOINT}/client`,
        body: {
          data: {
            client: {
              name: 'Test Client',
            },
          }
        }
      })

      expect(status).toBe(400)
      expect(body.error.details).toContainEqual(expect.objectContaining({
        message: 'A client with this name already exists.',
      }))
    })

    it('Fails when name is empty', async () => {
      const { status } = await restRequest({
        method: 'POST',
        url: `${API_ENDPOINT}/client`,
        body: {
          data: {
            client: {
              name: '',
            },
          }
        }
      })

      expect(status).toBe(400)
    })

    it('Fails when name is missing', async () => {
      const { status } = await restRequest({
        method: 'POST',
        url: `${API_ENDPOINT}/client`,
        body: {
          data: {
            client: {},
          }
        }
      })

      expect(status).toBe(400)
    })

    it('Fails when companies contain non-existent IDs', async () => {
      const { status, body } = await restRequest({
        method: 'POST',
        url: `${API_ENDPOINT}/client`,
        body: {
          data: {
            client: {
              name: 'Client with bad companies',
              companies: ['non-existent-company-id'],
            },
          }
        }
      })

      expect(status).toBe(400)
      expect(body.error.details).toContainEqual(expect.objectContaining({
        message: expect.stringContaining('were not found'),
      }))
    })

    it('Fails when countries contain invalid codes', async () => {
      const { status } = await restRequest({
        method: 'POST',
        url: `${API_ENDPOINT}/client`,
        body: {
          data: {
            client: {
              name: 'Client with bad countries',
              countries: ['zz'],
            },
          }
        }
      })

      expect(status).toBe(400)
    })

    it('Fails when unknown fields are provided', async () => {
      const { status, body } = await restRequest({
        method: 'POST',
        url: `${API_ENDPOINT}/client`,
        body: {
          data: {
            client: {
              name: 'Unknown fields client',
              extraField: 'nope',
            },
          }
        }
      })

      expect(status).toBe(400)
      expect(body.error.details).toContainEqual(expect.objectContaining({
        code: 'unrecognized_keys',
      }))
    })

    it('Fails with malformed body (missing data wrapper)', async () => {
      const { status } = await restRequest({
        method: 'POST',
        url: `${API_ENDPOINT}/client`,
        body: {
          client: { name: 'No data wrapper' },
        }
      })

      expect(status).toBe(400)
    })
  })

  describe('Update client', () => {
    it('Successfully updates a client', async () => {
      const { status, body } = await restRequest({
        method: 'PUT',
        url: `${API_ENDPOINT}/client/${clientId}`,
        body: {
          data: {
            client: {
              name: 'Updated Client',
              showAllJobs: true,
            },
          }
        }
      })

      expect(status).toBe(200)
      expect(body.data.name).toBe('Updated Client')
      expect(body.data.showAllJobs).toBe(true)
    })

    it('Fails to update a non-existent client', async () => {
      const { status, body } = await restRequest({
        method: 'PUT',
        url: `${API_ENDPOINT}/client/non-existent-id`,
        body: {
          data: {
            client: { name: 'Updated' },
          }
        }
      })

      expect(status).toBe(400)
      expect(body.error.message).toContain("doesn't exist")
    })

    it('Fails when updating companies with non-existent IDs', async () => {
      const { status, body } = await restRequest({
        method: 'PUT',
        url: `${API_ENDPOINT}/client/${clientId}`,
        body: {
          data: {
            client: {
              companies: ['non-existent-company-id'],
            },
          }
        }
      })

      expect(status).toBe(400)
      expect(body.error.details).toContainEqual(expect.objectContaining({
        message: expect.stringContaining('were not found'),
      }))
    })

    it('Fails when updating with unknown fields', async () => {
      const { status, body } = await restRequest({
        method: 'PUT',
        url: `${API_ENDPOINT}/client/${clientId}`,
        body: {
          data: {
            client: { unknownField: 'nope' },
          }
        }
      })

      expect(status).toBe(400)
      expect(body.error.details).toContainEqual(expect.objectContaining({
        code: 'unrecognized_keys',
      }))
    })

    it('Successfully updates only the name', async () => {
      const { status, body } = await restRequest({
        method: 'PUT',
        url: `${API_ENDPOINT}/client/${clientId}`,
        body: {
          data: {
            client: { name: 'Only Name Changed' },
          }
        }
      })

      expect(status).toBe(200)
      expect(body.data.name).toBe('Only Name Changed')
      expect(body.data.showAllJobs).toBe(true)
    })
  })
})
