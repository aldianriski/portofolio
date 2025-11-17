import { NextRequest, NextResponse } from 'next/server';
import { educationRepository } from '@/infrastructure/supabase/repositories/education-repository';
import { organizationsRepository } from '@/infrastructure/supabase/repositories/organizations-repository';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const locale = searchParams.get('locale') || 'en';

    const [education, organizations] = await Promise.all([
      educationRepository.getEducation(locale),
      organizationsRepository.getOrganizations(locale),
    ]);

    return NextResponse.json({ education, organizations });
  } catch (error) {
    console.error('Error fetching education/organizations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
