import { omit } from 'lodash/fp'
import restRequest from './request'
import { API_ENDPOINT, BASE64_LOGO_A, BASE64_LOGO_B } from './utils/constants'

const companiesIds: string[] = []

describe('Company', () => {
  describe('Create companies', () => {
    it('Successfully creates a company', async () => {
      const { status, body } = await restRequest({
        method: 'POST',
        url: `${API_ENDPOINT}/companies`,
        body: {
          data: {
            companies: [{
              name: 'CDRjobs',
              airTableId: '1',
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
            companies: [{
              name: 'CDRjobs',
              airTableId: '1',
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
              airTableId: '2',
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
        url: `http://localhost:4000/api/v1/company/${companiesIds[0]}`,
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
        logoUrl: expect.any(String), // TODO: verify that the url changed
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
        url: `http://localhost:4000/api/v1/company/${companiesIds[0]}`,
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
        name: 'CDRjobs updated'
      })
    })
  })
})