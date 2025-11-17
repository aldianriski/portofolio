import { NextRequest, NextResponse } from 'next/server';
import { skillsRepository } from '@/infrastructure/supabase/repositories/skills-repository';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const locale = searchParams.get('locale') || 'en';

    const skillsByCategory = await skillsRepository.getSkillsByCategory(locale);

    return NextResponse.json(skillsByCategory);
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
