import { NextRequest, NextResponse } from 'next/server';
import { projectsRepository } from '@/infrastructure/supabase/repositories/projects-repository';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const locale = searchParams.get('locale') || 'en';
    const featured = searchParams.get('featured') === 'true';

    const projects = featured
      ? await projectsRepository.getFeaturedProjects(locale)
      : await projectsRepository.getProjects(locale);

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
