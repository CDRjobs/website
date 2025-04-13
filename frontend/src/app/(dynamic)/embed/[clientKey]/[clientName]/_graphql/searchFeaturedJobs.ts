import { gql } from '@apollo/client'

const SearchFeaturedJobsQuery = gql`
  query searchFeaturedJobs ($clientKey: String!, $filters: jobFiltersInput!, $limit: Int!) {
    searchFeaturedJobs (clientKey: $clientKey, filters: $filters, limit: $limit) {
      data {
        id
        title
        sourceUrl
        locations {
          country
          city
        }
        remote
        disciplines
        contractTypes
        currency
        minSalary
        maxSalary
        minYearsOfExperience
        guessedMinYearsOfExperience
        publishedAt
        company {
          id
          name
          companySize
          logoUrl
          cdrCategory
        }
      }
    }
  }
`

export default SearchFeaturedJobsQuery