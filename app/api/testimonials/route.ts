import { NextRequest, NextResponse } from 'next/server';
import { testimonialsRepository } from '@/infrastructure/supabase/repositories/testimonials-repository';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const locale = searchParams.get('locale') || 'en';

    const testimonials = await testimonialsRepository.getTestimonials(locale);

    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
