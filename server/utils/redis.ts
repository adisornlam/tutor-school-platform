import Redis from 'ioredis'

let redisClient: Redis | null = null
let redisSubscriber: Redis | null = null

export function getRedisClient(): Redis {
  const config = useRuntimeConfig()
  
  if (!redisClient) {
    redisClient = new Redis({
      host: config.redisHost,
      port: config.redisPort,
      password: config.redisPassword || undefined,
      db: config.redisDb,
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
  const config = useRuntimeConfig()
  
  if (!redisSubscriber) {
    redisSubscriber = new Redis({
      host: config.redisHost,
      port: config.redisPort,
      password: config.redisPassword || undefined,
      db: config.redisDb,
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

