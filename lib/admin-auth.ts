import { cookies } from 'next/headers';

const ADMIN_COOKIE_NAME = 'admin-session';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';

export async function checkAdminAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME);
  return session?.value === 'authenticated';
}

export async function setAdminAuth() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearAdminAuth() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

export function verifyAdminPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}
