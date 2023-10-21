import { RateLimiterMemory } from 'rate-limiter-flexible';

const rateLimiter = new RateLimiterMemory({
	duration: 10 * 60,
	points: 5,
});

export default rateLimiter;
