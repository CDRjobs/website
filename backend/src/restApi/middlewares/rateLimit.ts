import { RateLimit } from 'koa2-ratelimit'

const rateLimitMiddleware = RateLimit.middleware({
  interval: { min: 15 }, 
  max: 100,
})

export default rateLimitMiddleware