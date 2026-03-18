import redis from './redis'

export interface RateLimitResult {
  success: boolean
  remaining: number
  limit: number
  reset: number // Timestamp in milliseconds
}

/**
 * Rate limiting simple utilisant Redis.
 * @param key Clé d'identification (IP, UserID, etc.)
 * @param limit Nombre max de requêtes
 * @param windowSeconds Durée de la fenêtre en secondes
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  const now = Date.now()
  const windowKey = `ratelimit:${key}:${Math.floor(now / (windowSeconds * 1000))}`

  try {
    // Utilisation de INCR et EXPIRE pour la performance
    const count = await redis.incr(windowKey)
    
    if (count === 1) {
      // Première fois : définir l'expiration
      await redis.expire(windowKey, windowSeconds)
    }

    const remaining = Math.max(0, limit - count)
    const reset = (Math.floor(now / (windowSeconds * 1000)) + 1) * windowSeconds * 1000

    return {
      success: count <= limit,
      remaining,
      limit,
      reset,
    }
  } catch (error) {
    console.error(`[RATE_LIMIT_ERROR] key: ${key}`, error)
    // En cas d'erreur Redis, on laisse passer (fail-safe)
    return {
      success: true,
      remaining: limit,
      limit,
      reset: now + windowSeconds * 1000,
    }
  }
}
