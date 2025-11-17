import { NextRequest, NextResponse } from 'next/server';
import { settingsRepository } from '@/infrastructure/supabase/repositories/settings-repository';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const locale = searchParams.get('locale') || 'en';

    const heroSettings = await settingsRepository.getHeroSettings(locale);

    if (!heroSettings) {
      return NextResponse.json(
        { error: 'Hero settings not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(heroSettings);
  } catch (error) {
    console.error('Error fetching hero settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
