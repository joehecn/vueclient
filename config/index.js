let baseUrl = 'http://localhost:4003/api/v1'
if (import.meta.env.PROD) {
  baseUrl = '/api/v1'
}

export default {
  baseUrl
}
