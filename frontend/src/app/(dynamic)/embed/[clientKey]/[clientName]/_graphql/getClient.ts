import { gql } from '@apollo/client'

const GetClientQuery = gql`
  query getClient ($clientKey: String!) {
    getClient(clientKey: $clientKey) {
      data {
        jobBoardTitle
      }
    }
  }
`

export default GetClientQuery