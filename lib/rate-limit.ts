// Simple in-memory rate limiter (for development/small scale)
// For production with multiple instances, use Upstash Redis

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class InMemoryRateLimiter {
  private store: Map<string, RateLimitEntry> = new Map();
  private readonly limit: number;
  private readonly window: number; // in milliseconds

  constructor(limit: number = 5, windowInMinutes: number = 10) {
    this.limit = limit;
    this.window = windowInMinutes * 60 * 1000;

    // Clean up expired entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  async check(identifier: string): Promise<{ success: boolean; remaining: number }> {
    const now = Date.now();
    const entry = this.store.get(identifier);

    if (!entry || now > entry.resetTime) {
      // New window
      this.store.set(identifier, {
        count: 1,
        resetTime: now + this.window,
      });
      return { success: true, remaining: this.limit - 1 };
    }

    if (entry.count >= this.limit) {
      return { success: false, remaining: 0 };
    }

    entry.count++;
    this.store.set(identifier, entry);
    return { success: true, remaining: this.limit - entry.count };
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        this.store.delete(key);
      }
    }
  }
}

// Singleton instance - 5 requests per 10 minutes per IP
export const contactFormRateLimiter = new InMemoryRateLimiter(5, 10);

// Helper to get client IP
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  // Fallback to a default (development)
  return 'unknown';
}
