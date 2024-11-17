import { gql } from '@apollo/client'

const SearchCompaniesQuery = gql`
  query searchCompanies ($clientKey: String!, $ids: [String!]!) {
    searchCompanies (clientKey: $clientKey, ids: $ids) {
      data {
        id
        name
      }
    }
  }
`

export default SearchCompaniesQuery