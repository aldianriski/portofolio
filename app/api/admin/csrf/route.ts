import { NextResponse } from 'next/server';
import { generateCsrfToken, setCsrfTokenCookie } from '@/lib/csrf';

/**
 * GET /api/admin/csrf
 * Generate and return a CSRF token for admin forms
 */
export async function GET() {
  try {
    const token = generateCsrfToken();
    await setCsrfTokenCookie(token);

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error generating CSRF token:', error);
    return NextResponse.json(
      { error: 'Failed to generate CSRF token' },
      { status: 500 }
    );
  }
}
