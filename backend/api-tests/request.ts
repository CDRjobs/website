type requestInput = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  url: string
  body?: unknown
}

const restRequest = async ({ method, url, body }: requestInput) => {
  const response = await fetch(url, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      Authorization: `Bearer ${process.env.API_TOKEN}`,
      'Content-Type': 'application/json',
    },
  })

  const responseBody = await response.json()

  return {
    status: response.status,
    body: responseBody,
  }
}

export default restRequest