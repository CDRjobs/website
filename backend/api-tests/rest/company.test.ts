import { omit } from 'lodash/fp'
import restRequest from '../request'

const companiesIds: string[] = []

describe('Company', () => {
  describe('Create companies', () => {
    it('Successfully creates a company', async () => {
      const { status, body } = await restRequest({
        method: 'POST',
        url: 'http://localhost:4000/api/v1/companies', // TODO: replace with an env var,
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
              logo: 'data:image/jpeg;base64,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'
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
        url: 'http://localhost:4000/api/v1/companies', // TODO: replace with an env var,
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
              logo: 'data:image/jpeg;base64,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'
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
        url: 'http://localhost:4000/api/v1/companies', // TODO: replace with an env var,
        body: {
          data: {
            companies: [{
              airTableId: '2',
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
        logo: 'data:image/jpeg;base64,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'
      }

      const { status, body } = await restRequest({
        method: 'PUT',
        url: `http://localhost:4000/api/v1/company/${companiesIds[0]}`, // TODO: replace with an env var,
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
        url: `http://localhost:4000/api/v1/company/${companiesIds[0]}`, // TODO: replace with an env var,
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
        url: 'http://localhost:4000/api/v1/companies', // TODO: replace with an env var,
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