import { NextRequest, NextResponse } from 'next/server';
import { certificationsRepository } from '@/infrastructure/supabase/repositories/certifications-repository';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const locale = searchParams.get('locale') || 'en';

    const certifications = await certificationsRepository.getCertifications(locale);

    return NextResponse.json(certifications);
  } catch (error) {
    console.error('Error fetching certifications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
