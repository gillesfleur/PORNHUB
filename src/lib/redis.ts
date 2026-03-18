import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get<T>(key)
    return data
  } catch (error) {
    console.error(`[REDIS_GET_ERROR] key: ${key}`, error)
    return null
  }
}

export async function cacheSet(key: string, value: any, ttlSeconds: number = 3600): Promise<void> {
  try {
    await redis.set(key, value, { ex: ttlSeconds })
  } catch (error) {
    console.error(`[REDIS_SET_ERROR] key: ${key}`, error)
  }
}

export async function cacheDel(key: string): Promise<void> {
  try {
    await redis.del(key)
  } catch (error) {
    console.error(`[REDIS_DEL_ERROR] key: ${key}`, error)
  }
}

/**
 * Supprime les clés correspondant à un pattern (ex: "videos:*")
 * Attention : scan peut être lent sur de gros datasets, mais Ok pour Upstash et nos besoins initiaux.
 */
export async function cacheDelPattern(pattern: string): Promise<void> {
  try {
    let cursor = "0";
    do {
      const [nextCursor, keys] = await redis.scan(cursor, { match: pattern });
      if (keys.length > 0) {
        await redis.del(...keys);
      }
      cursor = nextCursor;
    } while (cursor !== "0");
  } catch (error) {
    console.error(`[REDIS_DEL_PATTERN_ERROR] pattern: ${pattern}`, error)
  }
}

export default redis
