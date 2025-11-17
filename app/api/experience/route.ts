import { NextRequest, NextResponse } from 'next/server';
import { experienceRepository } from '@/infrastructure/supabase/repositories/experience-repository';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const locale = searchParams.get('locale') || 'en';

    const experience = await experienceRepository.getExperience(locale);

    return NextResponse.json(experience);
  } catch (error) {
    console.error('Error fetching experience:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
