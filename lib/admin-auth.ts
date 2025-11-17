import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { getSession, createSession, refreshSession, destroySession, shouldRefreshSession } from './session';

const ADMIN_COOKIE_NAME = 'admin-session';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';

export async function checkAdminAuth(): Promise<boolean> {
  // Check new session system
  const session = await getSession();
  if (session && session.authenticated) {
    // Auto-refresh if needed
    if (shouldRefreshSession(session)) {
      await refreshSession(session);
    }
    return true;
  }

  // Fallback to old cookie system for backward compatibility
  const cookieStore = await cookies();
  const oldSession = cookieStore.get(ADMIN_COOKIE_NAME);
  return oldSession?.value === 'authenticated';
}

export async function setAdminAuth() {
  // Use new session management
  await createSession();

  // Also set old cookie for backward compatibility
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearAdminAuth() {
  // Destroy new session
  await destroySession();

  // Also clear old cookie
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

export function verifyAdminPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

/**
 * Verify authentication for API routes
 * Returns error response if not authenticated
 */
export async function verifyAuth(request: NextRequest): Promise<NextResponse | null> {
  const isAuthenticated = await checkAdminAuth();

  if (!isAuthenticated) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  return null;
}
