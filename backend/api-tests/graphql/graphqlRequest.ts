const request = async (graphqlQuery: { query: string }) => {
  const response = await fetch('http://localhost:4000/graphql', {
    method: 'POST',
    body: JSON.stringify(graphqlQuery),
    headers: { 'Content-Type': 'application/json' },
  })

  const responseBody = await response.json()

  return {
    status: response.status,
    body: responseBody,
  }
}

export default request