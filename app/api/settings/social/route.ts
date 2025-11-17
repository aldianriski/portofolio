import { NextRequest, NextResponse } from 'next/server';
import { settingsRepository } from '@/infrastructure/supabase/repositories/settings-repository';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const locale = searchParams.get('locale') || 'en';

    const socialSettings = await settingsRepository.getSocialSettings(locale);

    if (!socialSettings) {
      return NextResponse.json(
        { error: 'Social settings not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(socialSettings);
  } catch (error) {
    console.error('Error fetching social settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
