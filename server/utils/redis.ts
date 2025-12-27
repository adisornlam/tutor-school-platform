import Redis from 'ioredis'

let redisClient: Redis | null = null
let redisSubscriber: Redis | null = null

export function getRedisClient(): Redis {
  // ✅ ใช้ process.env โดยตรงเพื่อให้อ่านค่า environment variables ตอน runtime
  if (!redisClient) {
    redisClient = new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: parseInt(process.env.REDIS_PORT || '46961'),
      password: process.env.REDIS_PASSWORD || 'nd3Y4TDNrDLfCTs6iM2',
      db: parseInt(process.env.REDIS_DB || '0'),
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000)
        return delay
      },
      maxRetriesPerRequest: 3
    })

    redisClient.on('error', (error) => {
      console.error('[Redis] Client error:', error)
    })

    redisClient.on('connect', () => {
      console.log('[Redis] Client connected')
    })
  }

  return redisClient
}

export function getRedisSubscriber(): Redis {
  // ✅ ใช้ process.env โดยตรงเพื่อให้อ่านค่า environment variables ตอน runtime
  if (!redisSubscriber) {
    redisSubscriber = new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: parseInt(process.env.REDIS_PORT || '46961'),
      password: process.env.REDIS_PASSWORD || 'nd3Y4TDNrDLfCTs6iM2',
      db: parseInt(process.env.REDIS_DB || '0'),
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000)
        return delay
      },
      maxRetriesPerRequest: null // Subscribers need null for pub/sub
    })

    redisSubscriber.on('error', (error) => {
      console.error('[Redis] Subscriber error:', error)
    })

    redisSubscriber.on('connect', () => {
      console.log('[Redis] Subscriber connected')
    })
  }

  return redisSubscriber
}

export async function closeRedisConnections() {
  if (redisClient) {
    await redisClient.quit()
    redisClient = null
  }
  if (redisSubscriber) {
    await redisSubscriber.quit()
    redisSubscriber = null
  }
}

