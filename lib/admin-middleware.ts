import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from './admin-auth';
import { verifyCsrfToken, getCsrfHeaderName } from './csrf';
import { checkAdminRateLimit, getRateLimitIdentifier, RateLimitConfig } from './admin-rate-limit';

export interface AdminMiddlewareOptions {
  /**
   * Require CSRF token verification
   * @default true for POST/PUT/PATCH/DELETE
   */
  requireCsrf?: boolean;

  /**
   * Enable rate limiting
   * @default true
   */
  enableRateLimit?: boolean;

  /**
   * Rate limit configuration
   */
  rateLimitConfig?: RateLimitConfig;
}

/**
 * Protect admin API endpoint with authentication, CSRF, and rate limiting
 *
 * @example
 * ```typescript
 * export async function POST(request: NextRequest) {
 *   const middlewareResponse = await protectAdminRoute(request);
 *   if (middlewareResponse) return middlewareResponse;
 *
 *   // Your route logic here
 * }
 * ```
 */
export async function protectAdminRoute(
  request: NextRequest,
  options: AdminMiddlewareOptions = {}
): Promise<NextResponse | null> {
  const {
    requireCsrf = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method),
    enableRateLimit = true,
    rateLimitConfig = {
      maxRequests: 100,
      windowMs: 15 * 60 * 1000, // 15 minutes
    },
  } = options;

  // 1. Check authentication
  const authError = await verifyAuth(request);
  if (authError) {
    return authError;
  }

  // 2. Check rate limit
  if (enableRateLimit) {
    const identifier = getRateLimitIdentifier(request);
    const rateLimitResult = checkAdminRateLimit(identifier, rateLimitConfig);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: 'Too many requests',
          resetTime: rateLimitResult.resetTime,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitConfig.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    // Add rate limit headers to response (will be added later)
    request.headers.set('X-RateLimit-Limit', rateLimitConfig.maxRequests.toString());
    request.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
    request.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toString());
  }

  // 3. Check CSRF token for state-changing requests
  if (requireCsrf) {
    const csrfToken = request.headers.get(getCsrfHeaderName());
    const isValid = await verifyCsrfToken(csrfToken);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid CSRF token' },
        { status: 403 }
      );
    }
  }

  // All checks passed
  return null;
}

/**
 * Add rate limit headers to response
 */
export function addRateLimitHeaders(
  response: NextResponse,
  request: NextRequest
): NextResponse {
  const limit = request.headers.get('X-RateLimit-Limit');
  const remaining = request.headers.get('X-RateLimit-Remaining');
  const reset = request.headers.get('X-RateLimit-Reset');

  if (limit) response.headers.set('X-RateLimit-Limit', limit);
  if (remaining) response.headers.set('X-RateLimit-Remaining', remaining);
  if (reset) response.headers.set('X-RateLimit-Reset', reset);

  return response;
}
