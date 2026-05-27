import { omit } from 'lodash/fp'
import restRequest from './request'
import { API_ENDPOINT, BASE64_LOGO_A, BASE64_LOGO_B } from './utils/constants'

const companiesIds: string[] = []

const baseCompany = () => ({
  name: 'CDRjobs',
  airTableId: '1',
  companyUrl: 'https://cdrjobs.earth',
  careerPageUrl: 'https://cdrjobs.earth',
  companySize: 'xxs',
  hqCountry: 'it',
  cdrCategory: 'biomass',
  logo: BASE64_LOGO_A,
})

describe('Company', () => {
  describe('Create companies', () => {
    it('Successfully creates a company', async () => {
      const { status, body } = await restRequest({
        method: 'POST',
        url: `${API_ENDPOINT}/companies`,
        body: {
          data: {
            companies: [baseCompany()],
          }
        }
      })

      expect(status).toBe(200)
      expect(typeof body?.data?.[0]).toBe('string')
      companiesIds.push(body.data[0])
    })

    it('Returns an error when company already exists', async () => {
      const { status, body } = await restRequest({
        method: 'POST',
        url: `${API_ENDPOINT}/companies`,
        body: {
          data: {
            companies: [baseCompany()],
          }
        }
      })

      expect(status).toBe(400)
      expect(body?.error).toMatchObject({
        name: 'ValidationError',
        message: 'A validation error occured',
        details: [{
          code: 'custom',
          message: 'Some companies already exist, of airTableId: 1.',
          path: ['data', 'companies']
        }]
      })
    })

    it('Returns an error when company name is missing', async () => {
      const { status, body } = await restRequest({
        method: 'POST',
        url: `${API_ENDPOINT}/companies`,
        body: {
          data: {
            companies: [{
              ...omit(['name'], baseCompany()),
              airTableId: '2',
            }],
          }
        }
      })

      expect(status).toBe(400)
      expect(body?.error).toMatchObject({
        name: 'ValidationError',
        message: 'A validation error occured',
        details: [{
          code: 'invalid_type',
          expected: 'string',
          received: 'undefined',
          path: ['data', 'companies', 0, 'name'],
          message: 'Required'
        },]
      })
    })

    it('Returns an error when logo is not a valid base64 image', async () => {
      const { status, body } = await restRequest({
        method: 'POST',
        url: `${API_ENDPOINT}/companies`,
        body: {
          data: {
            companies: [{
              ...baseCompany(),
              airTableId: 'bad-logo',
              logo: 'not-a-valid-base64',
            }],
          }
        }
      })

      expect(status).toBe(400)
      expect(body?.error?.name).toBe('ValidationError')
    })

    it('Returns an error when companyUrl is not a valid URL', async () => {
      const { status } = await restRequest({
        method: 'POST',
        url: `${API_ENDPOINT}/companies`,
        body: {
          data: {
            companies: [{
              ...baseCompany(),
              airTableId: 'bad-url',
              companyUrl: 'not-a-url',
            }],
          }
        }
      })

      expect(status).toBe(400)
    })

    it('Returns an error when careerPageUrl is not a valid URL', async () => {
      const { status } = await restRequest({
        method: 'POST',
        url: `${API_ENDPOINT}/companies`,
        body: {
          data: {
            companies: [{
              ...baseCompany(),
              airTableId: 'bad-career-url',
              careerPageUrl: 'not-a-url',
            }],
          }
        }
      })

      expect(status).toBe(400)
    })

    it('Returns an error when companySize is invalid', async () => {
      const { status } = await restRequest({
        method: 'POST',
        url: `${API_ENDPOINT}/companies`,
        body: {
          data: {
            companies: [{
              ...baseCompany(),
              airTableId: 'bad-size',
              companySize: 'invalid_size',
            }],
          }
        }
      })

      expect(status).toBe(400)
    })

    it('Returns an error when hqCountry is invalid', async () => {
      const { status } = await restRequest({
        method: 'POST',
        url: `${API_ENDPOINT}/companies`,
        body: {
          data: {
            companies: [{
              ...baseCompany(),
              airTableId: 'bad-country',
              hqCountry: 'zz',
            }],
          }
        }
      })

      expect(status).toBe(400)
    })

    it('Returns an error when cdrCategory is invalid', async () => {
      const { status } = await restRequest({
        method: 'POST',
        url: `${API_ENDPOINT}/companies`,
        body: {
          data: {
            companies: [{
              ...baseCompany(),
              airTableId: 'bad-cdr',
              cdrCategory: 'nonExistentCategory',
            }],
          }
        }
      })

      expect(status).toBe(400)
    })

    it('Returns an error when unknown fields are provided', async () => {
      const { status, body } = await restRequest({
        method: 'POST',
        url: `${API_ENDPOINT}/companies`,
        body: {
          data: {
            companies: [{
              ...baseCompany(),
              airTableId: 'unknown-fields',
              extraField: 'should fail',
            }],
          }
        }
      })

      expect(status).toBe(400)
      expect(body.error.details).toContainEqual(expect.objectContaining({
        code: 'unrecognized_keys',
      }))
    })

    it('Returns an error with malformed body (missing data wrapper)', async () => {
      const { status } = await restRequest({
        method: 'POST',
        url: `${API_ENDPOINT}/companies`,
        body: {
          companies: [baseCompany()],
        }
      })

      expect(status).toBe(400)
    })
  })

  describe('Update company', () => {
    it('Successfully updates a company', async () => {
      const updateData = {
        name: 'CDRjobs updated',
        companyUrl: 'https://cdrjobs.earth/updated',
        careerPageUrl: 'https://cdrjobs.earth/updated',
        companySize: 's',
        hqCountry: 'fr',
        cdrCategory: 'forest',
        logo: BASE64_LOGO_B,
      }

      const { status, body } = await restRequest({
        method: 'PUT',
        url: `${API_ENDPOINT}/company/${companiesIds[0]}`,
        body: {
          data: {
            company: {
              ...updateData,
            },
          }
        }
      })

      expect(status).toBe(200)
      expect(body.data).toMatchObject({
        ...omit(['hqCountry', 'logo'], updateData),
        id: expect.any(String),
        airTableId: '1',
        logoUrl: expect.any(String),
        hqLocation: {
          id: expect.any(String),
          city: null,
          country: 'fr',
          countryCityKey: 'fr;'
        },
      })
    })

    it('Returns an error when trying to update airTableId', async () => {
      const { status, body } = await restRequest({
        method: 'PUT',
        url: `${API_ENDPOINT}/company/${companiesIds[0]}`,
        body: {
          data: {
            company: {
              airTableId: '2',
            },
          }
        }
      })

      expect(status).toBe(400)
      expect(body?.error).toMatchObject({
        name: 'ValidationError',
        message: 'A validation error occured',
        details: [{
          code: 'unrecognized_keys',
          message: "Unrecognized key(s) in object: 'airTableId'",
          path: ['data', 'company']
        }]
      })
    })

    it('Returns an error when updating a non-existent company', async () => {
      const { status, body } = await restRequest({
        method: 'PUT',
        url: `${API_ENDPOINT}/company/non-existent-id`,
        body: {
          data: {
            company: { name: 'Updated' },
          }
        }
      })

      expect(status).toBe(400)
      expect(body.error.message).toContain("doesn't exist")
    })

    it('Successfully updates only a single field', async () => {
      const { status, body } = await restRequest({
        method: 'PUT',
        url: `${API_ENDPOINT}/company/${companiesIds[0]}`,
        body: {
          data: {
            company: { name: 'Only name updated' },
          }
        }
      })

      expect(status).toBe(200)
      expect(body.data.name).toBe('Only name updated')
      expect(body.data.companySize).toBe('s')
    })

    it('Returns an error when updating with invalid logo', async () => {
      const { status } = await restRequest({
        method: 'PUT',
        url: `${API_ENDPOINT}/company/${companiesIds[0]}`,
        body: {
          data: {
            company: { logo: 'invalid-base64' },
          }
        }
      })

      expect(status).toBe(400)
    })

    it('Returns an error when updating with invalid URL', async () => {
      const { status } = await restRequest({
        method: 'PUT',
        url: `${API_ENDPOINT}/company/${companiesIds[0]}`,
        body: {
          data: {
            company: { companyUrl: 'not-a-url' },
          }
        }
      })

      expect(status).toBe(400)
    })

    it('Returns an error when name is empty', async () => {
      const { status } = await restRequest({
        method: 'PUT',
        url: `${API_ENDPOINT}/company/${companiesIds[0]}`,
        body: {
          data: {
            company: { name: '' },
          }
        }
      })

      expect(status).toBe(400)
    })
  })

  describe('Get companies', () => {
    it('Successfully get companies', async () => {
      const { status, body } = await restRequest({
        method: 'GET',
        url: `${API_ENDPOINT}/companies`,
      })

      expect(status).toBe(200)
      const company = body.data.find((company: { id: string }) => company.id === companiesIds[0])
      expect(company).toMatchObject({
        airTableId: '1',
        careerPageUrl: 'https://cdrjobs.earth/updated',
        cdrCategory: 'forest',
        companySize: 's',
        companyUrl: 'https://cdrjobs.earth/updated',
        hqLocation: {
          city: null,
          country: 'fr',
          countryCityKey: 'fr;',
          id: expect.any(String),
        },
        id: expect.any(String),
        logoUrl: expect.any(String),
        name: 'Only name updated'
      })
    })

    it('Supports pagination with limit', async () => {
      const { status, body } = await restRequest({
        method: 'GET',
        url: `${API_ENDPOINT}/companies?limit=1`,
      })

      expect(status).toBe(200)
      expect(body.data.length).toBeLessThanOrEqual(1)
    })
  })
})