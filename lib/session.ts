import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'admin_session';
const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours
const SESSION_REFRESH_THRESHOLD = 30 * 60 * 1000; // 30 minutes

export interface Session {
  authenticated: boolean;
  createdAt: number;
  lastActivity: number;
}

/**
 * Get current session from cookie
 */
export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie) {
    return null;
  }

  try {
    const session: Session = JSON.parse(sessionCookie.value);

    // Check if session is expired
    const now = Date.now();
    const sessionAge = now - session.createdAt;

    if (sessionAge > SESSION_DURATION) {
      // Session expired
      await destroySession();
      return null;
    }

    return session;
  } catch (error) {
    console.error('Error parsing session:', error);
    return null;
  }
}

/**
 * Create a new authenticated session
 */
export async function createSession(): Promise<Session> {
  const now = Date.now();
  const session: Session = {
    authenticated: true,
    createdAt: now,
    lastActivity: now,
  };

  await setSessionCookie(session);
  return session;
}

/**
 * Update session activity timestamp
 */
export async function refreshSession(session: Session): Promise<Session> {
  const now = Date.now();
  const timeSinceLastActivity = now - session.lastActivity;

  // Only refresh if threshold is exceeded (avoid too many cookie updates)
  if (timeSinceLastActivity > SESSION_REFRESH_THRESHOLD) {
    session.lastActivity = now;
    await setSessionCookie(session);
  }

  return session;
}

/**
 * Destroy the current session
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Set session cookie
 */
async function setSessionCookie(session: Session): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: SESSION_DURATION / 1000, // Convert to seconds
  });
}

/**
 * Check if session needs refresh
 */
export function shouldRefreshSession(session: Session): boolean {
  const now = Date.now();
  const timeSinceLastActivity = now - session.lastActivity;
  return timeSinceLastActivity > SESSION_REFRESH_THRESHOLD;
}
