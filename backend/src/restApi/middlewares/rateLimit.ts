import { RateLimit } from 'koa2-ratelimit'

const rateLimitMiddleware = RateLimit.middleware({
  interval: { min: 15 }, 
  max: 3000,
})

export default rateLimitMiddleware