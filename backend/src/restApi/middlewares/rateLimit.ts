import { RateLimit } from 'koa2-ratelimit'

const rateLimitMiddleware = RateLimit.middleware({
  interval: { min: 15 }, 
  max: 1000,
})

export default rateLimitMiddleware